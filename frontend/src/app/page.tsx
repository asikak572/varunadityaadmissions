'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { collegeApi } from '@/services/api'
import type { College } from '@/types'

const WHATSAPP_URL = 'https://wa.me/91XXXXXXXXXX?text=Hi, I need help with admissions'

const STATS = [
  {
    number: '5000+', label: 'Students Guided', iconBg: 'bg-blue-100',
    icon: <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 00-3-3.87" /></svg>,
  },
  {
    number: '200+', label: 'Top Colleges', iconBg: 'bg-orange-100',
    icon: <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" /></svg>,
  },
  {
    number: '50+', label: 'Courses Offered', iconBg: 'bg-green-100',
    icon: <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3.5l4 2 4-2" /></svg>,
  },
  {
    number: '95%', label: 'Success Rate', iconBg: 'bg-purple-100',
    icon: <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-5-4a9 9 0 1114 0H7z" /></svg>,
  },
]

const FALLBACK_COLLEGES: College[] = [
  { id: 1, name: 'VIT University', slug: 'vit-university', city: 'Vellore', state: 'Tamil Nadu', rating: 4.8, image_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop', is_featured: true, description: '', established_year: 1984, website_url: '', review_count: 0 },
  { id: 2, name: 'SRM Institute', slug: 'srm-institute', city: 'Chennai', state: 'Tamil Nadu', rating: 4.6, image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop', is_featured: true, description: '', established_year: 1985, website_url: '', review_count: 0 },
  { id: 3, name: 'JSS Academy', slug: 'jss-academy', city: 'Mysuru', state: 'Karnataka', rating: 4.5, image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop', is_featured: true, description: '', established_year: 1963, website_url: '', review_count: 0 },
  { id: 4, name: 'RV College', slug: 'rv-college', city: 'Bengaluru', state: 'Karnataka', rating: 4.7, image_url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=200&fit=crop', is_featured: true, description: '', established_year: 1952, website_url: '', review_count: 0 },
  { id: 5, name: 'Anna University', slug: 'anna-university', city: 'Chennai', state: 'Tamil Nadu', rating: 4.9, image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop', is_featured: true, description: '', established_year: 1978, website_url: '', review_count: 0 },
]

const COURSES = [
  {
    label: 'B.Tech', stream: 'Engineering', slug: 'btech', iconBg: 'bg-blue-100',
    icon: <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    label: 'MBBS', stream: 'Medical', slug: 'mbbs', iconBg: 'bg-green-100',
    icon: <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9" /></svg>,
  },
  {
    label: 'BBA', stream: 'Management', slug: 'bba', iconBg: 'bg-purple-100',
    icon: <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>,
  },
  {
    label: 'B.Com', stream: 'Commerce', slug: 'bcom', iconBg: 'bg-orange-100',
    icon: <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a4 4 0 00-3-3.87" /></svg>,
  },
  {
    label: 'B.Sc', stream: 'Science', slug: 'bsc', iconBg: 'bg-green-100',
    icon: <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3v11a3 3 0 006 0V3M6 21h12M9 3h6" /></svg>,
  },
  {
    label: 'BA', stream: 'Arts', slug: 'ba', iconBg: 'bg-pink-100',
    icon: <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    label: 'BCA', stream: 'Computer Applications', slug: 'bca', iconBg: 'bg-yellow-100',
    icon: <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  {
    label: 'LLB', stream: 'Law', slug: 'llb', iconBg: 'bg-blue-100',
    icon: <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" /></svg>,
  },
]

const FEATURES = [
  { icon: '🎓', title: 'Expert Guidance', desc: 'Counselors with 10+ years of admissions experience' },
  { icon: '🏛️', title: 'Best College Options', desc: 'Access to 200+ top colleges across South India' },
  { icon: '🤝', title: 'End to End Support', desc: 'From selection to final admission — we handle everything' },
  { icon: '🗺️', title: 'Multiple States', desc: 'Covering Tamil Nadu, Andhra Pradesh & Karnataka' },
  { icon: '✅', title: '100% Honest & Transparent', desc: 'No hidden fees. Clear guidance every step of the way' },
]

export default function HomePage() {
  const sliderRef = useRef<HTMLDivElement>(null)

  const { data: apiColleges } = useQuery<College[]>({
    queryKey: ['colleges', 'featured'],
    queryFn: () => collegeApi.list({ is_featured: true }).then((r) => r.data.results ?? r.data),
  })

  const colleges = (apiColleges && apiColleges.length > 0) ? apiColleges : FALLBACK_COLLEGES

  const scroll = (dir: 'left' | 'right') => {
    sliderRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: 420, backgroundColor: '#daeef9' }}>
        <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[58%]">
          <img
            src="/hero.png"
            alt="Students at college campus"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-y-0 left-0 w-48 to-transparent pointer-events-none" style={{ background: 'linear-gradient(to right, #daeef9, transparent)' }} />
        </div>

        <div className="relative z-10 flex items-center min-h-[420px] px-8 lg:px-16 xl:px-24 py-14">
          <div className="max-w-[480px]">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Your Dream College,<br />
              <span className="text-gold">Our Guidance,</span><br />
              Your Success.
            </h1>
            <p className="text-gray-500 text-base mb-8">
              We help students get admission in the best colleges across Tamil Nadu, Andhra Pradesh &amp; Karnataka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-7 py-3 rounded-lg transition-colors"
              >
                Apply Now →
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold px-7 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              {['Expert Counselors', '100% Transparent', 'End to End Support'].map((badge) => (
                <div key={badge} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 px-6 py-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Colleges Slider */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-navy">Top Colleges</h2>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full border border-gray-300 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
              >
                ‹
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full border border-gray-300 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
              >
                ›
              </button>
            </div>
          </div>
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {colleges.map((college) => (
              <div
                key={college.id}
                className="flex-shrink-0 w-72 rounded-xl border hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="h-40 bg-gray-100 overflow-hidden">
                  {college.image_url ? (
                    <img src={college.image_url} alt={college.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-navy flex items-center justify-center text-white text-3xl">🏛️</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-navy truncate">{college.name}</h3>
                  <p className="text-gray-400 text-xs mt-1">{college.city}, {college.state}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <span className="text-gold text-sm">★</span>
                      <span className="text-sm font-medium text-gray-700">{college.rating}</span>
                    </div>
                    <Link
                      href={`/colleges/${college.id}`}
                      className="text-xs font-semibold text-gold border border-gold hover:bg-gold hover:text-white px-3 py-1 rounded transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-10 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-navy">Popular Courses</h2>
            <Link href="/courses" className="text-sm font-semibold text-gold hover:underline flex items-center gap-1">
              View All Courses →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {COURSES.map((c) => (
              <Link
                key={c.slug}
                href={`/courses?stream=${c.slug}`}
                className="flex-shrink-0 flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:shadow-md hover:border-gold transition-all"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${c.iconBg}`}>
                  {c.icon}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm whitespace-nowrap">{c.label}</div>
                  <div className="text-gray-400 text-xs whitespace-nowrap">{c.stream}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Varun Aditya + Testimonial */}
      <section className="py-16 px-4 bg-navy text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-10 text-center">Why Choose Varun Aditya?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="flex flex-col gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{f.title}</div>
                    <div className="text-gray-400 text-sm mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-7 border border-white/20">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-gold text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-200 text-sm leading-relaxed mb-6">
                &quot;Varun Aditya&apos;s team guided me through the entire admission process with complete transparency. I got into VIT on my first attempt! Their counselors were always available and never pushed me toward any specific college — they genuinely cared about my future.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-bold text-sm">
                  KR
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">Karthik R.</div>
                  <div className="text-gray-400 text-xs">VIT University, Vellore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
