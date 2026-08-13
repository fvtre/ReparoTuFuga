import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(
  process.env.RESEND_API_KEY,
)

export async function POST(
  request: NextRequest,
) {
  try {
    const webhookSecret =
      process.env.RESEND_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error(
        '[INBOUND] Falta RESEND_WEBHOOK_SECRET',
      )

      return NextResponse.json(
        { error: 'Webhook no configurado' },
        { status: 500 },
      )
    }

    // IMPORTANTE:
    // Resend necesita el body CRUDO
    // para validar la firma.
    const payload = await request.text()

    const headers = {
      id:
        request.headers.get('svix-id') ??
        '',
      timestamp:
        request.headers.get(
          'svix-timestamp',
        ) ?? '',
      signature:
        request.headers.get(
          'svix-signature',
        ) ?? '',
    }

    let event

    try {
      event = resend.webhooks.verify({
        payload,
        headers,
        webhookSecret,
      })
    } catch (error) {
      console.error(
        '[INBOUND] Firma inválida:',
        error,
      )

      return NextResponse.json(
        { error: 'Firma inválida' },
        { status: 401 },
      )
    }

    if (
      event.type !== 'email.received'
    ) {
      return NextResponse.json({
        received: true,
      })
    }

    const emailId = event.data.email_id

    if (!emailId) {
      return NextResponse.json(
        { error: 'Email ID no recibido' },
        { status: 400 },
      )
    }

    // Obtener contenido real del email.
    const {
      data: receivedEmail,
      error: emailError,
    } =
      await resend.emails.receiving.get(
        emailId,
      )

    if (
      emailError ||
      !receivedEmail
    ) {
      console.error(
        '[INBOUND] Error obteniendo email:',
        emailError,
      )

      return NextResponse.json(
        {
          error:
            'No fue posible obtener el correo',
        },
        { status: 500 },
      )
    }

    const originalFrom =
      receivedEmail.from || 'Desconocido'

    const originalSubject =
      receivedEmail.subject ||
      'Sin asunto'

    const originalText =
      receivedEmail.text ||
      'El correo recibido no contiene versión de texto.'

    // Reenviar al Gmail del dueño
    const {
      error: forwardError,
    } = await resend.emails.send({
      from:
        'Reparo Tu Fuga <contacto@reparotufuga.cl>',

      to: [
        'reparotufuga@gmail.com',
      ],

      replyTo:
        originalFrom,

      subject:
        `📩 ${originalSubject}`,

      html: `
        <div
          style="
            font-family:Arial,Helvetica,sans-serif;
            max-width:650px;
            margin:0 auto;
            color:#1f2937;
          "
        >
          <div
            style="
              background:#103650;
              color:#ffffff;
              padding:20px 24px;
              border-radius:12px 12px 0 0;
            "
          >
            <h2
              style="
                margin:0;
                font-size:20px;
              "
            >
              Nuevo correo recibido
            </h2>

            <p
              style="
                margin:6px 0 0;
                font-size:13px;
                color:#7dd3fc;
              "
            >
              contacto@reparotufuga.cl
            </p>
          </div>

          <div
            style="
              border:1px solid #dbe5ec;
              border-top:0;
              padding:24px;
              border-radius:0 0 12px 12px;
              background:#ffffff;
            "
          >
            <p>
              <strong>De:</strong>
              ${escapeHtml(originalFrom)}
            </p>

            <p>
              <strong>Asunto:</strong>
              ${escapeHtml(originalSubject)}
            </p>

            <hr
              style="
                border:0;
                border-top:1px solid #e5e7eb;
                margin:20px 0;
              "
            />

            <div
              style="
                white-space:pre-wrap;
                line-height:1.6;
                color:#374151;
              "
            >${escapeHtml(originalText)}</div>

            <p
              style="
                margin-top:24px;
                font-size:12px;
                color:#6b7280;
              "
            >
              Puedes responder directamente a este correo.
              La respuesta irá al remitente original.
            </p>
          </div>
        </div>
      `,
    })

    if (forwardError) {
      console.error(
        '[INBOUND] Error reenviando:',
        forwardError,
      )

      return NextResponse.json(
        {
          error:
            'No fue posible reenviar el correo',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      received: true,
      forwarded: true,
    })
  } catch (error) {
    console.error(
      '[INBOUND] Error general:',
      error,
    )

    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 },
    )
  }
}

function escapeHtml(
  value: string,
) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}