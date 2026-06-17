'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { contactApi } from '@/services/api'
import type { Inquiry } from '@/types'

export default function ContactPage() {
  const [form, setForm] = useState<Inquiry>({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: (data: Inquiry) => contactApi.submit(data),
    onSuccess: () => setSubmitted(true),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <>
      <div className="bg-navy text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-300">Get in touch with our counselors</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold text-navy mb-6">Send us a Message</h2>
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-semibold text-green-700">Message sent successfully!</p>
              <p className="text-green-600 text-sm mt-1">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'name', label: 'Full Name', type: 'text', required: true },
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'phone', label: 'Phone (optional)', type: 'tel', required: false },
                { name: 'subject', label: 'Subject', type: 'text', required: true },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    required={field.required}
                    value={(form as Record<string, string>)[field.name]}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-gold text-white font-semibold py-3 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-60"
              >
                {mutation.isPending ? 'Sending...' : 'Send Message'}
              </button>
              {mutation.isError && (
                <p className="text-red-500 text-sm text-center">Failed to send. Please try again.</p>
              )}
            </form>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-navy mb-6">Get in Touch</h2>
          {[
            { icon: '📧', label: 'Email', value: 'info@varunaditya.in' },
            { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
            { icon: '📍', label: 'Address', value: 'Chennai, Tamil Nadu, India' },
            { icon: '🕐', label: 'Hours', value: 'Mon–Sat, 9AM – 6PM' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-medium text-gray-700">{item.label}</div>
                <div className="text-gray-500 text-sm">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
