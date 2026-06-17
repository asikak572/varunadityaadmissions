import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import WhatsAppFAB from '@/components/common/WhatsAppFAB'

export const metadata: Metadata = {
  title: 'Varun Aditya Admissions & Career Guidance',
  description: 'Get admission in the best colleges across Tamil Nadu, Andhra Pradesh & Karnataka. Expert counselors, 200+ top colleges, end to end support.',
  icons: { icon: '/favicon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFAB />
        </Providers>
      </body>
    </html>
  )
}
