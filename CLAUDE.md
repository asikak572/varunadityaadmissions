# CLAUDE.md - Varun Aditya Admissions Consultancy

> Rules Claude follows in every conversation for this project.

---

## Project Overview

**Project Name:** Varun Aditya Admissions Consultancy
**Description:** Online admissions platform — students browse colleges, explore courses, apply for admissions, and discover scholarships.
**Tech Stack:**
- Backend: Django 4.2+ + Python 3.11+ + Django REST Framework
- Frontend: React + TypeScript + Vite
- Database: PostgreSQL + Django ORM
- Auth: Email/Password via SimpleJWT
- UI: Tailwind CSS + shadcn/ui

---

## Project Structure

```
consu/
├── backend/
│   ├── manage.py
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps/
│   │   ├── users/         (auth + profile)
│   │   ├── colleges/      (college listings)
│   │   ├── courses/       (course explorer)
│   │   ├── applications/  (admission applications)
│   │   ├── scholarships/  (scholarship listings)
│   │   └── contact/       (inquiries + WhatsApp)
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/    (Navbar, Footer, Cards, etc.)
│       ├── pages/         (Home, Colleges, Courses, Apply, Admin)
│       ├── hooks/
│       ├── services/      (API calls)
│       ├── context/       (AuthContext)
│       └── types/         (TypeScript interfaces)
├── skills/
├── agents/
├── .claude/commands/
├── INITIAL.md
└── CLAUDE.md
```

---

## Code Standards

### Python (Backend)
```python
# Type hints required on all functions
def get_college(college_id: int) -> College:
    pass

# Use DRF serializers for validation
class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = '__all__'

# Class-based views preferred
class CollegeViewSet(viewsets.ModelViewSet):
    queryset = College.objects.filter(is_active=True)
    serializer_class = CollegeSerializer
```

### TypeScript (Frontend)
```typescript
// Interfaces required — NO any types
interface College {
  id: number;
  name: string;
  location: string;
  rating: number;
}

// Always type API responses
const fetchColleges = async (): Promise<College[]> => { ... };

// Use React Query or SWR for data fetching
const { data, isLoading } = useQuery('colleges', fetchColleges);
```

---

## Forbidden

- `print()` → use Python `logging`
- Plain passwords → use Django's `make_password` / `check_password`
- Hardcoded secrets → use `.env` + `python-decouple`
- `any` type in TypeScript
- `console.log` in production
- Inline styles → use Tailwind classes

---

## API Conventions

- All endpoints prefixed: `/api/`
- Use DRF ViewSets + Routers
- Admin-only endpoints protected with `IsAdminUser` permission
- Student endpoints protected with `IsAuthenticated`
- Return standard response format:
```json
{ "data": {}, "message": "Success", "status": 200 }
```

---

## Authentication

### SimpleJWT Configuration
- Access token expires: 60 minutes
- Refresh token expires: 7 days
- Include token in header: `Authorization: Bearer <token>`

### Roles
- `student` — can browse, apply, view own applications
- `admin` — full CRUD on all content + view all applications

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/varun_aditya

# Django
SECRET_KEY=your-secret-key-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# JWT
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7

# WhatsApp
WHATSAPP_NUMBER=+91XXXXXXXXXX

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## WhatsApp Integration

- Floating WhatsApp button on all pages (bottom-right)
- URL format: `https://wa.me/91XXXXXXXXXX?text=Hi, I need help with admissions`
- "Chat on WhatsApp" in navbar links to same URL

---

## Workflow

```
1. Edit INITIAL.md (done ✅)
2. /generate-prp INITIAL.md
3. /execute-prp PRPs/varun-aditya-prp.md
```

---

## Skills Reference

| Task          | Skill File            |
|---------------|-----------------------|
| API + Auth    | skills/BACKEND.md     |
| React + UI    | skills/FRONTEND.md    |
| Models        | skills/DATABASE.md    |
| Tests         | skills/TESTING.md     |
| Docker        | skills/DEPLOYMENT.md  |

---

## Agents

| Agent            | Role                              |
|------------------|-----------------------------------|
| DATABASE-AGENT   | Django models + migrations        |
| BACKEND-AGENT    | DRF API endpoints + auth          |
| FRONTEND-AGENT   | React pages + Tailwind UI         |
| DEVOPS-AGENT     | Docker + CI/CD                    |

---

## Validation Commands

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
npm run lint
npm run type-check

# Docker
docker-compose up -d
```
