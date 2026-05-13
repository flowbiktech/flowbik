import { NextResponse } from "next/server";
import { Resend } from "resend";


// Domain verified ✅ — sending from hello@flowbik.com
const FROM = "SoftZenLabs <hello@flowbik.com>";
const OWNER_EMAIL = "hello@flowbik.com";
const DOMAIN_VERIFIED = true;


export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { name, email, service, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // 1) Notification email to YOU
    const ownerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0e0e1a;color:#e4e4f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:700;color:white;">New Message — SoftZenLabs</h1>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;color:#a1a1aa;font-size:13px;width:120px;">Name</td>
              <td style="padding:10px 0;color:#f4f4f8;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#a1a1aa;font-size:13px;">Email</td>
              <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#818cf8;">${email}</a></td>
            </tr>
            ${service ? `<tr>
              <td style="padding:10px 0;color:#a1a1aa;font-size:13px;">Service</td>
              <td style="padding:10px 0;color:#f4f4f8;">${service}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top:20px;padding:20px;background:#1a1a2e;border-radius:8px;border-left:3px solid #6366f1;">
            <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.05em;">Message</p>
            <p style="margin:0;color:#e4e4f0;line-height:1.7;white-space:pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:#52525b;">
          Sent via SoftZenLabs contact form · hello@flowbik.com
        </div>
      </div>
    `;

    // 2) Auto-reply to the visitor
    const userHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0e0e1a;color:#e4e4f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;">
          <h1 style="margin:0;font-size:22px;font-weight:700;color:white;">Thanks for reaching out! 👋</h1>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 16px;color:#e4e4f0;line-height:1.7;">Hi <strong>${name}</strong>,</p>
          <p style="margin:0 0 16px;color:#a1a1aa;line-height:1.7;">
            We've received your message and will get back to you within 
            <strong style="color:#818cf8;">24 hours</strong> on business days.
          </p>
          <div style="margin:24px 0;padding:20px;background:#1a1a2e;border-radius:8px;border-left:3px solid #6366f1;">
            <p style="margin:0 0 8px;font-size:12px;color:#a1a1aa;text-transform:uppercase;letter-spacing:.05em;">Your message</p>
            <p style="margin:0;color:#e4e4f0;line-height:1.7;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="margin:24px 0 0;color:#a1a1aa;line-height:1.7;">
            Feel free to reply to this email if you have anything else to add.
          </p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,.06);font-size:11px;color:#52525b;">
          SoftZenLabs · hello@flowbik.com · Automated confirmation
        </div>
      </div>
    `;

    // Send owner notification (always works — it's your own Resend account email)
    const ownerResult = await resend.emails.send({
      from: FROM,
      to: [OWNER_EMAIL],
      replyTo: email,
      subject: `New Contact${service ? ` [${service}]` : ""}: ${name}`,
      html: ownerHtml,
    });

    if (ownerResult.error) {
      console.error("Resend error:", ownerResult.error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    // Auto-reply only works after domain is verified
    if (DOMAIN_VERIFIED) {
      await resend.emails.send({
        from: FROM,
        to: [email],
        subject: "We received your message — SoftZenLabs",
        html: userHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
