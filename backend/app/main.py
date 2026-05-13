from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chatbot

app = FastAPI(
    title="FlowBik Chatbot API",
    version="1.0.0",
    description="Chatbot API for FlowBik.",
)

# CORS — allows your Next.js frontend to call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://flowbik.vercel.app", # Add your Vercel production URL
        "*", # Fallback for development/testing (restrict this later)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])

@app.get("/", tags=["Root"])
async def root():
    return {"status": "ok", "message": "FlowBik Chatbot API is running."}