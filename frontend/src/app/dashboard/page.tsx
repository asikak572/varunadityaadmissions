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

  return (
    <>
      <div className="bg-navy text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Welcome, {user?.full_name || user?.email}</h1>
          <p className="text-gray-300 text-sm mt-1">Track your applications and activity</p>
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
