# UNIVERSITY-WEB

A standard full-stack university website with:

- Multi-page frontend for admissions, departments, research, student life, and contact.
- Node.js backend API for university data and contact submissions.
- Input validation and secure defaults.
- A **Security Training Mode** page that teaches vulnerability patterns safely (non-exploitable demonstrations and remediation guidance).

## Quick start

```bash
npm run dev
```

Open: `http://localhost:3000`

## API endpoints

- `GET /api/v1/health`
- `GET /api/v1/overview`
- `GET /api/v1/departments`
- `GET /api/v1/departments/:departmentId`
- `GET /api/v1/announcements`
- `GET /api/v1/faculty`
- `POST /api/v1/contact`
- `GET /api/v1/admin/contact-submissions`

## Test

```bash
npm test
```
