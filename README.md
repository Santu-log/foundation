# Sadhana Foundation - Charity & Community Welfare Platform

A full-stack MERN application built from the PRD: a public NGO website (causes, events,
gallery, donations, volunteering, blogs, testimonials, contact) plus a secure admin
dashboard for managing all content without touching code.

## Tech Stack

- **Frontend:** React 18 (Vite), React Router, Tailwind CSS, Recharts, React Quill, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt (separate sessions for users and admins)
- **Image storage:** Cloudinary
- **Payments:** Razorpay
- **Email:** Nodemailer (SMTP)

## Project Structure

```
sadhana-foundation/
├── backend/
│   ├── config/          # DB + Cloudinary config
│   ├── controllers/      # Route handlers (business logic)
│   ├── middleware/        # Auth guards, error handling
│   ├── models/            # Mongoose schemas (11 collections)
│   ├── routes/            # Express routers (public + /admin sub-routes)
│   ├── utils/              # JWT, email, receipt, seed script
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, Footer, cards, admin Modal, etc.
    │   ├── context/           # AuthContext (user + admin sessions)
    │   ├── layouts/            # PublicLayout, AdminLayout
    │   ├── pages/                # Public pages
    │   ├── pages/admin/            # Admin dashboard pages
    │   └── services/api.js         # Axios client
    └── package.json
```

## Getting Started

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string
- (Optional for full functionality) Cloudinary account, Razorpay test keys, SMTP credentials

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary/Razorpay/SMTP keys
npm install
npm run seed    # creates a default superadmin + sample settings/causes
npm run dev     # starts on http://localhost:5000
```

**Default admin login (from seed script):**
- Email: `admin@sadhanafoundation.org`
- Password: `Admin@12345`

⚠️ Change this password immediately in production.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev     # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so both servers
must be running for the app to work locally.

### 4. Access

- Public site: http://localhost:5173
- Admin login: http://localhost:5173/admin/login

## Key Features Implemented

**Public site**
- Home (hero, causes, events, gallery preview, stats, testimonials)
- About (mission, vision, history, team, founder's message)
- Causes with progress bars
- Events with category filter, registration form, capacity limits
- Gallery with category filter + lightbox
- Volunteer application form
- Donate flow with Razorpay checkout + email receipt + thank-you page
- Blogs with search, categories, tags
- Contact form
- User auth: register, login, email verification, forgot/reset password
- User dashboard: donation history, volunteer status, registered events, profile

**Admin dashboard**
- Overview cards + charts (monthly donations, volunteer growth, event participation)
- Event management (CRUD, publish/close registration, image upload)
- Gallery management (bulk upload, categorize, feature, delete)
- Donation management (filter by status, export CSV/Excel/PDF)
- Volunteer management (approve/reject/suspend, view full profile)
- Cause management (CRUD with progress tracking)
- Blog management (rich text editor, categories, tags, publish/draft)
- Testimonial management (add directly or approve user-submitted ones)
- Contact message management (view, reply via email, delete)
- Homepage CMS (hero, mission/vision, stats, footer, social links — no coding required)

## Notes & Next Steps

- Replace all placeholder keys in `.env` with real Cloudinary/Razorpay/SMTP credentials
  before testing uploads, payments, or emails end-to-end.
- The `registerAdmin` (create additional admins) endpoint is restricted to `superadmin`
  role — use the seeded superadmin to create additional admin accounts via
  `POST /api/admin/auth/create`.
- For production, set `NODE_ENV=production`, serve the built frontend (`npm run build`)
  behind a reverse proxy (e.g., Nginx), and enable HTTPS so secure cookies work correctly.
- Future features from the PRD (multi-language support, SMS notifications, QR-code
  donations/attendance, volunteer certificates, AI chat assistant) are not yet built —
  the architecture (Cloudinary storage, modular routes/controllers) should make them
  straightforward to add incrementally.
