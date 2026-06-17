'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone_number: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
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

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="VA" className="h-14 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-navy">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Start your admissions journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'full_name', label: 'Full Name', type: 'text', required: true },
            { key: 'email', label: 'Email', type: 'email', required: true },
            { key: 'phone_number', label: 'Phone (optional)', type: 'tel', required: false },
            { key: 'password', label: 'Password', type: 'password', required: true },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input
                required={f.required}
                type={f.type}
                value={(form as Record<string, string>)[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>
          ))}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-white font-semibold py-2.5 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-gold font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
