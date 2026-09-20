'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'

const WHATSAPP_URL = 'https://wa.me/91XXXXXXXXXX?text=Hi, I need help with admissions'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/colleges', label: 'Colleges' },
  { href: '/courses', label: 'Courses' },
  { href: '/scholarships', label: 'Scholarships' },
  { href: '/contact', label: 'Contact Us' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close the mobile nav automatically whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open, so the page behind it can't wobble/scroll.
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

  const initial = user?.full_name?.trim()?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'

  const AccountMenu = () => (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-navy text-white text-sm font-semibold flex items-center justify-center hover:bg-navy-light transition-colors flex-shrink-0"
        aria-label="Account menu"
      >
        {initial}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 overflow-hidden z-50">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-sm font-medium text-navy truncate">{user?.full_name || user?.email}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gold transition-colors"
            >
              Admin
            </Link>
          )}
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gold transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false)
              logout()
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )

  const WhatsAppButton = ({ full = false }: { full?: boolean }) => (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-2 text-sm font-semibold text-green-600 border border-green-500 hover:bg-green-50 px-4 py-2.5 rounded-lg transition-colors ${full ? 'w-full' : ''}`}
    >
      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      Chat on WhatsApp
    </a>
  )

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center flex-shrink-0 min-w-0">
          <img src="/logo.png" alt="Varun Aditya" className="h-9 sm:h-10 w-auto object-contain" />
        </Link>

        {/* Desktop nav links — hidden below md */}
        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={
                  isActive
                    ? 'text-gold border-b-2 border-gold px-3 py-5 transition-colors whitespace-nowrap'
                    : 'text-gray-600 hover:text-gold px-3 py-5 border-b-2 border-transparent transition-colors whitespace-nowrap'
                }
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Desktop right side — hidden below md */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {user ? <AccountMenu /> : <WhatsAppButton />}
        </div>

        {/* Mobile: account avatar (if logged in) + hamburger toggle */}
        <div className="flex items-center gap-2 md:hidden flex-shrink-0">
          {user && <AccountMenu />}
          <button
            onClick={() => setMobileNavOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-navy hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 bottom-0 bg-black/30 transition-opacity ${
          mobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileNavOpen(false)}
      >
        <div
          className={`bg-white w-full shadow-lg transform transition-transform duration-200 ${
            mobileNavOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 flex flex-col">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    isActive
                      ? 'text-gold font-semibold px-2 py-3 border-b border-gray-100 transition-colors'
                      : 'text-gray-700 px-2 py-3 border-b border-gray-100 transition-colors'
                  }
                >
                  {label}
                </Link>
              )
            })}
            <div className="pt-4">
              {!user && <WhatsAppButton full />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}