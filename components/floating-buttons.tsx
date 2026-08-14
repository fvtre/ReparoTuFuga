"use client"

import { useState, useEffect } from "react"
import { Phone, X } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export function FloatingButtons() {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Números de contacto
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "56974048721"
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56974048721"
  const message = encodeURIComponent("Hola, me gustaría solicitar información sobre sus servicios de detección de fugas de agua.")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(tooltipTimer)
    }
  }, [])

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  const handleCall = () => {
    window.location.href = `tel:+${phoneNumber}`
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="animate-fade-in relative bg-foreground text-background px-4 py-2 rounded-lg shadow-lg max-w-[200px]">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 bg-foreground text-background rounded-full p-1 hover:bg-foreground/80 transition-colors"
            aria-label="Cerrar mensaje"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="text-sm font-medium">Contáctanos ahora para atención inmediata</p>
          <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-foreground" />
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col gap-3">
        {/* Botón de Llamada */}
        <button
          onClick={handleCall}
          className="group relative flex items-center justify-center w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce-slow"
          aria-label="Llamar ahora"
        >
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />

          {/* Icono */}
          <Phone className="h-6 w-6 text-white" />

          {/* Label en hover */}
          <span className="absolute right-full mr-3 bg-foreground text-background text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Llamar ahora
          </span>
        </button>

        {/* Botón de WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce-slow"
          aria-label="Contactar por WhatsApp"
        >
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

          {/* Icono */}
          <FaWhatsapp className="h-7 w-7 text-white" />

          {/* Label en hover */}
          <span className="absolute right-full mr-3 bg-foreground text-background text-sm font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            WhatsApp
          </span>
        </button>
      </div>
    </div>
  )
}
