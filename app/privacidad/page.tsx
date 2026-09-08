import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Política de Privacidad | ReparoTuFuga",
  description: "Política de privacidad y tratamiento de datos personales de ReparoTuFuga.",
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidad"
      updatedAt="8 de septiembre de 2026"
      intro="En ReparoTuFuga respetamos tu privacidad. Esta política explica qué información recopilamos, para qué la utilizamos y las opciones que tienes respecto de tus datos personales."
      sections={[
        {
          title: "1. Información que recopilamos",
          paragraphs: ["Podemos recopilar información que nos entregas al solicitar una cotización o comunicarte con nosotros, incluyendo nombre, correo electrónico, teléfono, dirección del servicio y descripción del problema."],
          items: [
            "Datos técnicos y de navegación, como página visitada, fecha, dispositivo y sitio de referencia.",
            "Datos de atribución publicitaria, como campaña, medio, términos UTM y GCLID.",
            "Información de Google Ads autorizada por el propietario de la cuenta, usada exclusivamente en el panel administrativo interno.",
          ],
        },
        {
          title: "2. Cómo utilizamos la información",
          items: [
            "Responder solicitudes, preparar cotizaciones y coordinar servicios.",
            "Administrar clientes potenciales y mantener un historial de atención.",
            "Medir el funcionamiento del sitio y el rendimiento de nuestras campañas.",
            "Prevenir abusos, proteger el servicio y cumplir obligaciones legales.",
          ],
        },
        {
          title: "3. Servicios de terceros",
          paragraphs: ["Utilizamos proveedores tecnológicos necesarios para operar el sitio y el panel administrativo, incluidos servicios de alojamiento y analítica, base de datos y autenticación, correo transaccional y Google Ads. Estos proveedores procesan información conforme a sus propias políticas y a nuestras instrucciones."],
        },
        {
          title: "4. Uso de datos de Google",
          paragraphs: ["El acceso a Google Ads se utiliza para consultar métricas, campañas y términos de búsqueda de cuentas expresamente autorizadas. No vendemos datos obtenidos mediante las APIs de Google ni los usamos para publicidad personalizada ajena a la cuenta autorizada. El uso y la transferencia de información recibida desde las APIs de Google cumplen la Política de Datos de Usuario de los Servicios de API de Google, incluidos sus requisitos de uso limitado."],
        },
        {
          title: "5. Conservación y seguridad",
          paragraphs: ["Conservamos la información durante el tiempo necesario para atender solicitudes, gestionar la relación comercial, analizar resultados y cumplir obligaciones aplicables. Aplicamos controles razonables de acceso y seguridad, aunque ningún sistema es completamente infalible."],
        },
        {
          title: "6. Tus derechos",
          paragraphs: ["Puedes solicitar acceso, rectificación, actualización o eliminación de tus datos, o retirar una autorización cuando corresponda, escribiendo a reparotufuga@gmail.com. También puedes revocar el acceso de la aplicación desde la configuración de seguridad de tu cuenta de Google."],
        },
        {
          title: "7. Cambios a esta política",
          paragraphs: ["Podemos actualizar esta política para reflejar cambios legales o del servicio. La versión vigente y su fecha de actualización estarán siempre disponibles en esta página."],
        },
      ]}
    />
  )
}
