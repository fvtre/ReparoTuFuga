import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { Process } from "@/components/process"
import { QuoteForm } from "@/components/quote-form"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Footer } from "@/components/footer"
import { FloatingButtons } from "@/components/floating-buttons"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <About />
      <Process />
      <QuoteForm />
      <Footer />
      <FloatingButtons />
    </main>
  )
}
