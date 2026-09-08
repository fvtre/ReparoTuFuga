import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Términos y Condiciones | ReparoTuFuga",
  description: "Términos y condiciones de uso del sitio y los servicios de ReparoTuFuga.",
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Términos y Condiciones"
      updatedAt="8 de septiembre de 2026"
      intro="Estos términos regulan el uso del sitio web de ReparoTuFuga y las solicitudes de información o cotización realizadas a través de él. Al utilizar el sitio, aceptas estas condiciones."
      sections={[
        {
          title: "1. Uso del sitio",
          paragraphs: ["Debes proporcionar información verdadera y utilizar el sitio únicamente con fines lícitos. No puedes intentar alterar, interrumpir o acceder sin autorización a nuestros sistemas o al panel administrativo."],
        },
        {
          title: "2. Cotizaciones y contratación",
          paragraphs: ["Las solicitudes enviadas mediante el sitio no constituyen por sí solas un contrato ni garantizan disponibilidad. Los precios, alcance, materiales, plazos y condiciones definitivas serán informados y aceptados antes de ejecutar el servicio. Una cotización puede cambiar si la inspección revela condiciones distintas de las descritas inicialmente."],
        },
        {
          title: "3. Servicios y acceso al inmueble",
          paragraphs: ["El cliente debe facilitar acceso seguro y oportuno al lugar del servicio e informar riesgos o condiciones relevantes. Las técnicas de detección reducen intervenciones innecesarias, pero sus resultados dependen de las condiciones de la instalación y del inmueble."],
        },
        {
          title: "4. Propiedad intelectual",
          paragraphs: ["El contenido, diseño, marca y materiales del sitio pertenecen a ReparoTuFuga o se utilizan con autorización. No se permite su reproducción o explotación comercial sin autorización previa."],
        },
        {
          title: "5. Servicios de terceros",
          paragraphs: ["El sitio puede utilizar o enlazar servicios de terceros. ReparoTuFuga no controla la disponibilidad ni las condiciones de plataformas externas, que se rigen por sus propios términos y políticas."],
        },
        {
          title: "6. Responsabilidad",
          paragraphs: ["Procuramos mantener información correcta y el sitio disponible, pero no garantizamos un funcionamiento ininterrumpido. Nada en estos términos limita responsabilidades que no puedan excluirse conforme a la legislación chilena aplicable."],
        },
        {
          title: "7. Legislación aplicable y contacto",
          paragraphs: ["Estos términos se interpretan conforme a las leyes de la República de Chile. Para consultas relacionadas con ellos, puedes escribir a reparotufuga@gmail.com."],
        },
      ]}
    />
  )
}
