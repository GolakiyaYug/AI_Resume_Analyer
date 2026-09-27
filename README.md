# AI-Powered Resume Analyzer & Career Path Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.10%2B-brightgreen.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0%2B-black.svg)](https://flask.palletsprojects.com/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3%2B-orange.svg)](https://scikit-learn.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

An end-to-end, full-stack web application designed for intelligent document parsing, rule-based Applicant Tracking System (ATS) evaluation, TF-IDF machine learning job role prediction, job description keyword matching, interactive resume building, and career growth utilities.

The platform processes candidate resumes in multiple formats (PDF, DOCX, TXT) and delivers explainable, high-speed career diagnostics and salary benchmarks locally without requiring paid external proprietary LLM APIs.

---

## 🚀 Core Features

### 1. 📄 ATS Resume Scoring & Keyword Matching
- **Multi-Format Parsing Engine:** Supports PDF, DOCX, and TXT files (up to 10 MB limit) with multi-tier extraction using PyMuPDF (`fitz`), `pdfplumber`, `pypdf`, and `python-docx`.
- **Explainable ATS Evaluator:** Scores resumes out of 100 across 6 criteria:
  - **Contact Details (15 pts):** Regex verification of valid email and phone number headers.
  - **Section Headings (15 pts):** Detection of standard sections (`Summary`, `Experience`, `Education`, `Skills`, `Projects`, `Certifications`).
  - **Relevant Skills Count (20 pts):** Extraction of technical, engineering, finance, HR, marketing, and business domain skills.
  - **Quantified Achievements (15 pts):** Detection of metrics, percentages, dollar values, and numerical scale indicators.
  - **Action-Oriented Writing (15 pts):** Frequency check of strong action verbs (`built`, `managed`, `optimized`, `automated`, `led`).
  - **Readable Length (20 pts):** Evaluation of word count bounds (250–900 words).
- **Job Description Gap Analysis:** Compares candidate resume text against target job descriptions (JDs) to highlight missing keywords and calculate keyword match percentages.
- **Privacy & Header Filter:** Automatically filters candidate names from header lines to prevent false-positive skill detections.

### 2. 🤖 TF-IDF Machine Learning Job Role Prediction
- **Vectorization Engine:** Vectorizes candidate resume text using `scikit-learn` `TfidfVectorizer` (unigrams and bigrams) and Cosine Similarity against 15+ predefined industry role profiles.
- **Cross-Domain Role Coverage:** Accurately classifies technical and non-technical categories:
  - **Software Engineering & Tech:** `Software Engineer`, `Frontend Developer`, `Backend Developer`, `Full Stack Developer`, `DevOps / Cloud Engineer`, `AI/ML Engineer`, `Data Scientist`, `Data Analyst`.
  - **Core Engineering:** `Mechanical Engineer`.
  - **Finance & Accounting:** `Financial Analyst`.
  - **Human Resources:** `HR Generalist / Manager`, `Talent Acquisition Specialist`.
  - **Business & Management:** `Project Manager`, `Operations Manager`, `Business Analyst`, `Product Manager`.
  - **Marketing & Creative:** `Digital Marketing Specialist`, `Sales & Business Development Executive`, `Content Writer & Copywriter`, `UI/UX & Graphic Designer`, `Customer Success & Support Specialist`.
- **Hybrid Scoring Algorithm:** Blends TF-IDF Cosine Similarity ($70\%$) with explicit skill overlap ratios ($30\%$) to eliminate cross-domain misclassifications.

### 3. 🛠️ Interactive Resume Builder & Multi-Template Export
- **Reactive Live Workspace:** Multi-tab interface for editing personal info, summary, work history, education, projects, and skills with instant visual feedback.
- **Modular Design Templates:** Tailwind CSS templates (`Modern`, `Classic`, `Minimal`, `Executive`, `Tech`).
- **Client-Side PDF Generation:** High-resolution DOM rendering and PDF export via `html2pdf.js`.
- **Draft Persistence:** Full CRUD operations for creating, editing, loading, and deleting resume drafts.

### 4. 📈 Career Utilities Hub
- **Market Salary Negotiator:** Dynamic compensation calculator factoring role baselines, experience brackets (Fresher to 8+ years), location/currency indices (USD, INR, GBP, EUR), and skill premiums. Generates customized verbal and email negotiation scripts.
- **LinkedIn Profile Optimizer:** Generates tone-specific "About" summaries (Executive, Enthusiastic, Technical), punchy headlines, and skill-based hashtags.

### 5. 🔒 Security & User Authentication
- **Account Protection:** Standard JWT token authentication with salted 12-round Bcrypt password hashing.
- **OTP Password Recovery:** 6-digit OTP delivery via Python `smtplib` (TLS/STARTTLS) with SHA-256 hashed DB persistence, 15-minute expiration windows, and failed attempt rate limiting.

---

## 💻 Tech Stack Used

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite 5, React Router DOM v6 |
| **Styling & Components** | Tailwind CSS 3.4, Lucide React, Heroicons |
| **HTTP Client & Export** | Axios with JWT Interceptors, `html2pdf.js` |
| **Backend Web Framework** | Python 3.10+, Flask 3.0+, Flask-CORS |
| **Database & ORM** | SQLite, Flask-SQLAlchemy 3.1+ |
| **Machine Learning & NLP** | Scikit-Learn (`TfidfVectorizer`, `cosine_similarity`), NumPy, Pandas |
| **Document Parsers** | PyMuPDF (`fitz`), `pdfplumber`, `pypdf`, `python-docx` |
| **Authentication & Security** | Flask-JWT-Extended, Flask-Bcrypt, SHA-256 OTP Hashes |

---

## 📁 Project Directory Structure

```text
AI_Resume_Analyzer-main/
├── backend/
│   ├── auth/
│   │   ├── __init__.py
│   │   └── auth_routes.py         # Registration, login, profile, & OTP reset endpoints
│   ├── create_resume/
│   │   ├── __init__.py
│   │   └── resume_routes.py       # Resume draft CRUD endpoints
│   ├── .env                       # Environment variables & secret keys (Git-ignored)
│   ├── .env.example               # Environment variables template
│   ├── analysis_routes.py         # Document parsing, ATS heuristics, TF-IDF predictor, Salary & LinkedIn logic
│   ├── app.py                    # Core Flask app entrypoint & single-origin static server
│   ├── email_service.py           # Native SMTP dispatcher for OTP email delivery
│   ├── extensions.py              # Centralized SQLAlchemy, JWTManager, & Bcrypt instances
│   ├── models.py                  # User, Resume, and Analysis ORM database models
│   ├── requirements.txt          # Python backend dependencies
│   └── resume_app.db              # SQLite database storage (Git-ignored)
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global user authentication state provider
│   │   ├── features/
│   │   │   ├── analysis/          # Resume upload, ATS score progress ring, & feedback view
│   │   │   ├── auth/              # Password recovery & OTP reset modal screens
│   │   │   ├── career/            # Career hub main dashboard
│   │   │   ├── career-tools/      # Market Salary Negotiator & LinkedIn Optimizer UI
│   │   │   ├── create-resume/     # Interactive builder, design templates, & section reorder
│   │   │   ├── editor/            # Live resume visual editor
│   │   │   ├── login/             # User sign-in interface
│   │   │   ├── profile/           # User profile & settings view
│   │   │   ├── resume/            # Dashboard for saved user resume drafts
│   │   │   └── signup/            # User registration screen
│   │   ├── shared/                # Navigation bar, ProtectedRoute wrappers, & UI layout components
│   │   ├── App.jsx                # Core application routes & provider setup
│   │   ├── index.css              # Global styles & Tailwind CSS declarations
│   │   └── main.jsx               # React DOM entrypoint
│   ├── .env.example               # Frontend environment template
│   ├── .eslintrc.cjs              # ESLint code quality settings
│   ├── index.html                 # HTML5 template entrypoint
│   ├── package.json               # Node.js dependencies & npm scripts
│   ├── postcss.config.js          # PostCSS setup for Tailwind CSS
│   ├── tailwind.config.js         # Tailwind theme customization
│   └── vite.config.js             # Vite development server & proxy API setup
├── summary/
│   └── PROJECT_SUMMARY.md         # Detailed technical project documentation
├── .gitignore                     # Git tracking exclusions
├── LICENSE                        # MIT License declaration
└── README.md                      # Project documentation (This file)
```

---

## ⚙️ Environment Variables Configuration

Copy `.env.example` to `.env` inside the `backend/` directory:

```env
# Flask Application Configuration
SECRET_KEY=your_flask_secret_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here
SQLALCHEMY_DATABASE_URI=sqlite:///resume_app.db
SQLALCHEMY_TRACK_MODIFICATIONS=False

# CORS Setup
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5000

# SMTP Configuration (Optional for Password Reset OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=your_email@gmail.com
SMTP_USE_TLS=True
```

---

## 🛠️ Step-by-Step Installation & Setup

### Prerequisites
- **Python:** 3.10 or higher
- **Node.js:** 18.0 or higher
- **npm:** Package manager
- **Git:** Version control system

---

### Step 1: Backend Setup (Flask)

1. Open a terminal and navigate to the `backend` directory:
   ```powershell
   cd backend
   ```

2. Create and activate a virtual environment:
   ```powershell
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```powershell
   pip install -r requirements.txt
   ```

4. Create the local configuration file:
   ```powershell
   copy .env.example .env
   ```

---

### Step 2: Frontend Setup (React / Vite)

1. Open a second terminal window and navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```

2. Install Node modules:
   ```powershell
   npm install
   ```

---

## 🏃 How to Run the Application Locally

### Option A: Single-Origin Mode (Recommended for Production / Demo)
Flask serves both the compiled React SPA frontend static assets and backend API endpoints from a single host:

1. Build the frontend production assets:
   ```powershell
   cd frontend
   npm run build
   ```

2. Start the Flask application server:
   ```powershell
   cd ..\backend
   python app.py
   ```

3. Open your browser and visit:  
   **`http://127.0.0.1:5000`**

---

### Option B: Dual Development Mode (Hot Reloading)

1. **Terminal 1 (Backend API):**
   ```powershell
   cd backend
   python app.py
   ```

2. **Terminal 2 (Frontend Dev Server):**
   ```powershell
   cd frontend
   npm run dev
   ```

3. Open your browser and visit:  
   **`http://localhost:5173`** (Vite automatically proxies `/api/*` calls to Flask on port 5000).

---

## 🧪 Code Quality & Build Verification

Run these validation commands to verify frontend build integrity and backend Python syntax:

```powershell
# Frontend linting and production build test
cd frontend
npm run lint
npm run build

# Backend syntax compilation check
cd ..\backend
python -m py_compile app.py analysis_routes.py models.py email_service.py
```

---

## 📄 License & Acknowledgments

- **License:** Distributed under the [MIT License](LICENSE).
- **Libraries:** Powered by open-source tools including Flask, Scikit-Learn, PyMuPDF, React, Vite, and Tailwind CSS.
