'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const STREAMS = ['Engineering', 'Medical', 'Management', 'Commerce', 'Arts & Science', 'Law']

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    stream: '',
    role: 'student',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { confirm_password, stream, ...payload } = form
      await register(payload)
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { email?: string[]; password?: string[] } } })
        ?.response?.data
      if (msg?.email) setError(msg.email[0])
      else if (msg?.password) setError(msg.password[0])
      else setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-navy flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold opacity-10" />

        <div className="relative">
          <img src="/logo.png" alt="Varun Aditya" className="h-16 object-contain brightness-0 invert" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            Free to join — no charges
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Begin your journey<br />to the right college
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Create your free account and get matched with colleges that fit your marks, budget, and goals.
          </p>

          {/* Steps preview */}
          <div className="mt-10 space-y-4">
            {[
              { n: '01', title: 'Create your account', desc: 'Your details stay private and secure' },
              { n: '02', title: 'Tell us your preferences', desc: 'Stream, location, and budget' },
              { n: '03', title: 'Get matched & apply', desc: 'One form, multiple colleges' },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-4">
                <span className="text-gold font-bold text-sm mt-0.5 w-6 flex-shrink-0">{s.n}</span>
                <div>
                  <p className="text-white text-sm font-medium">{s.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {['P','R','A','M'].map((l) => (
                <div key={l} className="w-7 h-7 rounded-full bg-gold/20 border-2 border-navy flex items-center justify-center text-gold text-xs font-bold">{l}</div>
              ))}
            </div>
            <p className="text-white/50 text-xs">Join 25,000+ students who found their college here</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <img src="/logo.png" alt="Varun Aditya" className="h-12 mx-auto object-contain" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                  s < step ? 'bg-green-500 text-white' :
                  s === step ? 'bg-navy text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {s < step ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s}
                </div>
                <span className={`text-xs font-medium ${s === step ? 'text-navy' : 'text-gray-400'}`}>
                  {s === 1 ? 'Account details' : 'Your preferences'}
                </span>
                {s < 2 && <div className="h-px w-8 bg-gray-200 flex-shrink-0" />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-navy">Create your account</h1>
                <p className="text-gray-500 text-sm mt-1">Free forever. No credit card needed.</p>
              </div>

              <form onSubmit={handleStep1} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
                  <input
                    required
                    type="text"
                    autoComplete="name"
                    value={form.full_name}
                    onChange={(e) => set('full_name', e.target.value)}
                    placeholder="As on your certificate"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
                  <select
                    required
                    value={form.role}
                    onChange={(e) => set('role', e.target.value)}
                    className={`${inputCls} appearance-none bg-white cursor-pointer`}
                  >
                    <option value="student">Student</option>
                    <option value="counsellor">Counsellor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="flex">
                    <span className="border border-r-0 border-gray-200 rounded-l-xl px-3 py-3 text-sm bg-gray-50 text-gray-500 flex items-center">+91</span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={form.phone_number}
                      onChange={(e) => set('phone_number', e.target.value)}
                      placeholder="10-digit number"
                      className={`${inputCls} rounded-l-none border-l-0`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => set('password', e.target.value)}
                      placeholder="Min. 8 characters"
                      className={`${inputCls} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {form.password && (
                    <div className="mt-2 flex gap-1">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          form.password.length >= i * 3
                            ? i <= 1 ? 'bg-red-400' : i <= 2 ? 'bg-orange-400' : i <= 3 ? 'bg-yellow-400' : 'bg-green-500'
                            : 'bg-gray-200'
                        }`} />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
                  <input
                    required
                    type="password"
                    autoComplete="new-password"
                    value={form.confirm_password}
                    onChange={(e) => set('confirm_password', e.target.value)}
                    placeholder="Re-enter your password"
                    className={`${inputCls} ${form.confirm_password && form.confirm_password !== form.password ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                  />
                  {form.confirm_password && form.confirm_password !== form.password && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-navy hover:bg-navy-light text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>

                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-gold hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-gold hover:underline">Privacy Policy</a>
                </p>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-navy">Almost there!</h1>
                <p className="text-gray-500 text-sm mt-1">Tell us what you're looking for — we'll find the right colleges.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Which stream are you interested in?</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STREAMS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set('stream', s)}
                        className={`text-sm px-4 py-2.5 rounded-xl border text-left transition-all font-medium ${
                          form.stream === s
                            ? 'border-navy bg-navy text-white'
                            : 'border-gray-200 text-gray-600 hover:border-navy/30 hover:bg-gray-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skip option */}
                <p className="text-xs text-gray-400 text-center">
                  Not sure yet?{' '}
                  <button type="button" onClick={() => set('stream', '')} className="text-gold hover:underline">
                    Skip for now
                  </button>
                </p>

                {error && (
                  <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-navy hover:bg-navy-light text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Creating account...
                      </>
                    ) : 'Create account'}
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-gold font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
