'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { courseApi } from '@/services/api'
import type { Course } from '@/types'

const STREAMS = ['engineering', 'medical', 'management', 'commerce', 'arts', 'law', 'design', 'pharmacy', 'nursing']

export default function CoursesPage() {
  const searchParams = useSearchParams()
  const [activeStream, setActiveStream] = useState(searchParams.get('stream') ?? '')
  const [search, setSearch] = useState('')

  const { data: courses, isLoading } = useQuery<{ results: Course[] }>({
    queryKey: ['courses', activeStream, search],
    queryFn: () =>
      courseApi.list({ stream: activeStream || undefined, search: search || undefined })
        .then((r) => r.data),
  })

  const list: Course[] = courses?.results ?? (courses as unknown as Course[]) ?? []

  return (
    <>
      <div className="bg-navy text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
          <p className="text-gray-300">Find the right program for your career goals</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="mt-4 w-full max-w-md px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-48 shrink-0">
          <h3 className="font-semibold text-gray-700 mb-3">Browse by Stream</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveStream('')}
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
                  onClick={() => setActiveStream(s)}
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
          ) : list.length === 0 ? (
            <p className="text-gray-500 text-center py-20">No courses found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {list.map((course) => (
                <div key={course.id} className="bg-white rounded-xl p-5 border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-navy">{course.name}</h3>
                    <span className="bg-gold/10 text-gold text-xs font-semibold px-2 py-1 rounded ml-2 whitespace-nowrap">
                      {course.short_name}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1 capitalize">{course.stream} &bull; {course.duration_years} yrs</p>
                  <p className="text-gray-500 text-xs mt-1">Eligibility: {course.eligibility}</p>
                  {course.avg_salary_max > 0 && (
                    <p className="text-green-600 text-sm mt-2 font-medium">
                      ₹{course.avg_salary_min}L – ₹{course.avg_salary_max}L PA
                    </p>
                  )}
                  <Link
                    href={`/apply?course=${course.id}`}
                    className="inline-block mt-3 text-sm text-gold font-semibold hover:underline"
                  >
                    Apply →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
