import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const quoteSchema = z.object({
  name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(254),
  phone: z.string().trim().min(8).max(30), address: z.string().trim().min(5).max(300),
  serviceType: z.string().trim().min(1).max(80), urgency: z.string().trim().min(1).max(30),
  description: z.string().trim().min(5).max(3000),
  attribution: z.object({
    source: z.string().max(200).optional(), medium: z.string().max(200).optional(), campaign: z.string().max(300).optional(),
    term: z.string().max(300).optional(), content: z.string().max(300).optional(), gclid: z.string().max(300).optional(),
    landingPage: z.string().max(1000).optional(), referrer: z.string().max(1000).optional(),
  }).optional(),
})

export async function POST(request: Request) {
  try {
    const parsed = quoteSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Revisa los datos ingresados' }, { status: 400 })
    const {
      name,
      email,
      phone,
      address,
      serviceType,
      urgency,
      description, attribution,
    } = parsed.data

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

    // Intentar guardar primero. Si Supabase está temporalmente pausado,
    // el correo al dueño sigue funcionando como respaldo para no perder clientes.
    const database = createAdminClient()
    let leadStored = false
    if (database) {
      try {
        const { error: databaseError } = await database.from('leads').insert({
          order_number: orderNumber, name, email, phone, address, service_type: serviceType, urgency, description,
          source: attribution?.source || null, medium: attribution?.medium || null, campaign: attribution?.campaign || null,
          term: attribution?.term || null, content: attribution?.content || null, gclid: attribution?.gclid || null,
          landing_page: attribution?.landingPage || null, referrer: attribution?.referrer || null,
        }).abortSignal(AbortSignal.timeout(4000))
        if (databaseError) console.error('[Quote] Respaldo por correo; Supabase falló:', databaseError.code)
        leadStored = !databaseError
      } catch {
        console.error('[Quote] Respaldo por correo; Supabase no respondió')
      }
    } else {
      console.error('[Quote] Respaldo por correo; Supabase no está configurado')
    }

      
    // =====================================
    // 1. CORREO INTERNO AL DUEÑO
    // =====================================

    // Limpiar teléfono para enlace de WhatsApp.
    // Ej: +56 9 1234 5678 → 56912345678
    let whatsappPhone = String(phone)
      .replace(/\D/g, '')

    if (
      whatsappPhone.length === 9 &&
      whatsappPhone.startsWith('9')
    ) {
      whatsappPhone = `56${whatsappPhone}`
    }

    const whatsappUrl =
      `https://wa.me/${whatsappPhone}`

    const mailtoUrl =
      `mailto:${email}`

    // Fecha legible en Chile
    const receivedAt =
      new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'America/Santiago',
      }).format(new Date())

    const ownerEmail =
      await resend.emails.send({
        from:
          'Reparo Tu Fuga <contacto@reparotufuga.cl>',

        to: [
          'reparotufuga@gmail.com',
        ],

        // Si el dueño pulsa Responder en Gmail,
        // responderá directamente al cliente.
        replyTo: email,

        template: {
          id: 'owner-service-request',

          variables: {
            orden: orderNumber,
            nombre: name,
            email,
            telefono: phone,
            direccion: address,
            servicio: serviceName,
            urgencia: urgencyName,
            mensaje: description,
            fecha: receivedAt,
            whatsapp_url: whatsappUrl,
            mailto_url: mailtoUrl,
          },
        },
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
      stored: leadStored,
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
