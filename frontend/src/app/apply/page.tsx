'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from '@tanstack/react-query'
import { collegeApi, courseApi, applicationApi } from '@/services/api'
import type { College, Course, ApplicationCreate } from '@/types'

const STEPS = [
  { n: 1, label: 'Student Details' },
  { n: 2, label: 'Parent Details' },
  { n: 3, label: 'Course Selection' },
  { n: 4, label: 'College Preference' },
  { n: 5, label: 'Documents' },
  { n: 6, label: 'Review & Submit' },
]

const AI_RECS = [
  { name: 'B.Tech Computer Science Engineering', match: 95, level: 'High Match', dots: 4.5, color: 'bg-blue-500' },
  { name: 'B.Tech Artificial Intelligence & Machine Learning', match: 92, level: 'High Match', dots: 4, color: 'bg-blue-400' },
  { name: 'B.Tech Cyber Security', match: 85, level: 'Good Match', dots: 3, color: 'bg-orange-400' },
]

const DOCS = [
  { name: 'Aadhaar Card', required: true, accept: 'PDF, JPG, PNG', maxSize: 'Max 2MB' },
  { name: '10th Marksheet', required: true, accept: 'PDF, JPG, PNG', maxSize: 'Max 2MB' },
  { name: '12th Marksheet', required: true, accept: 'PDF, JPG, PNG', maxSize: 'Max 2MB' },
  { name: 'Transfer Certificate', required: false, accept: 'PDF, JPG, PNG', maxSize: 'Max 2MB' },
  { name: 'Community Certificate (If Applicable)', required: false, accept: 'PDF, JPG, PNG', maxSize: 'Max 2MB' },
  { name: 'Passport Size Photo', required: true, accept: 'JPG, PNG', maxSize: 'Max 1MB' },
]

const BOARDS = ['CBSE', 'ICSE', 'Tamil Nadu State Board', 'Andhra Pradesh Board', 'Karnataka Board', 'Other']
const YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i))
const GENDERS = ['Male', 'Female', 'Other']

function InputField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy placeholder-gray-400'
const selectCls = `${inputCls} bg-white appearance-none`

export default function ApplyPage() {
  const searchParams = useSearchParams()
  const defaultCourse = searchParams.get('course') ? Number(searchParams.get('course')) : undefined

  const [form, setForm] = useState<ApplicationCreate & {
    dob: string; gender: string; nationality: string; whatsapp: string; aadhaar: string;
    marks_10: string; marks_12: string; board: string; year_of_passing: string;
    stream: string; college2: number; college3: number;
  }>({
    college: 0, college2: 0, college3: 0,
    course: defaultCourse ?? 0,
    applicant_name: '', email: '', phone: '',
    marks_percentage: undefined, stream: '', message: '',
    dob: '', gender: '', nationality: 'Indian', whatsapp: '',
    aadhaar: '', marks_10: '', marks_12: '', board: '', year_of_passing: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const { data: collegesData } = useQuery({
    queryKey: ['colleges-list'],
    queryFn: () => collegeApi.list().then((r) => r.data),
  })
  const { data: coursesData } = useQuery({
    queryKey: ['courses-list'],
    queryFn: () => courseApi.list().then((r) => r.data),
  })

  const colleges: College[] = collegesData?.results ?? collegesData ?? []
  const courses: Course[] = coursesData?.results ?? coursesData ?? []

  const mutation = useMutation({
    mutationFn: (data: ApplicationCreate) => applicationApi.create(data),
    onSuccess: () => setSubmitted(true),
  })

  const set = (key: string, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Application Submitted!</h2>
          <p className="text-green-600">Thank you! Our counselors will review your application and contact you within 48 hours.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Apply for Admission</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in your details and take the first step towards your bright future.</p>
        </div>

        <div className="flex items-center mb-8 overflow-x-auto pb-2">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                  ${step.n === 1 ? 'bg-navy border-navy text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                  {step.n}
                </div>
                <span className={`text-xs mt-1 whitespace-nowrap ${step.n === 1 ? 'text-navy font-semibold' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-16 md:w-24 mx-1 mb-4 flex-shrink-0 ${step.n < 1 ? 'bg-navy' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-6 items-start">

            <div className="flex-1 space-y-5 min-w-0">

              {/* Student Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Student Information</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InputField label="Full Name" required>
                    <input type="text" placeholder="Enter full name" value={form.applicant_name}
                      onChange={(e) => set('applicant_name', e.target.value)} className={inputCls} required />
                  </InputField>
                  <InputField label="Date of Birth" required>
                    <input type="text" placeholder="DD / MM / YYYY" value={form.dob}
                      onChange={(e) => set('dob', e.target.value)} className={inputCls} />
                  </InputField>
                  <InputField label="Gender" required>
                    <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={selectCls}>
                      <option value="">Select Gender</option>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </InputField>
                  <InputField label="Nationality" required>
                    <select value={form.nationality} onChange={(e) => set('nationality', e.target.value)} className={selectCls}>
                      <option value="Indian">Indian</option>
                      <option value="Other">Other</option>
                    </select>
                  </InputField>
                  <InputField label="Mobile Number" required>
                    <div className="flex">
                      <span className="border border-r-0 border-gray-300 rounded-l-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-600">+91</span>
                      <input type="tel" placeholder="Enter mobile number" value={form.phone}
                        onChange={(e) => set('phone', e.target.value)} className={`${inputCls} rounded-l-none`} required />
                    </div>
                  </InputField>
                  <InputField label="WhatsApp Number">
                    <div className="flex">
                      <span className="border border-r-0 border-gray-300 rounded-l-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-600">+91</span>
                      <input type="tel" placeholder="Enter WhatsApp number" value={form.whatsapp}
                        onChange={(e) => set('whatsapp', e.target.value)} className={`${inputCls} rounded-l-none`} />
                    </div>
                  </InputField>
                  <InputField label="Email Address" required>
                    <input type="email" placeholder="Enter email address" value={form.email}
                      onChange={(e) => set('email', e.target.value)} className={inputCls} required />
                  </InputField>
                  <InputField label="Aadhaar Number">
                    <input type="text" placeholder="Enter 12 digit aadhaar number" value={form.aadhaar}
                      onChange={(e) => set('aadhaar', e.target.value)} className={inputCls} maxLength={12} />
                  </InputField>
                </div>
              </div>

              {/* Academic Details */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3.5l4 2 4-2" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Academic Details</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <InputField label="10th Percentage / CGPA" required>
                    <input type="text" placeholder="Enter 10th percentage" value={form.marks_10}
                      onChange={(e) => set('marks_10', e.target.value)} className={inputCls} />
                  </InputField>
                  <InputField label="12th Percentage / CGPA" required>
                    <input type="text" placeholder="Enter 12th percentage" value={form.marks_12}
                      onChange={(e) => set('marks_12', e.target.value)} className={inputCls} />
                  </InputField>
                  <InputField label="Board" required>
                    <select value={form.board} onChange={(e) => set('board', e.target.value)} className={selectCls}>
                      <option value="">Select Board</option>
                      {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </InputField>
                  <InputField label="Year of Passing" required>
                    <select value={form.year_of_passing} onChange={(e) => set('year_of_passing', e.target.value)} className={selectCls}>
                      <option value="">Select Year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </InputField>
                </div>
              </div>

              {/* Course Selection */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Course Selection</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Select Course Stream" required>
                    <select value={form.stream} onChange={(e) => set('stream', e.target.value)} className={selectCls}>
                      <option value="">Select Stream</option>
                      {['Engineering', 'Medical', 'Management', 'Commerce', 'Arts & Science', 'Law'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </InputField>
                  <InputField label="Select Course" required>
                    <select value={form.course || ''} onChange={(e) => set('course', Number(e.target.value))} className={selectCls}>
                      <option value="">Select Course</option>
                      {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </InputField>
                  <div className="col-span-2 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Not sure which course is right for you?</p>
                      <p className="text-sm text-purple-600 mt-0.5">Get AI powered course recommendations</p>
                    </div>
                    <button type="button" className="flex items-center gap-2 bg-white border border-purple-300 text-purple-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Get Recommendations
                    </button>
                  </div>
                </div>
              </div>

              {/* College Preferences */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
                    </svg>
                  </div>
                  <h2 className="text-base font-bold text-gray-900">College Preferences</h2>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <InputField label="1st Preference" required>
                    <select value={form.college || ''} onChange={(e) => set('college', Number(e.target.value))} className={selectCls}>
                      <option value="">Select College</option>
                      {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </InputField>
                  <InputField label="2nd Preference" required>
                    <select value={form.college2 || ''} onChange={(e) => set('college2', Number(e.target.value))} className={selectCls}>
                      <option value="">Select College</option>
                      {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </InputField>
                  <InputField label="3rd Preference">
                    <select value={form.college3 || ''} onChange={(e) => set('college3', Number(e.target.value))} className={selectCls}>
                      <option value="">Select College</option>
                      {colleges.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </InputField>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 text-sm text-amber-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Tip: Add multiple preferences to increase your chances of getting admission.
                </div>
              </div>

              {/* Bottom action buttons */}
              <div className="flex items-center justify-between pb-4">
                <button type="button" className="flex items-center gap-2 border border-gray-300 text-gray-600 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save &amp; Continue Later
                </button>
                <button type="submit" disabled={mutation.isPending}
                  className="flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold text-sm px-7 py-2.5 rounded-lg transition-colors disabled:opacity-60">
                  {mutation.isPending ? 'Saving...' : 'Save & Next'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* RIGHT: Sidebar */}
            <div className="w-80 flex-shrink-0 space-y-4">

              {/* Application Progress */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4">Application Progress</h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                      <circle cx="36" cy="36" r="30" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                      <circle cx="36" cy="36" r="30" fill="none" stroke="#0D1F4C" strokeWidth="6"
                        strokeDasharray="188.5" strokeDashoffset="156.5" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-navy">17%</span>
                      <span className="text-xs text-gray-400">Completed</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">Step 1 of 6</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">Student Details</p>
                    <p className="text-gray-500 text-xs mt-1 leading-tight">Please complete this step to continue your application.</p>
                  </div>
                </div>
              </div>

              {/* AI Course Recommendations */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">AI Course Recommendations</h3>
                  <span className="text-xs bg-purple-100 text-purple-600 font-semibold px-2 py-0.5 rounded">Beta</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">Based on your academic profile</p>
                <div className="space-y-3">
                  {AI_RECS.map((rec) => (
                    <div key={rec.name} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${rec.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 leading-tight">{rec.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{rec.level}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[1,2,3,4,5].map(d => (
                            <div key={d} className={`w-3 h-1.5 rounded-sm ${d <= rec.dots ? 'bg-green-400' : 'bg-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-600 flex-shrink-0">{rec.match}%<br /><span className="text-gray-400 font-normal">Match</span></span>
                    </div>
                  ))}
                </div>
                <button type="button" className="mt-4 text-xs text-navy font-semibold hover:underline flex items-center gap-1">
                  View More Recommendations →
                </button>
              </div>

              {/* Document Upload */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-1">Document Upload</h3>
                <p className="text-xs text-gray-400 mb-4">Upload clear and valid documents</p>
                <div className="space-y-3">
                  {DOCS.map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            {doc.name}{doc.required && <span className="text-red-500"> *</span>}
                          </p>
                          <p className="text-xs text-gray-400">{doc.accept} - {doc.maxSize}</p>
                        </div>
                      </div>
                      <label className="text-xs font-semibold text-navy border border-navy px-3 py-1 rounded-lg cursor-pointer hover:bg-navy hover:text-white transition-colors flex-shrink-0">
                        Upload
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Your documents are safe and secure with us.
                </div>
              </div>

            </div>
          </div>
        </form>

        {/* Trust bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 border border-gray-200 rounded-2xl bg-white mt-6 overflow-hidden">
          {[
            { icon: '🔒', title: '100% Secure', desc: 'Your data is protected' },
            { icon: '👥', title: 'Trusted by 25,000+ Students', desc: 'Successful admissions' },
            { icon: '🎓', title: 'Expert Guidance', desc: 'From admission to enrollment' },
            { icon: '💬', title: '24/7 Support', desc: 'We are here to help' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 px-5 py-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
