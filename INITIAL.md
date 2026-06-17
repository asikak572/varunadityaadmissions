# INITIAL.md - Varun Aditya Admissions Consultancy

> A platform to help students find and apply to the best colleges across Tamil Nadu, Andhra Pradesh & Karnataka, with expert counselor guidance.

---

## PRODUCT

### Name
Varun Aditya Admissions Consultancy

### Description
An online admissions consultancy platform where students and parents can browse top colleges, explore courses, apply for admissions, and discover scholarships — all guided by expert counselors. The platform also includes a full admin panel to manage colleges, courses, applications and inquiries.

### Target Users
- Students (11th/12th grade) seeking college admissions
- Parents guiding the admissions process
- Admin staff managing applications and content

### Type
- [x] Platform / SaaS

---

## TECH STACK

| Layer      | Choice                                  |
|------------|-----------------------------------------|
| Backend    | Django + Python 3.11+ + Django REST Framework |
| Frontend   | React + TypeScript + Vite               |
| Database   | PostgreSQL                              |
| Auth       | Email/Password (JWT via SimpleJWT)      |
| UI         | Tailwind CSS + shadcn/ui                |
| Payments   | TBD (Razorpay / Stripe — future phase)  |

---

## MODULES

### Module 1: Authentication (Required)

**Description:** User registration, login, and profile management for students and admins.

**Models:**
```
User:
  - id, email, password (hashed)
  - full_name, phone_number
  - role: student | admin
  - is_active, is_verified
  - created_at, updated_at
```

**API Endpoints:**
```
POST /api/auth/register    - Register new student account
POST /api/auth/login       - Login with email/password (returns JWT)
POST /api/auth/logout      - Logout / invalidate token
POST /api/auth/refresh     - Refresh access token
GET  /api/auth/me          - Get current user profile
PUT  /api/auth/me          - Update profile
```

**Frontend Pages:**
```
/login     - Login page
/register  - Student registration
/profile   - User profile (protected)
```

---

### Module 2: Colleges

**Description:** Browse, search and view detailed college profiles.

**Models:**
```
College:
  - id, name, location, city, state
  - description, established_year
  - image_url, website_url
  - rating (decimal), review_count
  - is_featured, is_active
  - created_at, updated_at

CollegeCourse (Many-to-Many):
  - college_id, course_id, fees_per_year, seats
```

**API Endpoints:**
```
GET    /api/colleges/              - List all colleges (with filters: state, city, stream)
GET    /api/colleges/{id}/         - Get college detail
GET    /api/colleges/featured/     - Get featured colleges
POST   /api/colleges/              - Create college (admin only)
PUT    /api/colleges/{id}/         - Update college (admin only)
DELETE /api/colleges/{id}/         - Delete college (admin only)
```

**Frontend Pages:**
```
/colleges            - Browse all colleges (search + filter)
/colleges/:id        - College detail page
```

---

### Module 3: Courses

**Description:** Explore courses by stream with duration, eligibility and career info.

**Models:**
```
Course:
  - id, name, short_name (e.g. B.Tech, MBBS)
  - stream: engineering | medical | management | commerce | arts | law | design | pharmacy | nursing
  - duration_years, eligibility
  - avg_salary_min, avg_salary_max
  - description, is_popular, is_active
  - created_at, updated_at

CareerOpportunity:
  - id, course_id (FK)
  - job_title
```

**API Endpoints:**
```
GET    /api/courses/              - List all courses (filter by stream, duration, level)
GET    /api/courses/{id}/         - Get course detail
GET    /api/courses/popular/      - Get popular courses
GET    /api/courses/streams/      - Get all streams with counts
POST   /api/courses/              - Create course (admin only)
PUT    /api/courses/{id}/         - Update course (admin only)
DELETE /api/courses/{id}/         - Delete course (admin only)
```

**Frontend Pages:**
```
/courses          - Courses explorer (sidebar filter + search)
/courses/:id      - Course detail page
```

---

### Module 4: Applications

**Description:** Students submit and track admission applications online.

**Models:**
```
Application:
  - id, student_id (FK User), college_id (FK), course_id (FK)
  - status: pending | under_review | shortlisted | rejected | admitted
  - applicant_name, email, phone
  - 12th_percentage, stream
  - message (optional)
  - created_at, updated_at
```

**API Endpoints:**
```
POST   /api/applications/              - Submit new application (student)
GET    /api/applications/              - List student's own applications (student)
GET    /api/applications/{id}/         - Get application detail
GET    /api/admin/applications/        - List all applications (admin)
PUT    /api/admin/applications/{id}/   - Update application status (admin)
DELETE /api/admin/applications/{id}/   - Delete application (admin)
```

**Frontend Pages:**
```
/apply             - Application form
/my-applications   - Student's application tracker (protected)
/admin/applications - Admin application management
```

---

### Module 5: Scholarships

**Description:** Browse available scholarships by eligibility and stream.

**Models:**
```
Scholarship:
  - id, name, provider
  - amount, description
  - eligibility_criteria, last_date
  - stream (nullable = all streams)
  - link_url, is_active
  - created_at, updated_at
```

**API Endpoints:**
```
GET    /api/scholarships/         - List scholarships (filter by stream)
GET    /api/scholarships/{id}/    - Get scholarship detail
POST   /api/scholarships/         - Create (admin only)
PUT    /api/scholarships/{id}/    - Update (admin only)
DELETE /api/scholarships/{id}/    - Delete (admin only)
```

**Frontend Pages:**
```
/scholarships        - Browse scholarships
/scholarships/:id    - Scholarship detail
```

---

### Module 6: Contact & WhatsApp Integration

**Description:** Students can send inquiries; WhatsApp CTA on every page.

**Models:**
```
Inquiry:
  - id, name, email, phone
  - subject, message
  - status: new | replied | closed
  - created_at
```

**API Endpoints:**
```
POST  /api/contact/          - Submit inquiry form
GET   /api/admin/inquiries/  - List all inquiries (admin)
PUT   /api/admin/inquiries/{id}/ - Update status (admin)
```

**Frontend Pages:**
```
/contact   - Contact form page
```

**WhatsApp Integration:**
- Floating WhatsApp button on all pages
- "Chat on WhatsApp" CTA in navbar and hero
- Links to: `https://wa.me/[PHONE_NUMBER]`

---

### Module 7: Admin Panel

**Description:** Full admin interface to manage all content and applications.

**Frontend Pages:**
```
/admin                   - Admin dashboard (stats overview)
/admin/colleges          - Manage colleges (add/edit/delete)
/admin/courses           - Manage courses
/admin/applications      - Review and update applications
/admin/scholarships      - Manage scholarships
/admin/inquiries         - View and reply to contact inquiries
/admin/users             - Manage registered students
```

---

### Module 8: Dashboard

**Description:** Homepage and public pages.

**Frontend Pages:**
```
/            - Homepage (hero, stats, top colleges, courses, why choose us)
/about       - About us page
```

---

## MVP SCOPE

### Must Have (Launch)
- [x] Homepage with hero, stats, colleges, courses sections
- [x] Browse colleges with filters (state, stream)
- [x] Browse courses page with sidebar
- [x] Student registration and login
- [x] Online application submission form
- [x] WhatsApp contact integration
- [x] Admin panel — manage colleges, courses, applications

### Nice to Have (Post-Launch)
- [ ] Scholarship module
- [ ] Student application tracking dashboard
- [ ] Email notifications on application
- [ ] AI course recommendation
- [ ] Payments for application processing fee

---

## ACCEPTANCE CRITERIA

### Authentication
- [ ] Student can register with email and password
- [ ] Student can log in and receive JWT token
- [ ] Protected routes redirect to /login
- [ ] Admin role is separate from student role

### Colleges
- [ ] Homepage shows top 5 featured colleges
- [ ] Colleges page shows all colleges with search + filter
- [ ] Admin can add/edit/delete colleges

### Courses
- [ ] Courses page has sidebar filter by stream, duration, level
- [ ] Popular courses shown on homepage
- [ ] Admin can add/edit/delete courses

### Applications
- [ ] Student can submit application with college + course selection
- [ ] Admin can view and update application status
- [ ] Student can view their own applications

### Quality
- [ ] All API endpoints documented in OpenAPI (Django REST Framework)
- [ ] Backend test coverage 70%+
- [ ] Frontend TypeScript strict mode passes
- [ ] Docker builds and runs successfully

---

## RUN

```bash
/generate-prp INITIAL.md
/execute-prp PRPs/varun-aditya-prp.md
```
