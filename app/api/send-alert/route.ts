import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const secret = process.env.ALERT_API_SECRET
    if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    const data = await resend.emails.send({
      from: 'Reparo Tu Fuga <contacto@reparotufuga.cl>',
      to,
      subject,
      html,
    })

    return NextResponse.json({
      success: true,
      provider: "resend",
      data
    })

  } catch (error) {
    console.error("Error in send-alert:", error)

    return NextResponse.json(
      { error: "Error interno al enviar alerta" },
      { status: 500 }
    )
  }
}
