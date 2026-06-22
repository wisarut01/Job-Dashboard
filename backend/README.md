# workroot — Job Board API

Backend REST API for **workroot**, a job board platform where job seekers can browse and apply for positions, and employers can post and manage job listings.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Go 1.25 |
| Framework | Fiber v3 |
| ORM | GORM v1.31 |
| Database | PostgreSQL |
| Auth | JWT (golang-jwt/jwt v5) |
| Password | bcrypt |
| Container | Docker + Docker Compose |

---

## Architecture

Layered monolith with clean separation of concerns:

```
cmd/main.go
└── internal/
    ├── config/       → load environment variables
    ├── middleware/   → JWT auth, role-based access
    ├── models/       → GORM models (database schema)
    ├── handlers/     → HTTP layer (parse request, return response)
    ├── services/     → business logic
    └── repositorys/  → database queries via GORM
```

**Request flow:**
```
Client → Handler → Service → Repository → PostgreSQL
```

---

## Database Schema

```
companies
├── id, name, country, created_at
│
users
├── id, name, email, password (bcrypt), role, company_id → companies.id
│
jobs
├── id, title, description, salary, remote, location, status, company_id → companies.id
│
applications
└── id, user_id → users.id, job_id → jobs.id, status (pending/accepted/rejected)
```

---

## API Endpoints

### Public

```
POST   /register
POST   /login

GET    /jobs
GET    /jobs/:id
GET    /companies
GET    /companies/:id
```

### Protected (JWT required)

```
POST   /logout

GET    /profile
PATCH  /users/:id
DELETE /users/:id

POST   /companies              (employer only)
PATCH  /companies/:id          (employer only)
DELETE /companies/:id          (employer only)

POST   /jobs                   (employer only)
PATCH  /jobs/:id               (employer only)
DELETE /jobs/:id               (employer only)

GET    /applications
GET    /applications/:id
POST   /applications           (jobseeker only)
DELETE /applications/:id
```

---

## Getting Started

### Prerequisites

- Go 1.21+
- Docker & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/your-username/workroot.git
cd workroot/backend
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
APP_PORT=8000

DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
DB_SSLMODE=disable

SECRET_KEY=your-secret-key-change-in-production
```

### 3. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050` (admin@admin.com / admin)

### 4. Run the server

```bash
go mod tidy
go run cmd/main.go
```

Server starts at `http://localhost:8000`

---

## Example Usage

### Register as employer

```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@mail.com","password":"secret123","role":"employer"}'
```

### Login

```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"alice@mail.com","password":"secret123"}'
```

### Create a company (employer only)

```bash
curl -X POST http://localhost:8000/companies \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"TechCorp","country":"Thailand"}'
```

### Browse jobs (public)

```bash
curl http://localhost:8000/jobs
```

---

## Project Structure

```
backend/
├── cmd/
│   └── main.go                 # entry point, DI wiring, routes
├── internal/
│   ├── config/
│   │   └── config.go           # env loader
│   ├── middleware/
│   │   └── auth.go             # JWTVerify, RequireEmployerRole
│   ├── models/
│   │   ├── users.go
│   │   ├── companies.go
│   │   ├── jobs.go
│   │   └── applications.go
│   ├── handlers/
│   │   ├── auth.go
│   │   ├── users.go
│   │   ├── companies.go
│   │   ├── jobs.go
│   │   └── applications.go
│   ├── services/
│   │   ├── auth.go
│   │   ├── users.go
│   │   ├── companies.go
│   │   ├── jobs.go
│   │   └── applications.go
│   └── repositorys/
│       ├── users.go
│       ├── companies.go
│       ├── jobs.go
│       └── applications.go
├── docker-compose.yaml
├── go.mod
├── .env
└── .env.example
```

---

## Auth Flow

JWT is stored in an **httpOnly cookie** (not localStorage) for security.

```
Register → bcrypt hash password → save to DB
Login    → verify password → sign JWT → set httpOnly cookie
Request  → middleware reads cookie → validates JWT → injects user id + role into ctx.Locals
Logout   → expire the cookie
```

---

## Role-Based Access

Two roles available:

| Role | Can do |
|---|---|
| `jobseeker` | browse jobs, apply to jobs, manage own profile |
| `employer` | create/manage company, post/manage jobs |

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `APP_PORT` | Server port | `8000` |
| `DB_HOST` | PostgreSQL host | — |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | — |
| `DB_PASSWORD` | PostgreSQL password | — |
| `DB_NAME` | Database name | — |
| `DB_SSLMODE` | SSL mode | `disable` |
| `SECRET_KEY` | JWT signing secret | — |

---

## Development Notes

- Table migration runs automatically on startup via `AutoMigrate`
- Migration order matters: `companies → users → jobs → applications` (FK dependency)
- CORS is configured for `http://localhost:5173` (React dev server)