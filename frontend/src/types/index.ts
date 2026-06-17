export interface User {
  id: number
  email: string
  full_name: string
  phone_number: string
  role: 'student' | 'admin'
  is_active: boolean
  created_at: string
}

export interface College {
  id: number
  name: string
  slug: string
  city: string
  state: string
  description: string
  established_year: number | null
  image_url: string
  website_url: string
  rating: number
  review_count: number
  is_featured: boolean
}

export interface Course {
  id: number
  name: string
  short_name: string
  stream: string
  duration_years: number
  eligibility: string
  avg_salary_min: number
  avg_salary_max: number
  is_popular: boolean
}

export interface Application {
  id: number
  college: number
  course: number
  college_name: string
  course_name: string
  status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'admitted'
  applicant_name: string
  email: string
  phone: string
  marks_percentage: number | null
  stream: string
  message: string
  created_at: string
}

export interface ApplicationCreate {
  college: number
  course: number
  applicant_name: string
  email: string
  phone: string
  marks_percentage?: number
  stream?: string
  message?: string
}

export interface Scholarship {
  id: number
  name: string
  provider: string
  amount: number | null
  description: string
  eligibility_criteria: string
  last_date: string | null
  stream: string
  link_url: string
}

export interface Inquiry {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  phone_number?: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface ApiError {
  detail: string | Record<string, string[]>
}
