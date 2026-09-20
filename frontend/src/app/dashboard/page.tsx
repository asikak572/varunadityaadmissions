'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { applicationApi } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
import { formatDate, getStatusColor } from '@/lib/utils'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import type { Application } from '@/types'

function DashboardContent() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery<{ results: Application[] }>({
    queryKey: ['my-applications'],
    queryFn: () => applicationApi.list().then((r) => r.data),
  })

  const applications: Application[] = data?.results ?? (data as unknown as Application[]) ?? []

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending' || a.status === 'under_review').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    admitted: applications.filter((a) => a.status === 'admitted').length,
  }

  const initial = user?.full_name?.trim()?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <>
      {/* Header */}
      <div className="bg-navy text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold opacity-10" />
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dash-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dash-grid)" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10 relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center text-gold text-xl font-bold flex-shrink-0">
              {initial}
            </div>
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-wide mb-0.5">{greeting}</p>
              <h1 className="text-2xl font-bold">{user?.full_name || user?.email}</h1>
              <p className="text-white/50 text-sm mt-0.5">Track your applications and activity</p>
            </div>
          </div>

          {!isLoading && applications.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-8">
              {[
                { label: 'Total', value: stats.total },
                { label: 'In Review', value: stats.pending },
                { label: 'Shortlisted', value: stats.shortlisted },
                { label: 'Admitted', value: stats.admitted },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 rounded-xl px-3 py-3 text-center backdrop-blur-sm">
                  <p className="text-xl font-bold text-gold">{s.value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-navy">My Applications</h2>
          <Link
            href="/apply"
            className="bg-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors"
          >
            + New Application
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gold border-t-transparent" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-medium">No applications yet</p>
            <Link href="/apply" className="text-gold text-sm mt-2 inline-block hover:underline">
              Submit your first application →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white border rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-navy">{app.college_name}</h3>
                    <p className="text-gray-500 text-sm">{app.course_name}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>
                    {app.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-3">Applied: {formatDate(app.created_at)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer / support strip */}
        <div className="mt-12 bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-navy">Need help with your application?</p>
              <p className="text-xs text-gray-500 mt-0.5">Our counsellors are here to guide you at every step.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/contact"
              className="text-sm font-semibold text-navy border border-gray-200 hover:bg-white px-4 py-2 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/91XXXXXXXXXX?text=Hi, I need help with admissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
