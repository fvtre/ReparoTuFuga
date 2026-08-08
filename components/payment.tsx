"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { CreditCard, Shield, Lock, CheckCircle2, User, MapPin, Phone, Mail } from "lucide-react"
import { toast } from "sonner"

interface CustomerData {
  name: string
  phone: string
  email: string
  address: string
}

export function Payment() {
  const [amount, setAmount] = useState("")
  const [orderNumber, setOrderNumber] = useState("")
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phone: "",
    email: "",
    address: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
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

  const handleCustomerChange = (field: keyof CustomerData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCustomerData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar todos los campos
    if (!amount || !orderNumber) {
      toast.error("Por favor completa el número de orden y monto")
      return
    }

    if (!customerData.name || !customerData.phone || !customerData.email || !customerData.address) {
      toast.error("Por favor completa todos los datos del cliente")
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerData.email)) {
      toast.error("Por favor ingresa un correo electrónico válido")
      return
    }

    // Validar formato de teléfono chileno
    const phoneRegex = /^(\+?56)?[9][0-9]{8}$/
    const cleanPhone = customerData.phone.replace(/\s/g, "")
    if (!phoneRegex.test(cleanPhone)) {
      toast.error("Por favor ingresa un número de teléfono válido (ej: +56912345678)")
      return
    }

    setIsProcessing(true)

    try {
      // Crear transacción con WebPay incluyendo datos del cliente
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          amount,
          customer: customerData,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al procesar el pago")
      }

      toast.success("Redirigiendo a WebPay...")

      // Redirigir a WebPay con el token
      const form = document.createElement("form")
      form.method = "POST"
      form.action = data.url

      const tokenInput = document.createElement("input")
      tokenInput.type = "hidden"
      tokenInput.name = "token_ws"
      tokenInput.value = data.token

      form.appendChild(tokenInput)
      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      console.error("Error processing payment:", error)
      toast.error(error instanceof Error ? error.message : "Error al procesar el pago")
      setIsProcessing(false)
    }
  }

  const formatAmount = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const formatPhone = (value: string) => {
    // Permitir solo números y el símbolo +
    return value.replace(/[^\d+]/g, "")
  }

  return (
    <section id="pago" ref={sectionRef} className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Pago Seguro
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Paga tu servicio con WebPay
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Acepta tu cotización y paga de forma segura con tarjeta de crédito o débito
            a través de WebPay, la plataforma de pago más confiable de Chile.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start max-w-6xl mx-auto">
          {/* Payment Form */}
          <Card
            className={`bg-card ${isVisible ? "animate-slide-up opacity-0" : "opacity-0"}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-card-foreground">
                <CreditCard className="h-6 w-6 text-primary" />
                Realizar Pago
              </CardTitle>
              <CardDescription>
                Completa tus datos y el número de orden para procesar el pago.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment}>
                <FieldGroup>
                  {/* Datos del cliente */}
                  <div className="space-y-4 pb-4 border-b border-border">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Datos del Cliente
                    </h3>

                    <Field>
                      <FieldLabel htmlFor="customerName">Nombre Completo del Encargado</FieldLabel>
                      <Input
                        id="customerName"
                        placeholder="Ej: Juan Pérez González"
                        value={customerData.name}
                        onChange={handleCustomerChange("name")}
                        required
                        className="min-h-[52px]"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="customerPhone">Teléfono de Contacto</FieldLabel>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="customerPhone"
                          placeholder="+56912345678"
                          value={customerData.phone}
                          onChange={(e) => setCustomerData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                          required
                          className="min-h-[52px] pl-11"
                        />
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="customerEmail">Correo Electrónico</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="correo@ejemplo.cl"
                          value={customerData.email}
                          onChange={handleCustomerChange("email")}
                          required
                          className="min-h-[52px] pl-11"
                        />
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="customerAddress">Dirección de la Fuga</FieldLabel>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="customerAddress"
                          placeholder="Ej: Av. Principal 123, Depto 45, Santiago"
                          value={customerData.address}
                          onChange={handleCustomerChange("address")}
                          required
                          className="min-h-[80px] pl-11 resize-none"
                        />
                      </div>
                    </Field>
                  </div>

                  {/* Datos del pago */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Datos del Pago
                    </h3>

                    <Field>
                      <FieldLabel htmlFor="orderNumber">Número de Orden</FieldLabel>
                      <Input
                        id="orderNumber"
                        placeholder="Ej: AQ-2024-001234"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        required
                        className="min-h-[52px]"
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="amount">Monto a Pagar (CLP)</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                          $
                        </span>
                        <Input
                          id="amount"
                          placeholder="150.000"
                          value={amount}
                          onChange={(e) => setAmount(formatAmount(e.target.value))}
                          required
                          className="min-h-[52px] pl-8"
                        />
                      </div>
                    </Field>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full min-h-[52px] bg-[#00457c] hover:bg-[#003d6d] text-white mt-4"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner className="mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Pagar con WebPay
                      </>
                    )}
                  </Button>
                </FieldGroup>
              </form>

              {/* WebPay Logo */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-4">
                  <Image
                    src="/webpay-logo.svg"
                    alt="WebPay"
                    width={120}
                    height={40}
                    className="w-24 sm:w-28 md:w-32 h-auto opacity-70"
                  />
                  <div className="h-8 w-px bg-border" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Pago 100% Seguro
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <div
            className={`space-y-6 ${isVisible ? "animate-slide-up opacity-0 delay-200" : "opacity-0"
              }`}
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Transacciones Seguras
                </h3>
                <p className="text-muted-foreground text-pretty">
                  WebPay es la plataforma de pagos más utilizada en Chile,
                  respaldada por Transbank con los más altos estándares de seguridad.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Múltiples Formas de Pago
                </h3>
                <p className="text-muted-foreground text-pretty">
                  Acepta pagos con tarjetas de crédito, débito y prepago
                  de todos los bancos nacionales e internacionales.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Comprobante Inmediato
                </h3>
                <p className="text-muted-foreground text-pretty">
                  Recibe tu comprobante de pago inmediatamente por correo electrónico
                  y comienza a disfrutar de nuestros servicios.
                </p>
              </div>
            </div>

            {/* Accepted Cards */}
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">Tarjetas aceptadas:</p>
              <div className="flex flex-wrap gap-3">
                {["Visa", "Mastercard", "Amex", "Redcompra"].map((card) => (
                  <div
                    key={card}
                    className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
                  >
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
