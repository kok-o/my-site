import { SITE_CONFIG } from '@/lib/constants'

interface ContactPayload {
  name?: unknown
  email?: unknown
  subject?: unknown
  message?: unknown
  website?: unknown
}

function cleanString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  let payload: ContactPayload
  try {
    payload = (await request.json()) as ContactPayload
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON payload' }, { status: 400 })
  }

  // Honeypot field for automated bots.
  if (cleanString(payload.website, 120)) {
    return Response.json({ ok: true })
  }

  const name = cleanString(payload.name, 120)
  const email = cleanString(payload.email, 200)
  const subject = cleanString(payload.subject, 200) || `Portfolio message from ${name}`
  const message = cleanString(payload.message, 4000)

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: 'Missing or invalid fields' }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || `${SITE_CONFIG.name} Portfolio <onboarding@resend.dev>`,
        to: [SITE_CONFIG.email],
        reply_to: email,
        subject,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    })
    if (!response.ok) {
      return Response.json({ ok: false, error: 'Email delivery failed' }, { status: 502 })
    }
    return Response.json({ ok: true })
  }

  const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY
  if (web3formsKey) {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: web3formsKey,
        subject,
        from_name: name,
        email,
        message,
      }),
    })
    if (!response.ok) {
      return Response.json({ ok: false, error: 'Email delivery failed' }, { status: 502 })
    }
    return Response.json({ ok: true })
  }

  return Response.json({ ok: false, configured: false }, { status: 503 })
}
