import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'typesense',
  description: 'typesense',
  generator: 'typesense',
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
