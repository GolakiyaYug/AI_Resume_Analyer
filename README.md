# ResumeCraft: AI Resume Analyzer and Builder

ResumeCraft is my final-year B.Tech Computer Science Engineering project for
creating, saving, and checking resumes. The project combines a React frontend
with a Flask backend. A user can build a resume from reusable templates or
upload an existing PDF, DOCX, or TXT resume and receive an ATS-style score,
plain-language feedback, and suitable job-role predictions.

The analyzer is intentionally practical instead of pretending to be a
large language model. It uses document parsing, a small set of ATS checks, and
scikit-learn TF-IDF cosine similarity against role skill profiles. This makes
the project explainable, affordable to run locally, and suitable for a student
project demonstration.

## Main features

- Upload-only resume analysis for PDF, DOCX, and TXT files (10 MB limit).
- ATS score based on contact details, sections, skills, achievements, action
  verbs, and readable length.
- Six-point resume overview with detected sections and skills.
- Four to five improvement suggestions based on failed ATS checks.
- Up to five predicted job roles with a skill-match score and explanation.
- PDF text extraction with a `pypdf` fallback for files that need it.
- JWT login and signup with bcrypt password hashing.
- Forgot-password reset codes delivered by SMTP with expiry and attempt limits.
- Save, open, update, and delete resume drafts.
- Resume builder with live preview, reorderable sections, templates, and PDF
  export.
- One-origin production-style mode where Flask serves both the API and the
  built React application.

## Technology used

**Frontend**

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- `html2pdf.js`

**Backend**

- Python 3.10+
- Flask and Flask-SQLAlchemy
- SQLite by default
- Flask-JWT-Extended and Flask-Bcrypt
- `pdfplumber`, `pypdf`, and `python-docx`
- scikit-learn TF-IDF and cosine similarity

## Project layout

```text
AI_Resume_Analyer/
├── backend/
│   ├── analysis_routes.py       # Upload parsing, ATS checks, role prediction
│   ├── app.py                  # Flask app and single-origin serving
│   ├── auth/                   # Signup, login, and current-user routes
│   ├── create_resume/          # Resume CRUD routes
│   ├── extensions.py           # Database, JWT, and bcrypt instances
│   ├── models.py               # User, Resume, and Analysis models
│   └── requirements.txt
├── frontend/
│   ├── src/features/analysis/  # Upload and analysis result screen
│   ├── src/features/create-resume/
│   │   └── components/templates/ # Resume templates
│   ├── src/features/login/
│   ├── src/features/signup/
│   ├── src/features/resume/
│   ├── src/shared/
│   └── package.json
├── .gitignore
├── LICENSE
└── README.md
```

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer
- npm
- Git

## Local setup

### 1. Install backend dependencies

From the repository root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Copy `backend/.env.example` to `backend/.env` if you want to change the
database URL, JWT secret, port, CORS origins, or SMTP settings.

Forgot-password email delivery requires configuring `SMTP_HOST`,
`SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM`, and
`SMTP_USE_TLS` before testing forgot-password. For Gmail, use an App Password rather
than your normal account password. SMTP credentials are read only from
`backend/.env` and are never stored in the database.

### 2. Install frontend dependencies

Open a second terminal:

```powershell
cd frontend
npm install
```

### 3. Run the project with one localhost URL

Build the React app first:

```powershell
cd frontend
npm run build
```

Then start Flask:

```powershell
cd backend
python app.py
```

Open **http://127.0.0.1:5000** in Chrome. Flask serves the compiled frontend,
SPA routes, static assets, and `/api/*` routes from the same origin.

For frontend-only development with Vite hot reload, run `npm run dev` from
`frontend/`. Vite proxies `/api` requests to Flask on port 5000.

## Using the analyzer

1. Create an account or sign in.
2. Open **Analyze** from the navbar.
3. Choose one PDF, DOCX, or TXT resume file.
4. Click **Analyze Resume**.
5. Review the ATS score, overview points, checks, improvement suggestions,
   detected skills, and predicted roles.

The analyzer accepts selectable text from a PDF. An image-only/scanned PDF can
still be uploaded, but its score will be limited until OCR text is available.

## API summary

| Method | Endpoint | Login | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Check that the backend is running |
| POST | `/api/auth/signup` | No | Create an active account and return a JWT |
| POST | `/api/auth/login` | No | Get a JWT token |
| POST | `/api/auth/forgot-password` | No | Send a password reset code |
| POST | `/api/auth/reset-password` | No | Set a new password with a valid code |
| GET | `/api/auth/me` | Yes | Get the current user |
| POST | `/api/resume/` | Yes | Save a resume |
| GET | `/api/resume/` | Yes | List saved resumes |
| GET | `/api/resume/<id>` | Yes | Read one saved resume |
| PUT | `/api/resume/<id>` | Yes | Update a saved resume |
| DELETE | `/api/resume/<id>` | Yes | Delete a saved resume |
| POST | `/api/analysis/analyze` | Yes | Upload and analyze a resume |

The analysis endpoint expects `multipart/form-data` with a `file` field. It
returns the original `overall_score`, `ats_score`, `overview`, `suggestions`,
`checks`, and `predicted_roles` fields plus structured `overview_points`,
`improvement_suggestions`, `job_recommendations`, and `job_preferences`.

## Validation commands

```powershell
cd frontend
npm run build
npm run lint

cd ..\backend
python -m py_compile app.py analysis_routes.py models.py
```

## Limitations

- ATS scoring is an estimate, not a guarantee of a recruiter response.
- Role predictions are limited to the role profiles defined in
  `backend/analysis_routes.py`.
- Scanned PDFs need OCR before their text can be evaluated accurately.
- SQLite is suitable for local demonstration; a hosted deployment should use
  PostgreSQL and a production WSGI server.

## Project status

The project is complete enough for a local demonstration and final-year
project presentation. Future work could add OCR, more role profiles, a job
description comparison screen, and deployment configuration.

## Author

**Krutarth Talaviya**
B.Tech Computer Science Engineering

This project is released under the MIT License.
