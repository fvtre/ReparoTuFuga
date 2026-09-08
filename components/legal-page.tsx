import Link from "next/link"
import { Droplets } from "lucide-react"

type Section = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

export function LegalPage({
  title,
  updatedAt,
  intro,
  sections,
}: {
  title: string
  updatedAt: string
  intro: string
  sections: Section[]
}) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Droplets className="h-7 w-7 text-blue-600" />
            <span>Reparo<span className="text-blue-600">TuFuga</span></span>
          </Link>
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Información legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">Última actualización: {updatedAt}</p>
        <p className="mt-8 text-lg leading-8 text-slate-700">{intro}</p>

        <div className="mt-10 space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-7 text-slate-700">{paragraph}</p>
              ))}
              {section.items && (
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-700">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border bg-white p-6 text-sm text-slate-600">
          Consultas: <a className="font-medium text-blue-600 hover:underline" href="mailto:reparotufuga@gmail.com">reparotufuga@gmail.com</a>
          <span className="mx-2">·</span>
          Santiago, Región Metropolitana, Chile
        </div>
      </article>
    </main>
  )
}
