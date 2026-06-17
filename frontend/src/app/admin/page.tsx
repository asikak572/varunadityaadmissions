'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { formatDate, getStatusColor } from '@/lib/utils'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import type { Application } from '@/types'

const STATUS_OPTIONS = ['pending', 'under_review', 'shortlisted', 'rejected', 'admitted']

function AdminContent() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery<{ results: Application[] }>({
    queryKey: ['admin-applications'],
    queryFn: () => api.get('/applications/').then((r) => r.data),
  })

  const applications: Application[] = data?.results ?? (data as unknown as Application[]) ?? []

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/applications/${id}/update_status/`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-applications'] }),
  })

  return (
    <>
      <div className="bg-navy text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-300 text-sm mt-1">Manage applications and inquiries</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-navy mb-6">
          All Applications ({applications.length})
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gold border-t-transparent" />
          </div>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No applications found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl border overflow-hidden">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  {['Applicant', 'Email', 'College', 'Course', 'Date', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-navy">{app.applicant_name}</td>
                    <td className="px-4 py-3 text-gray-500">{app.email}</td>
                    <td className="px-4 py-3">{app.college_name}</td>
                    <td className="px-4 py-3">{app.course_name}</td>
                    <td className="px-4 py-3 text-gray-400">{formatDate(app.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        defaultValue={app.status}
                        onChange={(e) => updateStatus.mutate({ id: app.id, status: e.target.value })}
                        className="border rounded px-2 py-1 text-xs focus:outline-none focus:border-gold"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  )
}
