"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Award, Calendar, Heart } from "lucide-react"

const stats = [
  { icon: Calendar, value: "10+", label: "Años de Experiencia" },
  { icon: Users, value: "500+", label: "Clientes Satisfechos" },
  { icon: Award, value: "99%", label: "Tasa de Éxito" },
  { icon: Heart, value: "100%", label: "Compromiso Familiar" },
]

export function About() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="nosotros" ref={sectionRef} className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className={isVisible ? "animate-slide-up opacity-0" : "opacity-0"}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Sobre Nosotros
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              Una tradición familiar de excelencia
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p className="text-pretty">
                Somos la familia Benitez, y desde 2016 nos hemos dedicado a resolver
                los problemas de fugas de agua de cientos de hogares y empresas en Chile.
              </p>
              <p className="text-pretty">
                Lo que comenzó como un pequeño emprendimiento de mi padre, hoy es una
                empresa consolidada que combina la confianza del trato familiar con
                la tecnología más avanzada del mercado.
              </p>
              <p className="text-pretty">
                Cada cliente es tratado como parte de nuestra familia. Sabemos lo
                estresante que puede ser una fuga de agua, por eso trabajamos con
                rapidez, transparencia y siempre buscando la solución más efectiva
                para tu presupuesto.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300 ${isVisible ? "animate-slide-up opacity-0" : "opacity-0"
                  }`}
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
