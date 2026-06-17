# PRP: Varun Aditya Admissions Consultancy

> Implementation blueprint for parallel agent execution

---

## METADATA

| Field | Value |
|-------|-------|
| **Product** | Varun Aditya Admissions Consultancy |
| **Type** | Education Platform |
| **Version** | 1.0 |
| **Created** | 2026-06-16 |
| **Complexity** | Medium |

---

## PRODUCT OVERVIEW

**Description:** An online admissions consultancy platform where students and parents browse top colleges, explore courses by stream, submit applications, and discover scholarships — guided by expert counselors across Tamil Nadu, Andhra Pradesh & Karnataka.

**Value Proposition:** Students get a single platform to discover, compare and apply to colleges with expert guidance — saving time and improving admission success rates.

**MVP Scope:**
- [ ] Homepage with hero, stats, top colleges, courses, testimonials
- [ ] Browse colleges with search + state/stream filters
- [ ] Browse courses page with sidebar filters
- [ ] Student registration and login (JWT)
- [ ] Online application submission form
- [ ] WhatsApp contact integration (floating button + CTAs)
- [ ] Admin panel — manage colleges, courses, applications, inquiries

---

## TECH STACK

| Layer | Technology | Skill Reference |
|-------|------------|-----------------|
| Backend | Django 4.2+ + Python 3.11+ + DRF | skills/BACKEND.md |
| Frontend | React + TypeScript + Vite | skills/FRONTEND.md |
| Database | PostgreSQL + Django ORM | skills/DATABASE.md |
| Auth | Email/Password + SimpleJWT | skills/BACKEND.md |
| UI | Tailwind CSS + shadcn/ui | skills/FRONTEND.md |
| Testing | pytest + Vitest + RTL | skills/TESTING.md |
| Deployment | Docker + GitHub Actions | skills/DEPLOYMENT.md |

---

## DATABASE MODELS

### User
```
id, email (unique), password (hashed), full_name, phone_number
role: "student" | "admin"
is_active (bool), is_verified (bool)
created_at, updated_at
```

### College
```
id, name, slug (unique), city, state
description, established_year
image_url, website_url
rating (decimal 0-5), review_count
is_featured (bool), is_active (bool)
created_at, updated_at
```

### Course
```
id, name, short_name (e.g. "B.Tech", "MBBS")
stream: engineering|medical|management|commerce|arts|law|design|pharmacy|nursing
duration_years (decimal), eligibility
avg_salary_min, avg_salary_max (integers, in lakhs PA)
description, is_popular (bool), is_active (bool)
created_at, updated_at
```

### CollegeCourse (M2M through table)
```
id, college_id (FK), course_id (FK)
fees_per_year, seats_available
```

### CareerOpportunity
```
id, course_id (FK), job_title
```

### Application
```
id, student_id (FK User), college_id (FK), course_id (FK)
status: pending|under_review|shortlisted|rejected|admitted
applicant_name, email, phone
marks_percentage (decimal), stream
message (optional text)
created_at, updated_at
```

### Scholarship
```
id, name, provider, amount (decimal)
description, eligibility_criteria
last_date (date), stream (nullable = all)
link_url, is_active (bool)
created_at, updated_at
```

### Inquiry
```
id, name, email, phone
subject, message (text)
status: new|replied|closed
created_at
```

**Totals:** 8 models, 4 foreign keys, 1 M2M relationship

---

## MODULES

---

### Module 1: Authentication
**Agents:** DATABASE-AGENT + BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register student |
| POST | /api/auth/login | Public | Login → returns JWT |
| POST | /api/auth/logout | Auth | Invalidate token |
| POST | /api/auth/refresh | Public | Refresh access token |
| GET | /api/auth/me | Auth | Get current user |
| PUT | /api/auth/me | Auth | Update profile |

**Frontend Pages:**
| Route | Page | Key Components |
|-------|------|----------------|
| /login | LoginPage | LoginForm, Logo |
| /register | RegisterPage | RegisterForm |
| /profile | ProfilePage (protected) | ProfileCard, EditForm |

---

### Module 2: Colleges
**Agents:** DATABASE-AGENT + BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/colleges/ | Public | List colleges (filter: state, stream, search) |
| GET | /api/colleges/{id}/ | Public | College detail |
| GET | /api/colleges/featured/ | Public | Featured colleges (homepage) |
| POST | /api/colleges/ | Admin | Create college |
| PUT | /api/colleges/{id}/ | Admin | Update college |
| DELETE | /api/colleges/{id}/ | Admin | Delete college |

**Query Params:** `?state=Tamil Nadu&stream=engineering&search=VIT&page=1`

**Frontend Pages:**
| Route | Page | Key Components |
|-------|------|----------------|
| /colleges | CollegesPage | SearchBar, FilterSidebar, CollegeCard, Pagination |
| /colleges/:id | CollegeDetailPage | CollegeHeader, CoursesList, ApplyButton |

---

### Module 3: Courses
**Agents:** DATABASE-AGENT + BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/courses/ | Public | List courses (filter: stream, duration, level) |
| GET | /api/courses/{id}/ | Public | Course detail |
| GET | /api/courses/popular/ | Public | Popular courses (homepage) |
| GET | /api/courses/streams/ | Public | All streams with course counts |
| POST | /api/courses/ | Admin | Create course |
| PUT | /api/courses/{id}/ | Admin | Update course |
| DELETE | /api/courses/{id}/ | Admin | Delete course |

**Frontend Pages:**
| Route | Page | Key Components |
|-------|------|----------------|
| /courses | CoursesPage | BrowseSidebar, CourseCard, SearchHero, CategoryGrid |
| /courses/:id | CourseDetailPage | CourseInfo, CareerOpportunities, ApplyButton |

---

### Module 4: Applications
**Agents:** DATABASE-AGENT + BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/applications/ | Auth (student) | Submit application |
| GET | /api/applications/mine/ | Auth (student) | My applications |
| GET | /api/applications/{id}/ | Auth (student) | Application detail |
| GET | /api/admin/applications/ | Admin | All applications |
| PUT | /api/admin/applications/{id}/ | Admin | Update status |
| DELETE | /api/admin/applications/{id}/ | Admin | Delete application |

**Frontend Pages:**
| Route | Page | Key Components |
|-------|------|----------------|
| /apply | ApplyPage | ApplicationForm, CollegePicker, CoursePicker |
| /my-applications | MyApplicationsPage (protected) | ApplicationCard, StatusBadge |

---

### Module 5: Scholarships
**Agents:** DATABASE-AGENT + BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/scholarships/ | Public | List scholarships (filter: stream) |
| GET | /api/scholarships/{id}/ | Public | Scholarship detail |
| POST | /api/scholarships/ | Admin | Create scholarship |
| PUT | /api/scholarships/{id}/ | Admin | Update |
| DELETE | /api/scholarships/{id}/ | Admin | Delete |

**Frontend Pages:**
| Route | Page | Key Components |
|-------|------|----------------|
| /scholarships | ScholarshipsPage | ScholarshipCard, StreamFilter |
| /scholarships/:id | ScholarshipDetailPage | ScholarshipInfo, ApplyLink |

---

### Module 6: Contact & WhatsApp
**Agents:** DATABASE-AGENT + BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/contact/ | Public | Submit inquiry |
| GET | /api/admin/inquiries/ | Admin | List inquiries |
| PUT | /api/admin/inquiries/{id}/ | Admin | Update status |

**Frontend Components:**
| Component | Description |
|-----------|-------------|
| WhatsAppFAB | Floating WhatsApp button (all pages, bottom-right) |
| ContactForm | Inquiry submission form |
| NavWhatsAppBtn | "Chat on WhatsApp" navbar button |

**Frontend Pages:**
| Route | Page | Key Components |
|-------|------|----------------|
| /contact | ContactPage | ContactForm, WhatsAppCard, MapEmbed |

---

### Module 7: Admin Panel
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Frontend Pages:**
| Route | Page | Key Components |
|-------|------|----------------|
| /admin | AdminDashboard | StatsCards, RecentApplications, RecentInquiries |
| /admin/colleges | AdminColleges | DataTable, AddCollegeModal, EditCollegeModal |
| /admin/courses | AdminCourses | DataTable, AddCourseModal |
| /admin/applications | AdminApplications | DataTable, StatusBadge, StatusUpdater |
| /admin/scholarships | AdminScholarships | DataTable, AddScholarshipModal |
| /admin/inquiries | AdminInquiries | DataTable, InquiryDetail, StatusUpdater |
| /admin/users | AdminUsers | DataTable, UserDetail |

All admin routes protected by `AdminRoute` guard (role === "admin").

---

### Module 8: Homepage & Static Pages
**Agents:** FRONTEND-AGENT

**Frontend Pages:**
| Route | Page | Key Sections |
|-------|------|--------------|
| / | HomePage | Navbar, Hero, Stats, TopColleges, PopularCourses, WhyChooseUs, Testimonials, Footer |
| /about | AboutPage | Mission, Team, Stats, WhyChooseUs |

**Reusable Components:**
| Component | Used In |
|-----------|---------|
| Navbar | All pages |
| Footer | All pages |
| CollegeCard | Home, Colleges |
| CourseCard | Home, Courses |
| StatsBanner | Home, About |
| WhatsAppFAB | All pages |
| SearchBar | Colleges, Courses |

---

## PHASE EXECUTION PLAN

### Phase 1: Foundation (4 agents in parallel)

```yaml
DATABASE-AGENT:
  tasks:
    - Create Django project structure: backend/
    - Create all 8 Django apps (users, colleges, courses, applications, scholarships, contact, admin_panel, core)
    - Write all models.py files
    - Create and run initial migrations
    - Add fixtures/seed data (5 colleges, 8 courses, 3 scholarships)
  outputs:
    - backend/manage.py
    - backend/config/settings.py
    - backend/apps/*/models.py
    - backend/apps/*/migrations/

BACKEND-AGENT:
  tasks:
    - Setup Django + DRF + SimpleJWT in requirements.txt
    - Configure settings.py (database, jwt, cors, static)
    - Setup URL routing (config/urls.py)
    - Create base serializers and permissions
  outputs:
    - backend/requirements.txt
    - backend/config/settings.py
    - backend/config/urls.py

FRONTEND-AGENT:
  tasks:
    - Configure Vite + React + TypeScript (already scaffolded in frontend/)
    - Install Tailwind CSS + shadcn/ui
    - Setup React Router v6
    - Create folder structure: pages/, components/, hooks/, services/, types/, context/
    - Create base layout (Navbar, Footer, Layout wrapper)
    - Create AuthContext + ProtectedRoute + AdminRoute
  outputs:
    - frontend/src/App.tsx (with all routes)
    - frontend/src/components/layout/Navbar.tsx
    - frontend/src/components/layout/Footer.tsx
    - frontend/src/context/AuthContext.tsx
    - frontend/src/types/index.ts (all TypeScript interfaces)

DEVOPS-AGENT:
  tasks:
    - Create Dockerfile for backend (Django)
    - Create Dockerfile for frontend (Node)
    - Create docker-compose.yml (postgres + backend + frontend)
    - Create .env.example
    - Create GitHub Actions CI workflow
  outputs:
    - backend/Dockerfile
    - frontend/Dockerfile
    - docker-compose.yml
    - .env.example
    - .github/workflows/ci.yml
```

**Validation Gate 1:**
```bash
cd backend && pip install -r requirements.txt && python manage.py migrate
cd frontend && npm install && npm run build
docker-compose config
```

---

### Phase 2: Modules (backend + frontend parallel per module)

```yaml
AUTH MODULE:
  BACKEND-AGENT:
    - apps/users/serializers.py (RegisterSerializer, LoginSerializer, UserSerializer)
    - apps/users/views.py (RegisterView, LoginView, MeView)
    - apps/users/urls.py
  FRONTEND-AGENT:
    - pages/LoginPage.tsx
    - pages/RegisterPage.tsx
    - components/auth/LoginForm.tsx
    - components/auth/RegisterForm.tsx
    - services/authService.ts

COLLEGES MODULE:
  BACKEND-AGENT:
    - apps/colleges/serializers.py
    - apps/colleges/views.py (CollegeViewSet with filtering)
    - apps/colleges/urls.py
    - apps/colleges/filters.py
  FRONTEND-AGENT:
    - pages/CollegesPage.tsx
    - pages/CollegeDetailPage.tsx
    - components/colleges/CollegeCard.tsx
    - components/colleges/CollegeFilter.tsx
    - services/collegeService.ts

COURSES MODULE:
  BACKEND-AGENT:
    - apps/courses/serializers.py
    - apps/courses/views.py (CourseViewSet with filtering)
    - apps/courses/urls.py
  FRONTEND-AGENT:
    - pages/CoursesPage.tsx  (convert from apply.html)
    - pages/CourseDetailPage.tsx
    - components/courses/CourseCard.tsx
    - components/courses/BrowseSidebar.tsx
    - services/courseService.ts

APPLICATIONS MODULE:
  BACKEND-AGENT:
    - apps/applications/serializers.py
    - apps/applications/views.py
    - apps/applications/urls.py
  FRONTEND-AGENT:
    - pages/ApplyPage.tsx
    - pages/MyApplicationsPage.tsx
    - components/applications/ApplicationForm.tsx
    - components/applications/ApplicationCard.tsx
    - services/applicationService.ts

SCHOLARSHIPS MODULE:
  BACKEND-AGENT:
    - apps/scholarships/serializers.py
    - apps/scholarships/views.py
    - apps/scholarships/urls.py
  FRONTEND-AGENT:
    - pages/ScholarshipsPage.tsx
    - components/scholarships/ScholarshipCard.tsx
    - services/scholarshipService.ts

CONTACT MODULE:
  BACKEND-AGENT:
    - apps/contact/serializers.py
    - apps/contact/views.py
    - apps/contact/urls.py
  FRONTEND-AGENT:
    - pages/ContactPage.tsx
    - components/common/WhatsAppFAB.tsx
    - services/contactService.ts

HOMEPAGE + ADMIN:
  FRONTEND-AGENT:
    - pages/HomePage.tsx  (convert from index.html)
    - pages/admin/AdminDashboard.tsx
    - pages/admin/AdminColleges.tsx
    - pages/admin/AdminCourses.tsx
    - pages/admin/AdminApplications.tsx
    - pages/admin/AdminInquiries.tsx
    - components/home/HeroSection.tsx
    - components/home/StatsBar.tsx
    - components/home/TopColleges.tsx
    - components/home/PopularCourses.tsx
    - components/home/WhyChooseUs.tsx
    - components/home/Testimonials.tsx
```

**Validation Gate 2:**
```bash
cd backend && ruff check apps/ && python manage.py check
cd frontend && npm run lint && npm run type-check
```

---

### Phase 3: Quality (parallel)

```yaml
TEST-AGENT:
  backend tests (pytest):
    - tests/test_auth.py       (register, login, refresh, me)
    - tests/test_colleges.py   (list, filter, detail, admin CRUD)
    - tests/test_courses.py    (list, filter, popular, streams)
    - tests/test_applications.py (submit, mine, admin update)
    - tests/test_scholarships.py
    - tests/test_contact.py
  frontend tests (Vitest + RTL):
    - tests/LoginPage.test.tsx
    - tests/CollegesPage.test.tsx
    - tests/ApplicationForm.test.tsx
  target: 70%+ backend coverage

REVIEW-AGENT:
  - Security: SQL injection, XSS, JWT security, admin route guards
  - Performance: DB query optimization, N+1 checks, pagination
  - Code quality: DRY, type safety, error handling
```

**Final Validation:**
```bash
cd backend && pytest --cov=apps --cov-report=term-missing
cd frontend && npm test
docker-compose up -d && curl http://localhost:8000/api/health/
```

---

## VALIDATION GATES SUMMARY

| Gate | When | Commands |
|------|------|----------|
| Gate 1 | After Phase 1 | `python manage.py migrate`, `npm install`, `docker-compose config` |
| Gate 2 | After Phase 2 | `ruff check`, `python manage.py check`, `npm run type-check` |
| Gate 3 | After Phase 3 | `pytest --cov`, `npm test`, `docker-compose up` |

---

## FILE STRUCTURE (Target)

```
consu/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── apps/
│       ├── users/
│       │   ├── models.py, serializers.py, views.py, urls.py
│       ├── colleges/
│       │   ├── models.py, serializers.py, views.py, urls.py, filters.py
│       ├── courses/
│       │   ├── models.py, serializers.py, views.py, urls.py
│       ├── applications/
│       │   ├── models.py, serializers.py, views.py, urls.py
│       ├── scholarships/
│       │   ├── models.py, serializers.py, views.py, urls.py
│       └── contact/
│           ├── models.py, serializers.py, views.py, urls.py
├── frontend/
│   └── src/
│       ├── App.tsx (router)
│       ├── main.tsx
│       ├── types/index.ts
│       ├── context/AuthContext.tsx
│       ├── services/ (authService, collegeService, courseService...)
│       ├── hooks/ (useAuth, useColleges, useCourses...)
│       ├── components/
│       │   ├── layout/ (Navbar, Footer, Layout)
│       │   ├── common/ (WhatsAppFAB, SearchBar, StatusBadge...)
│       │   ├── home/ (HeroSection, StatsBar, TopColleges...)
│       │   ├── colleges/ (CollegeCard, CollegeFilter...)
│       │   ├── courses/ (CourseCard, BrowseSidebar...)
│       │   ├── applications/ (ApplicationForm, ApplicationCard...)
│       │   └── auth/ (LoginForm, RegisterForm...)
│       └── pages/
│           ├── HomePage.tsx
│           ├── CollegesPage.tsx
│           ├── CoursesPage.tsx
│           ├── ApplyPage.tsx
│           ├── ScholarshipsPage.tsx
│           ├── ContactPage.tsx
│           ├── LoginPage.tsx
│           ├── RegisterPage.tsx
│           ├── MyApplicationsPage.tsx
│           └── admin/
│               ├── AdminDashboard.tsx
│               ├── AdminColleges.tsx
│               ├── AdminCourses.tsx
│               ├── AdminApplications.tsx
│               └── AdminInquiries.tsx
├── docker-compose.yml
├── .env.example
└── .github/workflows/ci.yml
```

---

## ENVIRONMENT VARIABLES

```env
# Django
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://varun:password@localhost:5432/varun_aditya

# JWT (SimpleJWT)
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7

# WhatsApp
WHATSAPP_NUMBER=+91XXXXXXXXXX
WHATSAPP_DEFAULT_MESSAGE=Hi, I need help with admissions

# Frontend
VITE_API_URL=http://localhost:8000
VITE_WHATSAPP_NUMBER=+91XXXXXXXXXX
```

---

## TOTALS

| Item | Count |
|------|-------|
| Django Apps | 6 |
| Database Models | 8 |
| API Endpoints | 32 |
| Frontend Pages | 20 |
| Reusable Components | 30+ |
| Test Files | 9 |

---

## NEXT STEP

```bash
/execute-prp PRPs/varun-aditya-prp.md
```
