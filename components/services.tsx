"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, Thermometer, Waves, Home, Building2, Factory } from "lucide-react"

const services = [
  {
    icon: Droplets,
    title: "Detección de Gas Trazador",
    description: "Inyectamos gas inofensivo en las tuberías para localizar fugas con exactitud milimétrica.",
    features: ["Precisión extrema", "Ideal para fugas difíciles", "100% seguro"],
  },
  {
    icon: Thermometer,
    title: "Termografía Infrarroja",
    description: "Cámaras térmicas que detectan cambios de temperatura causados por humedad oculta en paredes y pisos.",
    features: ["No invasivo", "Visualización clara", "Documentación fotográfica"],
  },
  {
    icon: Waves,
    title: "Detección por Ultrasonido",
    description: "Tecnología de última generación que detecta el sonido del agua escapando, incluso a través de concreto y metal.",
    features: ["Sin demolición", "Alta precisión", "Resultados inmediatos"],
  },
  {
    icon: Home,
    title: "Servicio Residencial",
    description: "Atendemos hogares y departamentos con el mayor cuidado y profesionalismo que tu familia merece.",
    features: ["Precios accesibles", "Horarios flexibles", "Garantía incluida"],
  },
  {
    icon: Building2,
    title: "Servicio Comercial",
    description: "Soluciones para oficinas, locales comerciales y edificios que minimizan la interrupción de tu negocio.",
    features: ["Mínima interrupción", "Informes detallados", "Planes preventivos"],
  },
  {
    icon: Factory,
    title: "Servicio Industrial",
    description: "Detección especializada para plantas industriales, fábricas y grandes instalaciones.",
    features: ["Equipos certificados", "Normativas vigentes", "Soporte 24/7"],
  },
]

export function Services() {
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
    <section id="servicios" ref={sectionRef} className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Tecnología avanzada para detectar cualquier fuga
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Combinamos experiencia familiar con equipos de última generación para
            ofrecerte el mejor servicio de detección de fugas en Chile.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className={`group bg-card hover:shadow-xl transition-all duration-500 border-border hover:border-primary/30 ${isVisible ? "animate-slide-up opacity-0" : "opacity-0"
                }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl text-card-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
