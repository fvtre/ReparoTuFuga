import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      name,
      email,
      phone,
      address,
      serviceType,
      urgency,
      description,
    } = body

    // Validar campos
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !serviceType ||
      !urgency ||
      !description
    ) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 },
      )
    }

    // Número de solicitud
    const orderNumber =
      `AQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    const resend = new Resend(
      process.env.RESEND_API_KEY,
    )

    // Traducir valores internos a textos legibles
    const serviceLabels: Record<string, string> = {
      residential: 'Detección de fuga residencial',
      commercial: 'Detección de fuga comercial',
      emergency: 'Emergencia por fuga',
      inspection: 'Inspección y diagnóstico',
    }

    const urgencyLabels: Record<string, string> = {
      low: 'Baja',
      normal: 'Normal',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente',
    }

    const serviceName =
      serviceLabels[serviceType] ?? serviceType

    const urgencyName =
      urgencyLabels[urgency] ?? urgency

    // =====================================
    // 1. CORREO INTERNO AL DUEÑO
    // =====================================

    const ownerEmail =
      await resend.emails.send({
        from: 'Reparo Tu Fuga <contacto@reparotufuga.cl>',
        to: ['reparotufuga@gmail.com'],
        replyTo: email,
        subject: `Nueva cotización ${orderNumber} - ${name}`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;">
            <h1 style="color:#103650;">
              Nueva solicitud de cotización
            </h1>

            <p>
              <strong>Número:</strong>
              ${orderNumber}
            </p>

            <hr>

            <h2 style="color:#103650;">
              Datos del cliente
            </h2>

            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone}</p>
            <p><strong>Dirección:</strong> ${address}</p>

            <hr>

            <h2 style="color:#103650;">
              Detalles del servicio
            </h2>

            <p>
              <strong>Servicio:</strong>
              ${serviceName}
            </p>

            <p>
              <strong>Urgencia:</strong>
              ${urgencyName}
            </p>

            <p>
              <strong>Descripción:</strong>
              ${description}
            </p>
          </div>
        `,
      })

    if (ownerEmail.error) {
      console.error(
        'Error enviando correo al dueño:',
        ownerEmail.error,
      )

      throw new Error(
        'No fue posible enviar la cotización.',
      )
    }

    // =====================================
    // 2. CONFIRMACIÓN AL CLIENTE
    // =====================================

    const clientEmail =
      await resend.emails.send({
        from: 'Reparo Tu Fuga <contacto@reparotufuga.cl>',
        to: [email],
        replyTo: 'contacto@reparotufuga.cl',

        template: {
          id: 'service-request',

          variables: {
            nombre: name,
            servicio: serviceName,
            direccion: address,
            urgencia: urgencyName,
            telefono: phone,
            mensaje: description,
          },
        },
      })

    if (clientEmail.error) {
      // La solicitud ya llegó al dueño.
      // No hacemos fallar todo el formulario
      // solo porque falle la confirmación al cliente.
      console.error(
        'Error enviando confirmación al cliente:',
        clientEmail.error,
      )
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      message:
        'Cotización enviada correctamente',
    })
  } catch (error) {
    console.error(
      'Error enviando cotización:',
      error,
    )

    return NextResponse.json(
      {
        error:
          'Error al enviar la cotización',
      },
      { status: 500 },
    )
  }
}