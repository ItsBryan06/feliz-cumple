import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Feliz cumpleaños reina',
  description: 'Para mi querida esposa <3',
  generator: 'HollowRaven',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
