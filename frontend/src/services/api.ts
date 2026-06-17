import axios from 'axios'

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || ''}/api`,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      if (typeof window !== 'undefined') {
        const refresh = localStorage.getItem('refresh_token')
        if (refresh) {
          try {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/token/refresh/`,
              { refresh }
            )
            localStorage.setItem('access_token', data.access)
            original.headers.Authorization = `Bearer ${data.access}`
            return api(original)
          } catch {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/login'
          }
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

export const authApi = {
  register: (data: object) => api.post('/auth/register/', data),
  login: (data: object) => api.post('/auth/login/', data),
  me: () => api.get('/auth/me/'),
  updateMe: (data: object) => api.patch('/auth/me/', data),
}

export const collegeApi = {
  list: (params?: object) => api.get('/colleges/', { params }),
  get: (id: number) => api.get(`/colleges/${id}/`),
}

export const courseApi = {
  list: (params?: object) => api.get('/courses/', { params }),
  get: (id: number) => api.get(`/courses/${id}/`),
  popular: () => api.get('/courses/popular/'),
  streams: () => api.get('/courses/streams/'),
}

export const applicationApi = {
  list: () => api.get('/applications/'),
  create: (data: object) => api.post('/applications/', data),
}

export const scholarshipApi = {
  list: (params?: object) => api.get('/scholarships/', { params }),
}

export const contactApi = {
  submit: (data: object) => api.post('/contact/', data),
}
