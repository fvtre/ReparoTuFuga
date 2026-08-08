"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Send, CheckCircle2, Phone, Mail, MapPin } from "lucide-react"
import { toast } from "sonner"

const serviceTypes = [
  { value: "residential", label: "Servicio Residencial" },
  { value: "commercial", label: "Servicio Comercial" },
  { value: "industrial", label: "Servicio Industrial" },
  { value: "emergency", label: "Emergencia 24/7" },
]

const urgencyLevels = [
  { value: "low", label: "Baja - Puedo esperar algunos días" },
  { value: "medium", label: "Media - Necesito atención esta semana" },
  { value: "high", label: "Alta - Necesito atención hoy" },
  { value: "urgent", label: "Urgente - Es una emergencia" },
]

export function QuoteForm() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    urgency: "",
    description: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("📩 RESPONSE:", data)

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar")
      }

      // ✅ éxito
      setSuccess(true)
      setIsSubmitted(true)

      // limpiar form
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        serviceType: "",
        urgency: "",
        description: "",
      })

    } catch (err: any) {
      console.error("❌ ERROR:", err)
      setError(err.message || "Error al enviar la cotización")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="cotizar" ref={sectionRef} className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center bg-card">
            <CardContent className="pt-12 pb-12">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                ¡Cotización Enviada!
              </h3>
              <p className="text-muted-foreground mb-6">
                Hemos recibido tu solicitud. Nuestro equipo te contactará en menos de 1 hora
                para coordinar la inspección.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Enviar Otra Cotización
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section id="cotizar" ref={sectionRef} className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <div className={isVisible ? "animate-slide-up opacity-0" : "opacity-0"}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Cotización Gratuita
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              Solicita tu cotización sin compromiso
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Completa el formulario y te enviaremos una cotización detallada
              a tu correo electrónico en menos de 1 hora.
            </p>

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="name">Nombre Completo</FieldLabel>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      className="min-h-[52px]"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@ejemplo.cl"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="min-h-[52px]"
                    />
                  </Field>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      className="min-h-[52px]"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="serviceType">Tipo de Servicio</FieldLabel>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => handleChange("serviceType", value)}
                      required
                    >
                      <SelectTrigger className="min-h-[52px]">
                        <SelectValue placeholder="Selecciona un servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="address">Dirección</FieldLabel>
                  <Input
                    id="address"
                    placeholder="Av. Providencia 1234, Santiago"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    required
                    className="min-h-[52px]"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="urgency">Nivel de Urgencia</FieldLabel>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) => handleChange("urgency", value)}
                    required
                  >
                    <SelectTrigger className="min-h-[52px]">
                      <SelectValue placeholder="¿Qué tan urgente es?" />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Descripción del Problema</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Describe el problema que estás experimentando..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    required
                  />
                </Field>

                <Button type="submit" size="lg" className="w-full min-h-[52px]" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Cotización
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </div>

          {/* Contact Info */}
          <div
            className={`flex flex-col justify-center ${isVisible ? "animate-slide-up opacity-0 delay-200" : "opacity-0"
              }`}
          >
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground">Información de Contacto</CardTitle>
                <CardDescription>
                  También puedes contactarnos directamente por estos medios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <a
                  href="tel:+56982422038"
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Teléfono</h4>
                    <p className="text-muted-foreground">+56 9 8242 2038</p>
                    <p className="text-sm text-primary mt-1">Disponible 24/7</p>
                  </div>
                </a>

                <a
                  href="mailto:reparotufuga@gmail.com"
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Correo Electrónico</h4>
                    <p className="text-muted-foreground">reparotufuga@gmail.com</p>
                    <p className="text-sm text-primary mt-1">Respuesta en 1 hora</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">Cobertura</h4>
                    <p className="text-muted-foreground">Santiago y Región Metropolitana</p>
                    <p className="text-sm text-primary mt-1">Otras regiones consultar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
