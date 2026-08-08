import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    //  Resend
    const resend = new Resend('_dpxq2Tg6_6kjL8tZCX3RmUTDNnu3HVqvL')

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'reparotufuga@gmail.com',
      subject: 'test',
      html: '<h1>Hola mundo</h1>'
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

