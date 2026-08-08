"use client"

import { useEffect, useRef, useState } from "react"
import { Phone, Search, FileText, CheckCircle2 } from "lucide-react"

const steps = [
  {
    icon: Phone,
    step: "01",
    title: "Contáctanos",
    description: "Llámanos o envía una cotización. Respondemos en menos de 1 hora.",
  },
  {
    icon: Search,
    step: "02",
    title: "Inspección",
    description: "Nuestro equipo llega a tu ubicación con tecnología de detección avanzada.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Diagnóstico",
    description: "Te entregamos un informe detallado con la ubicación exacta de la fuga.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Solución",
    description: "Reparamos la fuga con el mínimo impacto y garantía de satisfacción.",
  },
]

export function Process() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="proceso" ref={sectionRef} className="py-20 md:py-28 bg-foreground text-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Nuestro Proceso
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 text-balance">
            Simple, rápido y efectivo
          </h2>
          <p className="text-lg opacity-70 text-pretty">
            En solo 4 pasos solucionamos tu problema de fugas de agua.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className={`relative ${isVisible ? "animate-slide-up opacity-0" : "opacity-0"
                }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-primary/30" />
              )}

              <div className="relative z-10 text-center">
                {/* Step Number */}
                <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>

                {/* Icon */}
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30">
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="opacity-70 text-pretty">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
