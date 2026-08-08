"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Número de WhatsApp (cambiar por el número real del negocio)
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56964767873"
  const message = encodeURIComponent("Hola, me gustaría solicitar información sobre sus servicios de detección de fugas de agua.")

  useEffect(() => {
    // Mostrar el botón después de un pequeño delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    // Mostrar tooltip después de 3 segundos
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearTimeout(tooltipTimer)
    }
  }, [])

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
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
          <p className="text-sm">Escríbenos por WhatsApp para atención inmediata</p>
          <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-foreground" />
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BD5A] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce-slow"
        aria-label="Contactar por WhatsApp"
      >
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

        {/* Icon */}
        <FaWhatsapp className="h-8 w-8 text-white" />
      </button>
    </div>
  )
}
