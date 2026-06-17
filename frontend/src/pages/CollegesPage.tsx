import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { collegeApi } from '../services/api'
import type { College } from '../types'

export default function CollegesPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery<{ results: College[] }>({
    queryKey: ['colleges', search],
    queryFn: () => collegeApi.list({ search: search || undefined }).then((r) => r.data),
  })

  const colleges: College[] = data?.results ?? (data as unknown as College[]) ?? []

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="bg-navy text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Top Colleges</h1>
          <p className="text-gray-300">Discover partner colleges across India</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, or state..."
            className="mt-4 w-full max-w-md px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
          />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 flex-1">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gold border-t-transparent" />
          </div>
        ) : colleges.length === 0 ? (
          <p className="text-center text-gray-500 py-20">No colleges found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {colleges.map((c) => (
              <div key={c.id} className="rounded-xl border hover:shadow-md transition-shadow overflow-hidden bg-white">
                {c.image_url && (
                  <img src={c.image_url} alt={c.name} className="w-full h-44 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-navy">{c.name}</h3>
                  <p className="text-gray-500 text-sm">{c.city}, {c.state}</p>
                  {c.established_year && (
                    <p className="text-gray-400 text-xs mt-1">Est. {c.established_year}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-gold text-sm">★ {c.rating}</span>
                    <span className="text-gray-400 text-xs">({c.review_count} reviews)</span>
                  </div>
                  {c.is_featured && (
                    <span className="inline-block mt-2 bg-gold/10 text-gold text-xs font-semibold px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
