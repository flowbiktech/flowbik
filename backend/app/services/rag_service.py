"""
Lightweight local RAG (Retrieval-Augmented Generation) service.

No external vector database is used. Knowledge base chunks are embedded
via the Gemini embeddings API and the resulting vectors are cached to a
JSON file on disk. At query time the user's message is embedded and
compared against the cached vectors with plain cosine similarity to pull
back the most relevant chunks, which are then fed to the chat model as
context.
"""

import hashlib
import json
import math
import os
from pathlib import Path
from typing import TypedDict

from google import genai
from google.genai import types

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
KB_PATH = DATA_DIR / "knowledge_base.json"
CACHE_PATH = DATA_DIR / "embeddings_cache.json"

EMBEDDING_MODEL = "gemini-embedding-001"
EMBEDDING_DIM = 768  # trims the default 3072-dim output to keep the cache small

_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return _client


class Chunk(TypedDict):
    id: str
    text: str


def load_knowledge_base() -> dict:
    """Load the raw knowledge base JSON from disk."""
    if not KB_PATH.exists():
        return {}
    with open(KB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def build_chunks(kb: dict) -> list[Chunk]:
    """Flatten the knowledge base into small, retrievable text chunks."""
    chunks: list[Chunk] = []

    company = kb.get("company", {})
    if company:
        chunks.append({
            "id": "company",
            "text": (
                f"Company: {company.get('name', '')}. "
                f"Tagline: {company.get('tagline', '')}. "
                f"Stage: {company.get('stage', '')}. "
                f"Founded: {company.get('founded', '')}."
            ),
        })

    for i, service in enumerate(kb.get("services", [])):
        chunks.append({
            "id": f"service-{i}",
            "text": f"Service — {service.get('name', '')}: {service.get('description', '')}",
        })

    for i, project in enumerate(kb.get("projects", [])):
        chunks.append({
            "id": f"project-{i}",
            "text": f"Project — {project.get('name', '')}: status is {project.get('status', '')}",
        })

    contact = kb.get("contact", {})
    if contact:
        chunks.append({
            "id": "contact",
            "text": f"Contact: email {contact.get('email', '')}. {contact.get('note', '')}",
        })

    for i, faq in enumerate(kb.get("faq", [])):
        chunks.append({
            "id": f"faq-{i}",
            "text": f"FAQ — Q: {faq.get('question', '')} A: {faq.get('answer', '')}",
        })

    return chunks


def _kb_hash(kb: dict) -> str:
    payload = json.dumps(
        {"kb": kb, "model": EMBEDDING_MODEL, "dim": EMBEDDING_DIM}, sort_keys=True
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def _embed(text: str, task_type: str) -> list[float]:
    result = _get_client().models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(
            task_type=task_type,
            output_dimensionality=EMBEDDING_DIM,
        ),
    )
    return result.embeddings[0].values


def _cosine_similarity(a: list[float], b: list[float]) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def _load_cache() -> dict | None:
    if not CACHE_PATH.exists():
        return None
    try:
        with open(CACHE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def _save_cache(cache: dict) -> None:
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        with open(CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(cache, f)
    except Exception as e:
        print(f"Warning: could not persist embeddings cache: {e}")


def get_embedded_chunks() -> list[dict]:
    """
    Return knowledge-base chunks with embeddings, using a local JSON cache
    keyed by a hash of the knowledge base content. Recomputes embeddings
    only when the knowledge base has changed or no cache exists yet.
    """
    kb = load_knowledge_base()
    chunks = build_chunks(kb)
    kb_hash = _kb_hash(kb)

    cache = _load_cache()
    if cache and cache.get("kb_hash") == kb_hash:
        return cache["chunks"]

    embedded_chunks = []
    for chunk in chunks:
        embedding = _embed(chunk["text"], task_type="retrieval_document")
        embedded_chunks.append({**chunk, "embedding": embedding})

    _save_cache({"kb_hash": kb_hash, "chunks": embedded_chunks})
    return embedded_chunks


def retrieve(query: str, top_k: int = 4) -> list[str]:
    """Return the top_k knowledge-base chunk texts most relevant to query."""
    embedded_chunks = get_embedded_chunks()
    if not embedded_chunks:
        return []

    query_embedding = _embed(query, task_type="retrieval_query")

    scored = [
        (_cosine_similarity(query_embedding, chunk["embedding"]), chunk["text"])
        for chunk in embedded_chunks
    ]
    scored.sort(key=lambda pair: pair[0], reverse=True)

    return [text for _, text in scored[:top_k]]
