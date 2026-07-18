import { Inter, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const lora = Lora({ subsets: ['latin'], variable: '--font-heading' })

export const metadata = {
  title: 'RealDoor: Application-Readiness Copilot for Renters',
  description: 'RealDoor reads your documents, explains affordable housing rules, and helps you prepare your application packet. We do not decide your eligibility.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="bg-bg-primary text-text-body font-body antialiased">
        {children}
      </body>
    </html>
  )
}
