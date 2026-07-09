// fonts.ts · La voz de Nexo Propiedades.
// Fraunces (serif editorial, casi notarial) = precios y titulos, voz de tasacion con criterio.
// Inter = la data densa de tablas y tickets, legible en compact.
// El PRECIO usa Fraunces (--font-number apunta a la fuente de heading): es el protagonista.
import { Fraunces, Inter } from "next/font/google"

export const headingFont = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-heading-src" })
export const bodyFont = Inter({ subsets: ["latin"], display: "swap", variable: "--font-body-src" })

export const fontClass = `${headingFont.variable} ${bodyFont.variable}`
