import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, email, phone, address, serviceType, urgency, description } = body

    // Validar campos
    if (!name || !email || !phone || !address || !serviceType || !urgency || !description) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Generar número de orden
    const orderNumber = `AQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    // Inicializar Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Enviar correo
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "reparotufuga@gmail.com",
      subject: `Nueva Cotización - ${orderNumber}`,
      html: `
        <h1>Nueva Solicitud de Cotización</h1>
        <p><strong>Número de Orden:</strong> ${orderNumber}</p>
        <hr />
        <h2>Datos del Cliente</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Dirección:</strong> ${address}</p>
        <hr />
        <h2>Detalles del Servicio</h2>
        <p><strong>Tipo de Servicio:</strong> ${serviceType}</p>
        <p><strong>Urgencia:</strong> ${urgency}</p>
        <p><strong>Descripción:</strong> ${description}</p>
      `,
    })

    try {
      await resend.emails.send({
        from: "reparotufuga@gmail.com",
        to: email,
        subject: "Hemos recibido tu solicitud",
        html: `<p>Hola ${name}, recibimos tu solicitud. Número: ${orderNumber}</p>`
      })
    } catch (err) {
      console.error("Error enviando correo al cliente:", err)
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      data,
      message: "Cotización enviada correctamente",
    })

  } catch (error) {
    console.error("Error enviando cotización:", error)

    return NextResponse.json(
      { error: "Error al enviar la cotización" },
      { status: 500 }
    )
  }
}