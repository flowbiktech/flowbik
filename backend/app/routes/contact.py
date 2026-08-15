import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
FROM = "FlowBik <hello@flowbik.com>"
OWNER_EMAIL = "hello@flowbik.com"

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: str
    service: str = ""
    message: str


async def send_email(to: list[str], subject: str, html: str, reply_to: str | None = None):
    """Send an email via the Resend API."""
    if not RESEND_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Server configuration error: RESEND_API_KEY is not set.",
        )

    payload: dict = {
        "from": FROM,
        "to": to,
        "subject": subject,
        "html": html,
    }
    if reply_to:
        payload["reply_to"] = reply_to

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=15,
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=502,
            detail=f"Email provider error: {response.text}",
        )
    return response.json()


@router.post("/")
async def contact(req: ContactRequest):
    if not req.name or not req.email or not req.message:
        raise HTTPException(status_code=400, detail="Name, email, and message are required.")

    service_row = f"""
        <tr>
          <td style="padding:10px 0;color:#a1a1aa;font-size:13px;">Service</td>
          <td style="padding:10px 0;color:#f4f4f8;">{req.service}</td>
        </tr>
    """ if req.service else ""

    owner_html = f"""
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0e0e1a;color:#e4e4f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:700;color:white;">New Message — FlowBik</h1>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#a1a1aa;font-size:13px;width:120px;">Name</td>
              <td style="padding:10px 0;color:#f4f4f8;font-weight:600;">{req.name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#a1a1aa;font-size:13px;">Email</td>
              <td style="padding:10px 0;"><a href="mailto:{req.email}" style="color:#818cf8;">{req.email}</a></td>
            </tr>
            {service_row}
          </table>
          <div style="margin-top:20px;padding:20px;background:#1a1a2e;border-radius:8px;border-left:3px solid #6366f1;">
            <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.05em;">Message</p>
            <p style="margin:0;color:#e4e4f0;line-height:1.7;white-space:pre-wrap;">{req.message}</p>
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:#52525b;">
          Sent via FlowBik contact form · hello@flowbik.com
        </div>
      </div>
    """

    user_html = f"""
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0e0e1a;color:#e4e4f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:700;color:white;">Thanks for reaching out! 👋</h1>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 16px;color:#e4e4f0;line-height:1.7;">Hi <strong>{req.name}</strong>,</p>
          <p style="margin:0 0 16px;color:#a1a1aa;line-height:1.7;">
            We've received your message and will get back to you within
            <strong style="color:#818cf8;">24 hours</strong> on business days.
          </p>
          <div style="margin:24px 0;padding:20px;background:#1a1a2e;border-radius:8px;border-left:3px solid #6366f1;">
            <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.05em;">Your message</p>
            <p style="margin:0;color:#e4e4f0;line-height:1.7;white-space:pre-wrap;">{req.message}</p>
          </div>
          <p style="margin:24px 0 0;color:#a1a1aa;line-height:1.7;">
            Feel free to reply to this email if you have anything else to add.
          </p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:#52525b;">
          FlowBik · hello@flowbik.com · Automated confirmation
        </div>
      </div>
    """

    # 1) Notify owner
    await send_email(
        to=[OWNER_EMAIL],
        subject=f"New Contact{f' [{req.service}]' if req.service else ''}: {req.name}",
        html=owner_html,
        reply_to=req.email,
    )

    # 2) Auto-reply to visitor
    try:
        await send_email(
            to=[req.email],
            subject="We received your message — FlowBik",
            html=user_html,
        )
    except Exception:
        # Don't fail the whole request if the auto-reply fails
        pass

    return {"success": True}
