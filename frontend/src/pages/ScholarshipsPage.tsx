import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { scholarshipApi } from '../services/api'
import { formatDate } from '../lib/utils'
import type { Scholarship } from '../types'

const STREAMS = ['engineering', 'medical', 'management', 'commerce', 'arts', 'law']

export default function ScholarshipsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeStream = searchParams.get('stream') ?? ''

  const { data, isLoading } = useQuery<{ results: Scholarship[] }>({
    queryKey: ['scholarships', activeStream],
    queryFn: () =>
      scholarshipApi.list({ stream: activeStream || undefined }).then((r) => r.data),
  })

  const scholarships: Scholarship[] = data?.results ?? (data as unknown as Scholarship[]) ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="bg-navy text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Scholarships</h1>
          <p className="text-gray-300">Find funding opportunities for your education</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 flex-1">
        <aside className="w-full md:w-48 shrink-0">
          <h3 className="font-semibold text-gray-700 mb-3">Filter by Stream</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setSearchParams({})}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !activeStream ? 'bg-gold text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                All Streams
              </button>
            </li>
            {STREAMS.map((s) => (
              <li key={s}>
                <button
                  onClick={() => setSearchParams({ stream: s })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                    activeStream === s ? 'bg-gold text-white' : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gold border-t-transparent" />
            </div>
          ) : scholarships.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No scholarships found.</p>
          ) : (
            <div className="space-y-4">
              {scholarships.map((s) => (
                <div key={s.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-navy">{s.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">By {s.provider}</p>
                    </div>
                    {s.amount && (
                      <div className="text-right">
                        <div className="text-green-600 font-bold">₹{Number(s.amount).toLocaleString('en-IN')}</div>
                        <div className="text-gray-400 text-xs">per year</div>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-3">{s.description}</p>
                  <p className="text-gray-500 text-xs mt-2">Eligibility: {s.eligibility_criteria}</p>
                  <div className="flex items-center justify-between mt-4">
                    {s.last_date && (
                      <span className="text-red-500 text-xs font-medium">
                        Last Date: {formatDate(s.last_date)}
                      </span>
                    )}
                    {s.link_url && (
                      <a
                        href={s.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold text-sm font-semibold hover:underline"
                      >
                        Apply Now →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
