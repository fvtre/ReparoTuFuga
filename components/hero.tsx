"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, Shield, Clock, ArrowRight } from "lucide-react"

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const drops: { x: number; y: number; radius: number; speed: number; opacity: number }[] = []

    for (let i = 0; i < 50; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drops.forEach((drop) => {
        ctx.beginPath()
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(59, 130, 246, ${drop.opacity})`
        ctx.fill()

        drop.y += drop.speed
        if (drop.y > canvas.height) {
          drop.y = -10
          drop.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge de Emergencia - Llamativo */}
          <div className="animate-fade-in opacity-0 mb-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg shadow-red-500/30 animate-pulse">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <Clock className="h-5 w-5" />
              <span className="text-base md:text-lg font-bold tracking-wide">EMERGENCIAS 24/7</span>
              <a
                href="tel:+56964767873"
                className="bg-white text-red-500 px-3 py-1 rounded-full text-sm font-bold hover:bg-red-50 transition-colors"
              >
                LLAMAR AHORA
              </a>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-slide-up opacity-0 text-balance">
            detectamos y reparamos fugas de agua
            <span className="text-primary block mt-2"> sin romper tus paredes</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up opacity-0 delay-200 text-pretty">
            Somos una empresa familiar con más de 10 años de experiencia.
            Usamos tecnología avanzada de gas trazador, termografía y ultrasonido para
            localizar fugas con precisión milimétrica.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up opacity-0 delay-300">
            <Button size="lg" asChild className="min-h-[52px] text-lg px-8 group">
              <Link href="#cotizar">
                Solicitar Cotización Gratis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-h-[52px] text-lg px-8">
              <Link href="#servicios">Ver Servicios</Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-12 animate-fade-in opacity-0 delay-400">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Droplets className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">+500 Fugas Detectadas</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Garantía de Satisfacción</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Respuesta en minutos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
