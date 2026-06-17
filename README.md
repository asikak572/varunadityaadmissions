# Varun Aditya Admissions Consultancy

> Online admissions platform — students browse colleges, explore courses, apply for admissions, and discover scholarships.

---

## Tech Stack

- **Backend:** Django 4.2 + Django REST Framework + Python 3.11+
- **Frontend:** React 18 + TypeScript + Vite
- **Database:** PostgreSQL (SQLite for local dev)
- **Auth:** JWT via SimpleJWT (Bearer tokens)
- **UI:** Tailwind CSS + Framer Motion + Lucide Icons
- **API Client:** Axios + TanStack React Query

---

## Project Structure

```
consu/
├── backend/
│   ├── manage.py
│   ├── config/             # Django settings, URLs, WSGI/ASGI
│   ├── apps/
│   │   ├── users/          # Auth + user profiles
│   │   ├── colleges/       # College listings
│   │   ├── courses/        # Course explorer
│   │   ├── applications/   # Admission applications
│   │   ├── scholarships/   # Scholarship listings
│   │   └── contact/        # Inquiries + WhatsApp
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, Footer, Cards, etc.
│   │   ├── pages/          # Home, Colleges, Courses, Apply
│   │   ├── hooks/
│   │   ├── services/       # API calls (Axios)
│   │   ├── context/        # AuthContext
│   │   └── types/          # TypeScript interfaces
│   └── package.json
└── CLAUDE.md
```

---

## Run Locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend runs at `http://localhost:8000`, frontend at `http://localhost:5173`.

---

## Environment Variables

Create `backend/.env`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://user:password@localhost:5432/varun_aditya
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7
WHATSAPP_NUMBER=+91XXXXXXXXXX
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## API

- All endpoints prefixed with `/api/`
- Auth: `Authorization: Bearer <access_token>`
- Roles: `student` (browse + apply) and `admin` (full CRUD)

---

## Features

- College listings with search and filters
- Course explorer
- Online admission applications
- Scholarship discovery
- WhatsApp integration (floating button)
- JWT authentication (access + refresh tokens)
- Admin dashboard

---

## Docker

```bash
docker-compose up -d
```
