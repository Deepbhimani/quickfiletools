# QuickFileTools — Full-Stack SaaS

## Folder Structure

```
quickfiletools/
│
├── frontend/                          # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── ProtectedRoute.jsx   # Auth guards (user/premium/admin)
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx           # Sticky nav, dark mode, auth state
│   │   │   │   └── Footer.jsx
│   │   │   └── tools/
│   │   │       └── UploadBox.jsx        # Drag-drop, preview, progress bar
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Tools.jsx
│   │   │   ├── SingleTool.jsx           # Dynamic tool page by slug
│   │   │   ├── Pricing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Privacy.jsx
│   │   │   ├── Terms.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Firebase auth + Firestore profile
│   │   ├── services/
│   │   │   ├── firebase.js              # Firebase app init
│   │   │   └── api.js                   # Axios instance + all API modules
│   │   ├── hooks/                       # useTools, useUpload, usePricing ...
│   │   ├── utils/                       # formatBytes, slugify, seo helpers
│   │   ├── assets/
│   │   └── App.jsx                      # Router + providers
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                            # Node.js + Express
│   ├── config/
│   │   └── db.js                        # Mongoose connection
│   ├── controllers/                     # (one per route file, kept lean)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tools.js                     # File upload + processing
│   │   ├── payments.js                  # Razorpay order/verify/webhook
│   │   ├── blog.js
│   │   ├── analytics.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js                      # Firebase Admin token verify + roles
│   │   ├── rateLimiter.js               # Global / auth / upload limiters
│   │   └── errorHandler.js             # Centralised error formatting
│   ├── models/
│   │   ├── User.js                      # uid, role, plan, usage tracking
│   │   ├── Payment.js                   # Payment + Subscription schemas
│   │   └── ToolUsage.js                 # ToolUsage + Blog schemas
│   ├── services/
│   │   ├── fileProcessor.js             # sharp, pdf-lib orchestration
│   │   ├── cloudStorage.js              # Cloudinary upload/delete/purge
│   │   ├── paymentService.js            # Razorpay helpers
│   │   └── emailService.js             # Nodemailer templates
│   ├── utils/
│   └── server.js                        # Express app, Sentry, all routes
│
└── .env.example                         # All env vars documented
```

## Quick Start

### Backend
```bash
cd backend
cp ../.env.example .env   # fill in your values
npm install
npm run dev               # http://localhost:5000
```

### Frontend
```bash
cd frontend
cp ../.env.example .env   # fill VITE_ vars
npm install
npm run dev               # http://localhost:5173
```

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Firebase Auth on frontend, Admin SDK on backend | Token verification without storing passwords |
| Multer → tmp disk → Cloudinary | Never keep files on the server permanently |
| Cloudinary auto-purge cron | GDPR-friendly, keeps storage costs low |
| Razorpay webhook + server verification | Never trust client-side payment success |
| Daily usage reset via schema method | Simple, no extra cron needed |
| Role stored in Firestore, verified server-side | Custom claims can lag; DB check is authoritative |

## Deployment

- **Frontend** → Vercel (auto-detects Vite)
- **Backend** → Render (set `NODE_ENV=production`, add all env vars)
- **Database** → MongoDB Atlas (whitelist Render's IPs)
- **Files** → Cloudinary (free tier: 25 GB)
