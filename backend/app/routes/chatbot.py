import os
import re

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from google import genai
from pydantic import BaseModel

from app.services import rag_service

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
CHAT_MODEL = "gemini-flash-latest"

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


def _contains_image_input(text: str) -> bool:
    """Detect if the message contains image data or image references."""
    if re.search(r"data:image/", text):
        return True
    if re.search(r"\.(png|jpg|jpeg|gif|bmp|webp|svg|ico)($|\s|\?|#)", text, re.IGNORECASE):
        return True
    return False


@router.post("/")
async def chat(req: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: GEMINI_API_KEY is not set.",
        )

    if _contains_image_input(req.message):
        raise HTTPException(
            status_code=400,
            detail="This model does not support image input. Please send text-only messages.",
        )

    client = genai.Client(api_key=GEMINI_API_KEY)

    try:
        # Retrieval-Augmented Generation: only pull the knowledge-base
        # chunks that are semantically relevant to this message, instead
        # of dumping the entire knowledge base into the prompt every time.
        context_chunks = rag_service.retrieve(req.message, top_k=4)
        context = "\n".join(f"- {chunk}" for chunk in context_chunks) or "No relevant context found."

        system_prompt = f"""You are FlowBik's chatbot assistant.
Always answer as a representative of FlowBik.

Relevant FlowBik knowledge:
{context}

Rules:
- For questions about services, products, or company info, ONLY use the knowledge above.
- If asked "who built you" or "what are you", say you are built by FlowBik.
- Keep answers short, clear, and friendly.
- If the knowledge above doesn't cover the question, say so honestly — don't make things up."""

        response = client.models.generate_content(
            model=CHAT_MODEL,
            contents=f"{system_prompt}\n\nUser: {req.message}\nAssistant:",
        )

        bot_reply = response.text.strip() if hasattr(response, "text") and response.text else ""

        if not bot_reply:
            bot_reply = "I couldn't generate a response. Please try again."

        return {"bot_reply": bot_reply}

    except Exception as e:
        print(f"Chatbot error: {e}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
