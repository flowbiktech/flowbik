import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
from pathlib import Path

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set in .env")

genai.configure(api_key=GEMINI_API_KEY)

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


def _contains_image_input(text: str) -> bool:
    """Detect if the message contains image data or image references."""
    # Data URI (base64 image) like data:image/png;base64,...
    if re.search(r"data:image/", text):
        return True
    # Image file extensions in URLs or file references
    if re.search(r"\.(png|jpg|jpeg|gif|bmp|webp|svg|ico)($|\s|\?|#)", text, re.IGNORECASE):
        return True
    # Inline base64 blob prefixed with data:image (covers pasted images)
    if re.search(r"data:image/\w+;base64,\s*[A-Za-z0-9+/]", text):
        return True
    return False


def load_knowledge_base() -> list | dict:
    """Load knowledge base from JSON file."""
    kb_path = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"
    if kb_path.exists():
        try:
            with open(kb_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading knowledge base: {e}")
    return []


@router.post("/")
async def chat(req: ChatRequest):
    knowledge_base = load_knowledge_base()

    if _contains_image_input(req.message):
        raise HTTPException(
            status_code=400,
            detail="This model does not support image input. Please send text-only messages."
        )

    try:
        system_prompt = """You are SoftZenLabs' chatbot assistant.
Always answer as a representative of SoftZenLabs.

SoftZenLabs Knowledge Base:
{kb}

Rules:
- For questions about services, products, or company info, ONLY use the knowledge base above.
- If asked "who built you" or "what are you", say you are built by SoftZenLabs.
- Keep answers short, clear, and friendly.
- If you don't know something, say so honestly — don't make things up.""".format(
            kb=json.dumps(knowledge_base, indent=2)
        )

        model = genai.GenerativeModel("gemini-flash-latest")
        response = model.generate_content(
            f"{system_prompt}\n\nUser: {req.message}\nAssistant:"
        )

        bot_reply = response.text.strip() if hasattr(response, "text") else ""

        if not bot_reply:
            bot_reply = "I couldn't generate a response. Please try again."

        return {
            "bot_reply": bot_reply,
        }

    except Exception as e:
        print(f"Chatbot error: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")