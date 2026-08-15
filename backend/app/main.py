from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chatbot, contact

app = FastAPI(
    title="FlowBik API",
    version="1.0.0",
    description="API for FlowBik — chatbot and contact form.",
)

# CORS — allow Next.js frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://flowbik.vercel.app",
        "https://flowbik.com",
        "https://www.flowbik.com",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # allow all Vercel preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])

@app.get("/", tags=["Root"])
async def root():
    return {"status": "ok", "message": "FlowBik API is running."}