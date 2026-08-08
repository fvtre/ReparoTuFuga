import Link from "next/link"
import { Droplets, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

const quickLinks = [
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#proceso", label: "Proceso" },
]

const services = [
  "Gas Trazador",
  "Termografía Infrarroja",
  "Detección por Ultrasonido",
  "Servicio Residencial",
  "Servicio Comercial",
  "Servicio Industrial",
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Droplets className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">
                Reparo<span className="text-primary">TuFuga</span>
              </span>
            </Link>
            <p className="opacity-70 mb-6 text-pretty">
              Empresa familiar especializada en detección de fugas de agua
              con tecnología avanzada desde 2016.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="opacity-70 hover:opacity-100 hover:text-primary transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Servicios</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="opacity-70">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+56964767873"
                  className="flex items-center gap-3 opacity-70 hover:opacity-100 hover:text-primary transition-all"
                >
                  <Phone className="h-5 w-5 shrink-0" />
                  <span>+56 9 6476 7873</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:reparotufuga@gmail.com"
                  className="flex items-center gap-3 opacity-70 hover:opacity-100 hover:text-primary transition-all"
                >
                  <Mail className="h-5 w-5 shrink-0" />
                  <span>reparotufuga@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 opacity-70">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>Santiago y Región Metropolitana, Chile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="opacity-50 text-sm text-center md:text-left">
            © {new Date().getFullYear()} ReparoTuFuga. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm opacity-50">
            <Link href="#" className="hover:opacity-100 transition-opacity">
              Términos de Servicio
            </Link>
            <Link href="#" className="hover:opacity-100 transition-opacity">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
