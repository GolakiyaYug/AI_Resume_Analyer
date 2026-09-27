# ResumeCraft: Complete Project Technical Summary

---

## 1. Executive Summary & Overview

**ResumeCraft** is a full-stack, AI-powered Resume Analyzer and Interactive Resume Builder web application built as a B.Tech Computer Science Engineering capstone project.

The application allows users to:
1. **Upload existing resumes** in PDF, DOCX, or TXT formats (up to 10 MB) to receive instantaneous, explainable ATS (Applicant Tracking System) scores out of 100.
2. **Obtain automated structural feedback**, section compliance reports, contact details detection, quantified metrics checks, action-word usage analysis, and word count evaluation.
3. **Receive AI-driven job role predictions** utilizing TF-IDF N-gram term vectorization and Scikit-Learn Cosine Similarity matching against 10 target technical and business role profiles.
4. **Compare resume content against target Job Descriptions (JDs)** to extract missing keywords and receive dynamic keyword-matching breakdown scores.
5. **Build and customize resumes interactively** with live template selection, dynamic section reordering, client-side preview, and instant PDF download using `html2pdf.js`.
6. **Leverage Career Utilities** including a Market Salary Negotiator calculator (factoring in location, experience bracket, and high-value tech skill premiums) and an automated LinkedIn Profile & Headline Optimizer.

The system is designed to run efficiently on standard local machine resources or host environments without relying on paid external proprietary LLM APIs, providing reliable, deterministic, explainable, and fast performance.

---

## 2. Technology Stack & System Requirements

### Frontend Stack
* **Core Framework:** React 18
* **Build Tool & Dev Server:** Vite
* **Routing:** React Router DOM v6
* **Styling:** Tailwind CSS (utility-first UI design)
* **HTTP Client:** Axios with JWT Interceptor integration
* **PDF Client Generator:** `html2pdf.js` (DOM canvas rendering to PDF binary)
* **Icons & Components:** Lucide React / Heroicons

### Backend Stack
* **Language:** Python 3.10+
* **Web Framework:** Flask 3.0+
* **Database ORM:** Flask-SQLAlchemy 3.1+
* **Database Engine:** SQLite (`resume_app.db`)
* **Security & Auth:** Flask-JWT-Extended (Token authentication) & Flask-Bcrypt (Password hashing)
* **CORS Management:** Flask-CORS

### Data Science & Natural Language Processing Stack
* **Document Parsers:**
  * `PyMuPDF` (`fitz`): Primary PDF extraction engine preserving spatial reading order.
  * `pdfplumber`: Secondary fallback parser for complex PDF tables.
  * `pypdf`: Final fallback text extractor for legacy PDFs.
  * `python-docx`: Microsoft Word (.docx) document parser.
* **Vectorization & ML Engine:** `scikit-learn` (`TfidfVectorizer`, `cosine_similarity`)
* **Email & Security:** Native Python `smtplib` and `email.mime` modules for TLS/STARTTLS OTP delivery.

---

## 3. Directory Structure & System Architecture

```text
AI_Resume_Analyzer-main/
├── backend/
│   ├── .env                    # Secret keys, database URI, CORS origins, SMTP credentials
│   ├── analysis_routes.py      # Multi-format parsing, ATS heuristics, TF-IDF role predictor, Salary & LinkedIn logic
│   ├── app.py                 # Core Flask application, Blueprint registration, single-origin static serving
│   ├── auth/
│   │   ├── __init__.py
│   │   └── auth_routes.py      # Signup, login, password reset OTP, profile management routes
│   ├── create_resume/
│   │   ├── __init__.py
│   │   └── resume_routes.py    # Saved resume CRUD routes (Create, Read, Update, Delete)
│   ├── email_service.py        # SMTP email dispatcher for OTP verification codes
│   ├── extensions.py          # Centralized SQLAlchemy, JWTManager, and Bcrypt instances
│   ├── models.py              # User, Resume, and Analysis database models
│   ├── requirements.txt       # Python backend dependencies
│   └── resume_app.db          # SQLite relational database storage
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # React routing setup and global provider context
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global user authentication state manager
│   │   ├── features/
│   │   │   ├── analysis/       # Resume upload, ATS score progress ring, feedback view
│   │   │   ├── auth/           # Forgot password, OTP reset screen
│   │   │   ├── career-tools/   # Salary Negotiator & LinkedIn Optimizer hub UI
│   │   │   ├── create-resume/  # Interactive builder, template designs, section ordering
│   │   │   ├── login/          # User authentication login view
│   │   │   ├── profile/        # User settings and profile view
│   │   │   ├── resume/         # Saved resumes grid, management dashboard
│   │   │   └── signup/         # User registration view
│   │   ├── shared/             # Reusable Navbar, ProtectedRoute wrappers, layout components
│   │   └── index.css           # Global Tailwind CSS definitions
│   ├── package.json            # Node.js frontend dependencies and build scripts
│   └── vite.config.js          # Vite build options and proxy API setup
└── summary/
    └── PROJECT_SUMMARY.md      # Comprehensive technical documentation
```

### Architectural Process Flow:

```text
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|                       Web Browser (React 18 + Vite SPA)                           |
|   +-------------------+  +-------------------+  +-----------------------------+   |
|   |  Auth & Profile   |  |  Resume Builder   |  |  ATS Analyzer & Career Hub  |   |
|   |   (Context API)   |  |  (Live Preview)   |  |     (Axios Client Engine)   |   |
|   +---------+---------+  +---------+---------+  +--------------+--------------+   |
+-------------|----------------------|---------------------------|------------------+
              |                      | (HTTP/JSON Data)          | (Multipart Upload)
              v                      v                           v
+-----------------------------------------------------------------------------------+
|                                BACKEND API LAYER                                  |
|                      Flask Web Server (WSGI Application)                          |
|  +---------------------+  +-------------------------+  +-----------------------+  |
|  | auth_routes Blueprint|  | resume_routes Blueprint |  |analysis_routes Blueprint| |
|  +----------+----------+  +------------+------------+  +-----------+-----------+  |
+-------------|--------------------------|---------------------------|--------------+
              |                          |                           |
              v                          v                           v
+-----------------------------------------------------------------------------------+
|                            SERVICE & INFERENCE LAYER                              |
|  +---------------------+  +-------------------------+  +-----------------------+  |
|  | JWT & Bcrypt Auth   |  | Multi-Format Parser     |  | Scikit-Learn TF-IDF   |  |
|  |  Security Services  |  | (PyMuPDF/pdfplumber)    |  | Cosine Similarity Engine| |
|  +----------+----------+  +------------+------------+  +-----------+-----------+  |
+-------------|--------------------------|---------------------------|--------------+
              |                          |                           |
              v                          v                           v
+-----------------------------------------------------------------------------------+
|                            DATA PERSISTENCE LAYER                                 |
|                     SQLite Database (via Flask-SQLAlchemy)                        |
|        +---------------+     +-----------------+     +------------------+         |
|        |  users Table  |     |  resumes Table  |     |  analyses Table  |         |
|        +---------------+     +-----------------+     +------------------+         |
+-----------------------------------------------------------------------------------+
```

---

## 4. Deep Dive: Core Project Modules

### Module 1: User Authentication & Security Management Module
* **Features:** Account registration, JWT issue and verification, Bcrypt password hashing (salted 12-round standard), protected frontend routes (`ProtectedRoute.jsx`), and timed OTP password recovery.
* **OTP Reset Pipeline:** Generates a 6-digit numeric OTP, computes SHA-256 hash before saving to DB (`reset_code_hash`), sets a 15-minute expiration time (`reset_expires_at`), limits incorrect guesses to 5 attempts (`reset_attempts`), and dispatches email notifications using TLS/STARTTLS via `smtplib`.

### Module 2: Multi-Format Document Parsing & Extraction Engine
* **Supported Formats:** PDF, DOCX, TXT (up to 10 MB).
* **Multi-Tier Parsing Fallback Strategy:**
  1. **PyMuPDF (`fitz`):** Operates as primary PDF parser using `page.get_text("text", sort=True)` to respect multi-column spatial reading orders.
  2. **pdfplumber:** Invoked if PyMuPDF produces empty text streams.
  3. **pypdf:** Final fallback mechanism for legacy PDF structures.
  4. **python-docx:** Paragraph iterator extracting full document text from Word files.
* **Header & Name Noise Blacklist:** Includes `_extract_candidate_name_words()` to detect user name candidate strings in the top 6 header lines and add them to a blacklist (`STOPWORDS_AND_NAMES`) to prevent false-positive skill detections.

### Module 3: Rule-Based ATS Scoring & Compliance Evaluator
Evaluates resume quality across six weighted criteria (totaling 100 points):
1. **Contact Details Check (15 pts):** Regex detection of valid email and phone number patterns.
2. **Clear Section Headings (15 pts):** Regex pattern matching for standard sections (`Summary`, `Experience`, `Education`, `Skills`, `Projects`, `Certifications`).
3. **Relevant Skills Count (20 pts):** Requires detection of at least 3 recognizable technical/domain skills.
4. **Quantified Achievements (15 pts):** Regex detection of numerical figures, percentages, dollar signs, or metrics (e.g., `30%`, `$50k`, `100+`).
5. **Action-Oriented Writing (15 pts):** Verification of key action verbs (`built`, `designed`, `developed`, `optimized`, `led`, `automated`, etc.).
6. **Readable Length (20 pts):** Validates word count between 250 and 900 words.

### Module 4: TF-IDF Skill Matching & Job Role Predictor Engine
* **Algorithm:** Content-based similarity calculation using `scikit-learn`.
* **Vectorization:** `TfidfVectorizer(stop_words="english", ngram_range=(1, 2))` vectorizes the uploaded resume text against 10 predefined industry role profiles (`AI/ML Engineer`, `Data Analyst`, `Data Scientist`, `Financial Analyst`, `Mechanical Engineer`, `Software Engineer`, `Frontend Developer`, `Backend Developer`, `Full Stack Developer`, `DevOps / Cloud Engineer`).
* **Cosine Similarity Computation:** Measures vector direction similarity `cosine_similarity(vectors[0:1], vectors[1:])` to yield percentage match scores and explainable rationale based on detected skills.

### Module 5: Interactive Resume Builder & Multi-Template Export Module
* **Frontend Builder:** Multi-tab reactive interface supporting custom data entry (Contact, Summary, Experience, Education, Projects, Skills).
* **Template Engine:** Modular templates (`Modern`, `Classic`, `Minimal`, `Executive`, `Tech`) styled using clean CSS/Tailwind layouts.
* **Client-Side Export:** Renders the active DOM element to a high-resolution PDF canvas using `html2pdf.js`, avoiding server-side PDF generation overhead.

### Module 6: Career Tools & Persistence Management Hub
* **Market Salary Negotiator:** Dynamic compensation estimator using role baselines, experience multipliers (Fresher to 8+ years), currency/location indices (US, India INR, UK GBP, Europe EUR), and skill premiums (+4% per high-demand skill). Generates customized verbal and email negotiation scripts.
* **LinkedIn Hub:** Profile optimizer generating tailored Headlines, tone-specific "About" summaries (Executive, Enthusiastic, Technical), and skill-based hashtags.
* **Persistence Dashboard:** Interface for listing, editing, loading, and deleting saved resume drafts and previous analysis reports.

---

## 5. Database Schema

The SQLite database (`resume_app.db`) uses three primary relational tables managed via Flask-SQLAlchemy:

### 1. `users` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY | Unique user ID |
| `name` | VARCHAR(100) | NOT NULL | User's full name |
| `username` | VARCHAR(80) | UNIQUE, NOT NULL, INDEX | Login username |
| `email` | VARCHAR(120) | UNIQUE, NOT NULL, INDEX | User email address |
| `password` | VARCHAR(200) | NOT NULL | Bcrypt hashed password |
| `role` | VARCHAR(20) | DEFAULT 'user' | Access control role |
| `email_verified` | BOOLEAN | DEFAULT False | Email verification status |
| `reset_code_hash` | VARCHAR(64) | NULLABLE | SHA-256 hash of password reset OTP |
| `reset_expires_at` | DATETIME | NULLABLE | OTP expiration timestamp |
| `reset_attempts` | INTEGER | DEFAULT 0 | Failed OTP attempt counter |
| `created_at` | DATETIME | DEFAULT UTC NOW | Registration timestamp |

### 2. `resumes` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY | Unique resume draft ID |
| `user_id` | INTEGER | FOREIGN KEY (`users.id`) | Foreign key linking owner |
| `title` | VARCHAR(100) | NOT NULL | User-assigned resume title |
| `template_id` | VARCHAR(50) | NOT NULL | Selected template theme key |
| `content` | TEXT | NOT NULL | Serialized JSON representation of sections |
| `created_at` | DATETIME | DEFAULT UTC NOW | Creation timestamp |
| `updated_at` | DATETIME | ON UPDATE UTC NOW | Last update timestamp |

### 3. `analyses` Table
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY | Unique analysis record ID |
| `user_id` | INTEGER | FOREIGN KEY (`users.id`) | Foreign key linking owner |
| `filename` | VARCHAR(200) | NULLABLE | Original uploaded file name |
| `overall_score` | INTEGER | NULLABLE | Calculated overall score (0-100) |
| `ats_score` | INTEGER | NULLABLE | ATS compliance score (0-100) |
| `report_data` | TEXT | NULLABLE | Serialized JSON containing complete feedback |
| `created_at` | DATETIME | DEFAULT UTC NOW | Analysis timestamp |

---

## 6. Complete API Endpoint Reference

| HTTP Method | Route Endpoint | Authentication Required | Payload / Parameters | Purpose |
| :--- | :--- | :---: | :--- | :--- |
| **GET** | `/` | No | None | Serves compiled SPA or health check |
| **GET** | `/api/health` | No | None | System status and API version check |
| **POST** | `/api/auth/signup` | No | JSON: `name`, `username`, `email`, `password` | User registration & JWT generation |
| **POST** | `/api/auth/login` | No | JSON: `username` or `email`, `password` | Authenticates user & returns JWT |
| **POST** | `/api/auth/forgot-password` | No | JSON: `email` | Dispatches 6-digit OTP via SMTP |
| **POST** | `/api/auth/reset-password` | No | JSON: `email`, `code`, `new_password` | Validates OTP & updates password |
| **GET** | `/api/auth/me` | Yes (JWT) | Header: `Authorization: Bearer <token>` | Fetches authenticated user profile |
| **POST** | `/api/resume/` | Yes (JWT) | JSON: `title`, `template_id`, `content` | Saves new resume draft |
| **GET** | `/api/resume/` | Yes (JWT) | Header: `Authorization: Bearer <token>` | Lists all user's saved resumes |
| **GET** | `/api/resume/<id>` | Yes (JWT) | Route param: `id` | Fetches single saved resume |
| **PUT** | `/api/resume/<id>` | Yes (JWT) | JSON: `title`, `template_id`, `content` | Updates existing saved resume |
| **DELETE**| `/api/resume/<id>` | Yes (JWT) | Route param: `id` | Deletes specified saved resume |
| **POST** | `/api/analysis/analyze` | Yes (JWT) | Form-data: `file` or `resume_text`, `job_description` | Executes complete ATS parsing & scoring |
| **POST** | `/api/analysis/salary-negotiator` | Optional | Form-data: `job_role`, `location`, `experience_years`, `file` | Computes market salary metrics & scripts |

---

## 7. How to Setup, Run & Validate

### Prerequisites
* Python 3.10+
* Node.js 18+ & npm
* Git

### Step 1: Backend Setup
```powershell
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install required dependencies
pip install -r requirements.txt

# Create .env configuration file
# Ensure secret keys, database URL, and optional SMTP settings are configured
```

### Step 2: Frontend Setup
```powershell
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node modules
npm install
```

### Step 3: Running the Application

#### Production / Single-Origin Mode (Recommended)
```powershell
# 1. Build React production static dist folder
cd frontend
npm run build

# 2. Start Flask Web Server
cd ..\backend
python app.py
```
Open **`http://127.0.0.1:5000`** in web browser. Flask serves both frontend static assets and backend API endpoints from single origin.

#### Frontend Development Mode (Hot Reload)
```powershell
# Terminal 1: Run Flask Backend API (Port 5000)
cd backend
python app.py

# Terminal 2: Run Vite Dev Server (Port 5173)
cd frontend
npm run dev
```
Open **`http://localhost:5173`**. Vite automatically proxies `/api` requests to Flask on port 5000.

### Step 4: Verification & Linting Commands
```powershell
# Frontend linting & build verification
cd frontend
npm run lint
npm run build

# Backend syntax compilation check
cd ..\backend
python -m py_compile app.py analysis_routes.py models.py
```

---

## 8. Summary of Outcomes & Key Strengths

1. **High Performance & Zero External API Cost:** Runs entirely locally using Python ML libraries (`scikit-learn`, `PyMuPDF`) without relying on expensive, slow external LLM APIs.
2. **Robust Multi-Column PDF Parsing:** Solved line-scrambling issues in standard PDF extractors by leveraging PyMuPDF spatial reading order algorithms.
3. **Context-Aware Privacy Filtering:** Prevents candidate names and location details from leaking into detected technical skill sets.
4. **Complete End-to-End Functionality:** Provides account security, instant resume diagnostic reports, customizable builder templates, and market career calculators.
