import io
import json
import random
import re
import zipfile
import docx
import pdfplumber
from pdfminer.pdfparser import PDFSyntaxError as PdfminerException
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from extensions import db
from models import Analysis

analysis_bp = Blueprint("analysis", __name__)

SECTION_PATTERNS = {
    "summary": r"\b(summary|profile|objective|about me|professional summary|executive summary)\b",
    "experience": r"\b(experience|employment|work history|professional experience|professional background|career history|work experience)\b",
    "education": r"\b(education|academic|academic background|qualifications|academic history|academics)\b",
    "skills": r"\b(skills|technologies|technical skills|core competencies|expertise|proficiencies|tools)\b",
    "projects": r"\b(projects|portfolio|personal projects|academic projects|technical projects|key projects)\b",
    "certifications": r"\b(certifications|certificates|awards|achievements|licenses|credentials)\b",
}
ACTION_WORDS = {
    "built", "created", "designed", "developed", "implemented", "improved",
    "led", "managed", "optimized", "automated", "delivered", "increased",
}
COMMON_SKILLS = {
    # Tech & Software Engineering
    "python", "java", "javascript", "typescript", "react", "vue", "angular", "node", "express", "next.js", "html", "css", "tailwind", "bootstrap",
    "sql", "postgresql", "mysql", "mongodb", "redis", "sqlite",
    "numpy", "pandas", "scikit-learn", "pytorch", "tensorflow", "keras", "deep learning", "machine learning", "nlp", "opencv", "data analysis", "power bi", "tableau", "excel", "statistics",
    "xgboost", "lightgbm", "catboost", "huggingface", "transformers", "llm", "langchain", "rag", "spacy", "nltk", "mlflow", "vector databases", "feature engineering", "hyperparameter tuning",
    "flask", "django", "fastapi", "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "git", "c++", "c#", "go", "rust", "swift", "kotlin",
    "figma", "ui/ux", "ux", "ui", "photoshop", "illustrator", "wireframing", "user research", "design systems",

    # Core Engineering, CAD/CAM/CAE & Hardware
    "solidworks", "ansys", "autocad", "catia", "revit", "matlab", "simulink", "creo", "inventor", "fusion 360", "labview", "plc", "scada", "abaqus",
    "cad", "cam", "fea", "cfd", "finite element analysis", "computational fluid dynamics", "3d modeling", "gd&t", "hvac", "embedded systems",
    "microcontrollers", "arduino", "raspberry pi", "pcb design", "altium", "proteus",

    # Finance, Accounting & Business Tools
    "sap fico", "sap", "quickbooks", "tally", "tally prime", "tally erp 9", "excel", "ms excel", "financial modeling", "auditing", "internal audit", "external audit",
    "taxation", "income tax", "gst", "vat", "accounting", "financial analysis", "risk management", "compliance", "sox compliance", "portfolio management",
    "corporate finance", "valuation", "budgeting", "forecasting", "erp systems", "erp", "bookkeeping", "gaap", "ifrs", "payroll", "financial reporting",
    "cash flow management", "variance analysis", "cost accounting", "treasury", "financial planning", "fp&a", "due diligence", "credit analysis",
    "wealth management", "banking", "accounts payable", "accounts receivable", "bank reconciliation", "financial statements", "balance sheet",

    # Business Management, Operations & Marketing
    "project management", "stakeholder management", "operations", "supply chain", "human resources", "hr", "marketing", "digital marketing", "sales",
    "business strategy", "crm", "salesforce", "hubspot", "seo", "agile", "scrum", "vendor management", "kpi tracking", "communication", "leadership", "problem solving",
}

# Strict Blacklist of Human Names & Resume Structural Stopwords
STOPWORDS_AND_NAMES = {
    # Structural Stopwords
    "resume", "curriculum", "vitae", "summary", "profile", "objective", "experience", "education",
    "projects", "personal", "details", "contact", "email", "phone", "mobile", "address", "linkedin",
    "github", "university", "college", "school", "degree", "bachelor", "master", "phd", "diploma",
    "institute", "department", "location", "city", "state", "country", "pin", "code", "reference",
    "references", "declaration", "date", "place", "signature", "name", "first", "last", "gender",
    "dob", "nationality", "marital", "status", "languages", "known", "hobbies", "interests",
    "curriculum vitae", "work history", "academic background", "professional summary",

    # Pre-populated Common Names Blacklist
    "rohit", "verma", "sharma", "kumar", "singh", "gupta", "patel", "shah", "rao", "reddy", "nair",
    "joshi", "kulkarni", "deshmukh", "mehta", "jain", "agarwal", "bhat", "khan", "ali", "ahmed",
    "john", "smith", "david", "michael", "alex", "james", "robert", "william", "mary", "patricia",
    "jennifer", "linda", "elizabeth", "barbara", "susan", "jessica", "sarah", "karen", "nancy",
    "yash", "rahul", "amit", "priya", "anita", "pooja", "sunil", "anil", "vikram", "sanjay",
    "vijay", "rajesh", "ramesh", "suresh", "deepak", "manish", "alok", "neha", "swati", "rashi"
}

ROLE_SKILLS = {
    "AI/ML Engineer": {
        "python", "pytorch", "tensorflow", "machine learning", "deep learning",
        "nlp", "scikit-learn", "pandas", "numpy", "transformers", "huggingface", "llm"
    },
    "Data Analyst": {
        "python", "sql", "excel", "tableau", "power bi", "data analysis",
        "pandas", "statistics", "mysql", "postgresql"
    },
    "Data Scientist": {
        "python", "sql", "machine learning", "data analysis", "pandas", "numpy",
        "scikit-learn", "statistics", "pytorch", "tensorflow"
    },
    "Financial Analyst": {
        "excel", "financial analysis", "financial modeling", "accounting",
        "budgeting", "forecasting", "valuation", "corporate finance", "financial reporting"
    },
    "Mechanical Engineer": {
        "solidworks", "ansys", "autocad", "catia", "matlab", "cad", "cam",
        "fea", "cfd", "3d modeling", "gd&t"
    },
    "Software Engineer": {
        "python", "java", "c++", "sql", "git", "docker", "c#", "go"
    },
    "Frontend Developer": {
        "javascript", "typescript", "react", "html", "css", "vue", "angular",
        "tailwind", "next.js"
    },
    "Backend Developer": {
        "python", "java", "node", "express", "flask", "django", "fastapi",
        "sql", "postgresql", "mongodb", "redis"
    },
    "Full Stack Developer": {
        "javascript", "typescript", "react", "node", "python", "html", "css",
        "sql", "mongodb", "postgresql", "git"
    },
    "DevOps / Cloud Engineer": {
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "git"
    },
}



def _extract_candidate_name_words(text):
    """Extract candidate name words from top header lines of text to blacklist them from skills."""
    if not text:
        return set()
    lines = [line.strip() for line in text.split("\n") if line.strip()][:6]
    name_words = set()
    for line in lines:
        name_match = re.search(r"(?:name|candidate name)\s*[:\-]\s*([a-zA-Z\s]{2,40})", line, re.IGNORECASE)
        if name_match:
            for w in name_match.group(1).split():
                if len(w) > 1:
                    name_words.add(w.lower())
        else:
            words = re.findall(r"\b[a-zA-Z]{2,20}\b", line)
            if 1 <= len(words) <= 4 and not any(w.lower() in STOPWORDS_AND_NAMES for w in words):
                for w in words:
                    name_words.add(w.lower())
    return name_words


def _extract_skills_from_text(text):
    if not text:
        return []
    lower_text = text.lower()
    found = set()

    # Get blacklisted candidate name words from header
    candidate_name_words = _extract_candidate_name_words(text)
    blacklisted = STOPWORDS_AND_NAMES.union(candidate_name_words)

    # 1. Match against expanded COMMON_SKILLS set
    for skill in COMMON_SKILLS:
        if skill in blacklisted:
            continue
        escaped = re.escape(skill)
        pattern = r"(?:^|[^a-zA-Z0-9#+])" + escaped + r"(?:$|[^a-zA-Z0-9#+])"
        if re.search(pattern, lower_text, re.IGNORECASE):
            found.add(skill)

    # 2. Extract multi-word skills & tools from explicit Resume Sections
    skills_headers_pattern = r"(?:skills|core competencies|expertise|tools|technical skills|engineering tools|financial skills|accounting tools|key skills|proficiencies|software)\s*[:\-\n]+([^\n\r]+(?:\n[^\n\r]+){0,5})"
    matches = re.finditer(skills_headers_pattern, text, re.IGNORECASE)
    for m in matches:
        section_text = m.group(1)
        raw_tokens = re.split(r"[,;|\n•·\t/]", section_text)
        for tok in raw_tokens:
            cleaned = tok.strip()
            cleaned_lower = cleaned.lower()
            if 2 <= len(cleaned) <= 40 and cleaned_lower not in blacklisted:
                tok_words = cleaned_lower.split()
                if not any(w in blacklisted for w in tok_words):
                    if re.search(r"[a-zA-Z0-9]", cleaned):
                        found.add(cleaned_lower)

    return sorted(list(found))


def _extract_file_text(file_storage):
    if not file_storage:
        return ""
    try:
        file_storage.seek(0)
    except Exception:
        pass
    filename = (file_storage.filename or "").lower()
    content = file_storage.read()
    try:
        file_storage.seek(0)
    except Exception:
        pass
    if len(content) > 10 * 1024 * 1024:
        raise ValueError("Resume file must be smaller than 10 MB")
    if filename.endswith(".pdf"):
        # 1. Primary: PyMuPDF (fitz) for superior block-level extraction that respects multi-column reading order
        try:
            import fitz
            doc = fitz.open(stream=content, filetype="pdf")
            text = "\n".join(page.get_text("text", sort=True) for page in doc).strip()
            if text:
                return text
        except Exception:
            pass
            
        # 2. Fallback: pdfplumber
        try:
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                text = "\n".join(page.extract_text() or "" for page in pdf.pages).strip()
            if text:
                return text
        except Exception:
            pass
            
        # 3. Final Fallback: pypdf
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content))
            return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
        except (ImportError, ValueError):
            return ""
    if filename.endswith(".docx"):
        document = docx.Document(io.BytesIO(content))
        return "\n".join(paragraph.text for paragraph in document.paragraphs)
    if filename.endswith((".txt", ".text")):
        return content.decode("utf-8", errors="replace")
    raise ValueError("Supported file types are PDF, DOCX, and TXT")


def _analyze_resume(text, job_description=""):
    normalized = re.sub(r"\s+", " ", text).strip()
    lower = normalized.lower()
    words = re.findall(r"[a-zA-Z][a-zA-Z+#.-]{1,}", lower)
    sections = [name for name, pattern in SECTION_PATTERNS.items() if re.search(pattern, lower)]
    found_skills = _extract_skills_from_text(lower)
    role_predictions = sorted(
        (
            {
                "role": role,
                "match_score": round(len(set(found_skills) & required) / len(required) * 100),
            }
            for role, required in ROLE_SKILLS.items()
            if set(found_skills) & required
        ),
        key=lambda prediction: prediction["match_score"],
        reverse=True,
    )[:3]
    role_predictions = []
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity

        role_names = list(ROLE_SKILLS)
        role_profiles = [
            " ".join([role.lower(), *skills, job_description.lower()])
            for role, skills in ROLE_SKILLS.items()
        ]
        vectors = TfidfVectorizer(stop_words="english", ngram_range=(1, 2)).fit_transform(
            [normalized, *role_profiles]
        )
        similarities = cosine_similarity(vectors[0:1], vectors[1:]).ravel()
        role_predictions = sorted(
            (
                {"role": role_names[index], "match_score": round(float(score) * 100)}
                for index, score in enumerate(similarities)
                if score > 0
            ),
            key=lambda prediction: prediction["match_score"],
            reverse=True,
        )[:3]
    except (ImportError, ValueError):
        role_predictions = sorted(
            (
                {"role": role, "match_score": round(len(set(found_skills) & required) / len(required) * 100)}
                for role, required in ROLE_SKILLS.items()
                if set(found_skills) & required
            ),
            key=lambda prediction: prediction["match_score"],
            reverse=True,
        )[:3]
    checks = {
        "Contact details": bool(re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", normalized)),
        "Clear section headings": len(sections) >= 3,
        "Relevant skills": len(found_skills) >= 3,
        "Quantified achievements": bool(re.search(r"\b\d+([,.]\d+)?\s*%?|\$\s*\d+", normalized)),
        "Action-oriented writing": sum(word in ACTION_WORDS for word in words) >= 3,
        "Readable length": 250 <= len(words) <= 900,
    }
    weights = {
        "Contact details": 15, "Clear section headings": 15, "Relevant skills": 20,
        "Quantified achievements": 15, "Action-oriented writing": 15,
        "Readable length": 20,
    }
    score = round(sum(weights[name] for name, passed in checks.items() if passed))
    
    score_breakdown = []
    categories = {
        "Section Completeness": ["Contact details", "Clear section headings", "Relevant skills"],
        "Formatting & Impact": ["Quantified achievements", "Action-oriented writing", "Readable length"]
    }
    
    for cat_name, check_keys in categories.items():
        cat_score = sum(weights[name] for name in check_keys if checks[name])
        cat_max = sum(weights[name] for name in check_keys)
        cat_pct = round((cat_score / cat_max) * 100)
        score_breakdown.append({
            "category": cat_name,
            "score": cat_pct,
            "feedback": "Excellent structure." if cat_pct == 100 else "Some critical elements are missing."
        })
    failed_checks = [name for name, passed in checks.items() if not passed]
    improvement_suggestions = []
    if not checks["Contact details"]:
        improvement_suggestions.append("Add a professional email address and phone number in the header.")
    if not checks["Clear section headings"]:
        improvement_suggestions.append("Add standard headings such as Summary, Experience, Education, Skills, and Projects.")
    if not checks["Relevant skills"]:
        improvement_suggestions.append("Add a focused technical skills section with tools that match your target roles.")
    if not checks["Quantified achievements"]:
        improvement_suggestions.append("Rewrite responsibilities as measurable achievements using numbers, percentages, or scale.")
    if not checks["Action-oriented writing"]:
        improvement_suggestions.append("Start bullet points with strong action verbs such as built, led, automated, or improved.")
    if not checks["Readable length"]:
        improvement_suggestions.append("Keep the resume concise and role-focused, usually around 250-900 words.")
    improvement_suggestions = improvement_suggestions[:5]
    if not improvement_suggestions:
        improvement_suggestions = [
            "Tailor the summary and skills for each application.",
            "Keep your strongest achievements near the top of each experience entry.",
            "Use consistent dates, punctuation, and bullet formatting.",
            "Save a plain-text ATS-friendly version for online applications.",
        ]
    else:
        improvement_suggestions.extend([
            "Tailor the summary and skills to the specific role you want next.",
            "Keep formatting simple, consistent, and easy for ATS parsers to read.",
            "Place the most relevant projects and achievements near the top.",
        ])
        improvement_suggestions = improvement_suggestions[:5]
    overview_points = [
        f"The resume contains approximately {len(words)} words and received an ATS score of {score}/100.",
        f"It includes {len(sections)} standard sections: {', '.join(sections) if sections else 'none detected'}.",
        f"Detected skills include {', '.join(found_skills[:8]) if found_skills else 'no common technical skills yet'}.",
        f"Contact details are {'present' if checks['Contact details'] else 'missing or difficult to detect'} for recruiter outreach.",
        f"Achievement evidence is {'quantified' if checks['Quantified achievements'] else 'mostly unquantified'}, which affects ATS and recruiter impact.",
        f"Writing uses {'action-oriented' if checks['Action-oriented writing'] else 'few action-oriented'} language across the extracted content.",
    ]
    job_recommendations = [
        {
            "role": prediction["role"],
            "match_score": prediction["match_score"],
            "reason": f"Matches {', '.join(sorted(ROLE_SKILLS[prediction['role']] & set(found_skills)))} from the resume.",
        }
        for prediction in role_predictions
    ]
    for role, required in ROLE_SKILLS.items():
        if len(job_recommendations) >= 5:
            break
        if role not in {item["role"] for item in job_recommendations}:
            missing = sorted(required - set(found_skills))
            job_recommendations.append({
                "role": role,
                "match_score": 0,
                "reason": f"Consider after adding skills such as {', '.join(missing[:3])}.",
            })
    overview = (
        f"Detected {len(words)} words, {len(sections)} standard sections, and "
        f"{len(found_skills)} common skills."
    )
    
    missing_keywords = []
    if job_description:
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            jd_clean = re.sub(r"[^\w\s]", " ", job_description).lower()
            res_clean = re.sub(r"[^\w\s]", " ", text).lower()
            
            # Extract top keywords using TF-IDF
            vectorizer = TfidfVectorizer(stop_words='english', max_features=20, ngram_range=(1, 2))
            vectorizer.fit([jd_clean])
            jd_keywords = vectorizer.get_feature_names_out().tolist()
            
            # Find which keywords are missing from the resume
            for kw in jd_keywords:
                if kw not in res_clean:
                    missing_keywords.append(kw)
                    
            if jd_keywords:
                found_jd = len(jd_keywords) - len(missing_keywords)
                kw_score = round((found_jd / len(jd_keywords)) * 100)
                score_breakdown.append({
                    "category": "Keyword Match",
                    "score": kw_score,
                    "feedback": f"You matched {found_jd} out of {len(jd_keywords)} top keywords from the JD."
                })
                # Blend the keyword match into the overall score
                score = round((score * 0.7) + (kw_score * 0.3))
        except Exception:
            pass

    section_breakdown = []
    for section_name, pattern in SECTION_PATTERNS.items():
        is_present = bool(re.search(pattern, lower))
        
        if not is_present:
            if section_name == "certifications":
                feedback = "Optional: Add Certifications/Awards if applicable."
            else:
                feedback = f"Missing {section_name.title()} section."
        else:
            feedback = f"{section_name.title()} section found."
            if section_name == "experience":
                has_metrics = bool(re.search(r"\b\d+([,.]\d+)?\s*%?|\$\s*\d+", lower))
                if has_metrics:
                    feedback = "Experience section includes quantified metrics."
                else:
                    feedback = "Consider adding numbers/metrics to your experience."
            elif section_name == "skills":
                if len(found_skills) >= 5:
                    feedback = "Strong list of technical skills detected."
                else:
                    feedback = "Consider expanding your skills section."

        section_breakdown.append({
            "name": section_name.title(),
            "present": is_present,
            "feedback": feedback
        })

    return {
        "overall_score": score,
        "ats_score": score,
        "score_breakdown": score_breakdown,
        "overview": overview,
        "sections_found": sections,
        "section_breakdown": section_breakdown,
        "skills_found": found_skills,
        "missing_keywords": missing_keywords,
        "suggestions": improvement_suggestions,
        "overview_points": overview_points,
        "improvement_suggestions": improvement_suggestions,
        "job_recommendations": job_recommendations[:5],
        "job_preferences": {
            "target_job_title": "",
            "preferred_roles": [item["role"] for item in job_recommendations[:5]],
            "preferred_location": "",
            "experience_level": "",
        },
        "checks": checks,
        "predicted_roles": role_predictions,
    }


@analysis_bp.route("/analyze", methods=["POST"])
@jwt_required()
def analyze_resume():
    text = (request.form.get("resume_text") or "").strip()
    filename = None
    uploaded_file = request.files.get("file")
    try:
        if uploaded_file and uploaded_file.filename:
            filename = uploaded_file.filename
            text = _extract_file_text(uploaded_file).strip()
    except ValueError as error:
        return jsonify({"message": str(error)}), 400
    except (OSError, RuntimeError, PDFSyntaxError, PdfminerException, zipfile.BadZipFile) as error:
        return jsonify({"message": f"Could not read the uploaded file: {error}"}), 400

    if not text and uploaded_file and uploaded_file.filename:
        text = (
            f"Uploaded resume file: {uploaded_file.filename}. "
            "This PDF does not contain selectable text; add an OCR/text-based PDF for a detailed score."
        )
    if not text:
        return jsonify({"message": "Please upload a PDF, DOCX, or TXT resume file"}), 400
    if len(text) > 100000:
        return jsonify({"message": "Resume text must be smaller than 100,000 characters"}), 400

    report = _analyze_resume(text, request.form.get("job_description", ""))
    report["job_preferences"]["target_job_title"] = (request.form.get("job_title") or "").strip()
    report["job_preferences"]["preferred_location"] = (request.form.get("preferred_location") or "").strip()
    report["job_preferences"]["experience_level"] = (request.form.get("experience_level") or "").strip()
    entered_roles = (request.form.get("preferred_roles") or "").strip()
    if entered_roles:
        report["job_preferences"]["preferred_roles"] = [
            role.strip() for role in entered_roles.split(",") if role.strip()
        ]
    analysis = Analysis(
        user_id=int(get_jwt_identity()),
        filename=filename,
        overall_score=report["overall_score"],
        ats_score=report["ats_score"],
        report_data=json.dumps(report),
    )
    db.session.add(analysis)
    db.session.commit()
    return jsonify({"analysis": analysis.to_dict()}), 201


def _calculate_salary_market(text, job_role, location, experience_years):
    lower_role = (job_role or "Software Engineer").lower()
    lower_loc = (location or "Remote").lower()
    lower_exp = (experience_years or "3-5 Years").lower()
    
    # Extract skills
    normalized = re.sub(r"\s+", " ", text or "").strip()
    lower_text = normalized.lower()
    found_skills = _extract_skills_from_text(lower_text)
    
    # Base Salary Benchmarks in USD (annual)
    base_min = 85000
    base_avg = 120000
    base_max = 160000
    
    if any(k in lower_role for k in ["ai", "ml", "machine learning", "deep learning", "ai/ml"]):
        base_min, base_avg, base_max = 110000, 155000, 210000
    elif any(k in lower_role for k in ["data scientist", "data science"]):
        base_min, base_avg, base_max = 100000, 145000, 190000
    elif any(k in lower_role for k in ["devops", "cloud", "site reliability", "sre"]):
        base_min, base_avg, base_max = 105000, 148000, 195000
    elif any(k in lower_role for k in ["data engineer"]):
        base_min, base_avg, base_max = 100000, 142000, 185000
    elif any(k in lower_role for k in ["full stack", "fullstack"]):
        base_min, base_avg, base_max = 95000, 135000, 178000
    elif any(k in lower_role for k in ["backend", "python developer", "java developer"]):
        base_min, base_avg, base_max = 92000, 130000, 172000
    elif any(k in lower_role for k in ["frontend", "web developer", "react"]):
        base_min, base_avg, base_max = 88000, 125000, 165000
    elif any(k in lower_role for k in ["data analyst"]):
        base_min, base_avg, base_max = 75000, 105000, 140000
    elif any(k in lower_role for k in ["lead", "principal", "manager", "architect"]):
        base_min, base_avg, base_max = 135000, 185000, 245000

    # Experience Multiplier
    exp_mult = 1.0
    if any(k in lower_exp for k in ["fresher", "entry", "0-1", "0-2"]):
        exp_mult = 0.75
    elif any(k in lower_exp for k in ["1-3", "2-4"]):
        exp_mult = 0.90
    elif any(k in lower_exp for k in ["3-5", "4-6"]):
        exp_mult = 1.10
    elif any(k in lower_exp for k in ["5-8", "6-8"]):
        exp_mult = 1.35
    elif any(k in lower_exp for k in ["8+", "10+", "senior", "principal"]):
        exp_mult = 1.65

    # Currency & Location Multiplier
    currency_symbol = "$"
    currency_code = "USD"
    loc_mult = 1.0

    if any(k in lower_loc for k in ["india", "inr", "bangalore", "mumbai", "delhi", "pune", "hyderabad"]):
        currency_symbol = "₹"
        currency_code = "INR"
        loc_mult = 10.0
    elif any(k in lower_loc for k in ["uk", "london", "england", "gbp", "united kingdom"]):
        currency_symbol = "£"
        currency_code = "GBP"
        loc_mult = 0.78
    elif any(k in lower_loc for k in ["europe", "germany", "france", "berlin", "amsterdam", "eur"]):
        currency_symbol = "€"
        currency_code = "EUR"
        loc_mult = 0.85
    elif any(k in lower_loc for k in ["san francisco", "sf", "bay area", "new york", "ny", "seattle"]):
        loc_mult = 1.30
    elif any(k in lower_loc for k in ["austin", "chicago", "boston", "toronto", "canada"]):
        loc_mult = 1.10

    # Skill Premium Multiplier (+4% per high-demand skill up to 25%)
    high_value_skills = {"pytorch", "tensorflow", "aws", "kubernetes", "docker", "react", "next.js", "python", "system architecture", "terraform", "microservices"}
    skill_matches = [s for s in found_skills if s in high_value_skills]
    skill_bonus_pct = min(0.25, len(skill_matches) * 0.04)
    skill_mult = 1.0 + skill_bonus_pct

    # Final Computed Salaries
    min_sal = int(round(base_min * exp_mult * loc_mult * skill_mult / 500) * 500)
    avg_sal = int(round(base_avg * exp_mult * loc_mult * skill_mult / 500) * 500)
    max_sal = int(round(base_max * exp_mult * loc_mult * skill_mult / 500) * 500)
    
    # Financial Breakdown Estimates
    base_pay = int(round(avg_sal * 0.85))
    performance_bonus = int(round(avg_sal * 0.10))
    equity_grant = int(round(avg_sal * 0.05))

    # Value Justification Bullet Points
    value_points = []
    if found_skills:
        top_s_str = ", ".join([s.title() for s in found_skills[:5]])
        value_points.append(f"Demonstrated technical mastery in high-demand industry skills: {top_s_str}.")
    else:
        value_points.append("Proven technical adaptability and solid foundational knowledge in core domain tools.")
        
    if re.search(r"\b\d+([,.]\d+)?\s*%?|\$\s*\d+", lower_text):
        value_points.append("Proven track record of driving quantified business impact, system scalability, and cost efficiency.")
    else:
        value_points.append("Hands-on execution experience delivering complex project deliverables under tight deadlines.")

    value_points.append(f"Direct alignment with target market requirements for {job_role or 'Software Engineer'} ({experience_years}).")
    value_points.append("Strong cross-functional collaboration, technical problem solving, and production system reliability.")

    # Negotiation Scripts
    formatted_avg = f"{currency_symbol}{avg_sal:,}"
    formatted_max = f"{currency_symbol}{max_sal:,}"
    formatted_min = f"{currency_symbol}{min_sal:,}"

    phone_script_variants = [
        (
            f"Recruiter/Hiring Manager: 'We are excited to offer you the {job_role or 'target'} role at {formatted_min} base salary.'\n\n"
            f"Candidate Verbal Response:\n"
            f"'Thank you so much! I am extremely excited about the team and the vision at your company. Based on my hands-on experience in "
            f"{', '.join([s.title() for s in found_skills[:4]]) if found_skills else 'core domain competencies'} and current market data for "
            f"{job_role or 'this role'} in {location or 'this location'} with {experience_years} of experience, my research indicates that total compensation for this level typically ranges between "
            f"{formatted_avg} and {formatted_max}.\n\n"
            f"Given my proven achievements and immediate readiness to deliver value, I would be thrilled to sign immediately if we can align around "
            f"{formatted_avg} base salary with an annual performance bonus.'"
        ),
        (
            f"Recruiter/Hiring Manager: 'We would like to move forward with an offer of {formatted_min} for the {job_role or 'position'}.'\n\n"
            f"Candidate Verbal Response:\n"
            f"'I really appreciate the offer and I am very inspired by the work your team is doing. Having evaluated industry compensation benchmarks for {job_role or 'this role'} in {location or 'the region'}, "
            f"professionals with {experience_years} of experience and expertise in {', '.join([s.title() for s in found_skills[:4]]) if found_skills else 'key technical tools'} generally command between {formatted_avg} and {formatted_max}.\n\n"
            f"I am eager to make an immediate impact on your upcoming milestones. Would you be open to adjusting the base target to {formatted_avg}?'"
        ),
        (
            f"Recruiter/Hiring Manager: 'Our starting compensation for the {job_role or 'role'} is set at {formatted_min}.'\n\n"
            f"Candidate Verbal Response:\n"
            f"'Thank you for sharing the details! I am enthusiastic about this position and confident in my fit for the team. "
            f"Taking into account my specialized skillset in {', '.join([s.title() for s in found_skills[:4]]) if found_skills else 'relevant technologies'} along with market rates in {location or 'this region'}, "
            f"the standard target range sits at {formatted_avg} to {formatted_max}.\n\n"
            f"If we can meet at {formatted_avg} base salary, I am prepared to accept the offer today and begin onboarding right away.'"
        )
    ]

    email_template_variants = [
        (
            f"Subject: Compensation Discussion – {job_role or 'Candidate Application'}\n\n"
            f"Dear Hiring Team,\n\n"
            f"Thank you for extending the offer for the {job_role or 'target'} role. I am very enthusiastic about joining the team and contributing to your upcoming initiatives.\n\n"
            f"Before finalizing the agreement, I wanted to discuss the compensation package. After reviewing benchmark market data for {job_role or 'this role'} in {location or 'our region'} "
            f"and taking into account my specialized expertise in {', '.join([s.title() for s in found_skills[:4]]) if found_skills else 'core domain technical skills'}, "
            f"the market average sits between {formatted_avg} and {formatted_max}.\n\n"
            f"To summarize the key value points I bring to the team:\n"
            + "".join([f"• {vp}\n" for vp in value_points]) +
            f"\nGiven these factors, I would be grateful if we could adjust the target base salary to {formatted_avg}. "
            f"I am confident this reflects the value I will bring to the organization and look forward to reaching a mutually beneficial agreement.\n\n"
            f"Best regards,\n[Your Name]"
        ),
        (
            f"Subject: Offer Review & Compensation Alignment – {job_role or 'Position'}\n\n"
            f"Dear Hiring Manager,\n\n"
            f"Thank you sincerely for extending the offer to join your team as a {job_role or 'team member'}. I am thrilled about the prospect of bringing my skills in {', '.join([s.title() for s in found_skills[:4]]) if found_skills else 'engineering & technical execution'} to your projects.\n\n"
            f"Upon reviewing the offer details alongside current industry compensation metrics for {experience_years} experience in {location or 'this market'}, total compensation for similar roles benchmarks between {formatted_avg} and {formatted_max}.\n\n"
            f"My background uniquely equips me to add immediate value:\n"
            + "".join([f"• {vp}\n" for vp in value_points]) +
            f"\nWith these contributions in mind, could we explore bringing the base salary closer to {formatted_avg}? I am eager to finalize our agreement and get started.\n\n"
            f"Warm regards,\n[Your Name]"
        ),
        (
            f"Subject: Counter-Offer & Next Steps – {job_role or 'Role Application'}\n\n"
            f"Dear Recruitment Team,\n\n"
            f"I greatly appreciate the offer for the {job_role or 'target'} position. Your team's vision resonates deeply with me, and I am excited about the impact we can make together.\n\n"
            f"I would like to discuss aligning the base compensation with current market expectations. Based on data for {job_role or 'this position'} with {experience_years} of background in {location or 'this market'}, median market pay is positioned around {formatted_avg}, reaching up to {formatted_max}.\n\n"
            f"Key strengths I bring include:\n"
            + "".join([f"• {vp}\n" for vp in value_points]) +
            f"\nIf you can adjust the base compensation to {formatted_avg}, I would be delighted to accept immediately.\n\n"
            f"Respectfully,\n[Your Name]"
        )
    ]

    phone_script = random.choice(phone_script_variants)
    email_template = random.choice(email_template_variants)

    return {
        "job_role": job_role or "Software Engineer",
        "location": location or "Remote",
        "experience_years": experience_years or "3-5 Years",
        "currency_symbol": currency_symbol,
        "currency_code": currency_code,
        "min_salary": min_sal,
        "market_avg": avg_sal,
        "max_salary": max_sal,
        "base_pay": base_pay,
        "performance_bonus": performance_bonus,
        "equity_grant": equity_grant,
        "skill_premium_pct": int(skill_bonus_pct * 100),
        "detected_skills": [s.title() for s in found_skills],
        "value_justifications": value_points,
        "phone_script": phone_script,
        "email_template": email_template
    }


@analysis_bp.route("/salary-negotiator", methods=["POST"])
@jwt_required(optional=True)
def salary_negotiator():
    text = (request.form.get("resume_text") or "").strip()
    uploaded_file = request.files.get("file")
    job_role = (request.form.get("job_role") or "Software Engineer").strip()
    location = (request.form.get("location") or "Remote").strip()
    experience_years = (request.form.get("experience_years") or "3-5 Years").strip()

    if uploaded_file and uploaded_file.filename:
        try:
            extracted = _extract_file_text(uploaded_file).strip()
            if extracted:
                text = extracted
        except Exception:
            pass

    res = _calculate_salary_market(text, job_role, location, experience_years)
    return jsonify(res), 200


def _generate_linkedin_hub_data(text, target_role, tone):
    role_title = (target_role or "Software Engineer").strip()
    selected_tone = (tone or "Professional & Catchy").strip()

    # Extract skills from text
    found_skills = _extract_skills_from_text(text)
    if not found_skills:
        found_skills = ["python", "sql", "problem solving", "system architecture", "git"]
    found_skills = [s.title() for s in found_skills]

    top_skills_str = ", ".join(found_skills[:5])
    skills_bullet_str = "\n".join([f"• {s}" for s in found_skills[:8]])

    # Build Role & Skill-based Hashtags
    role_clean_words = re.findall(r"[A-Za-z0-9]+", role_title)
    role_hashtags = " ".join([f"#{w}" for w in role_clean_words])
    skill_hashtags = " ".join([f"#{s.replace(' ', '').replace('.', '').replace('/', '')}" for s in found_skills[:6]])
    hashtags = f"{role_hashtags} {skill_hashtags} #CareerGrowth #Innovation #TechCareers #Networking".strip()

    # Headline Variants
    headline_variants = [
        f"🚀 {role_title} | Specializing in {top_skills_str} | Building Scalable High-Impact Systems",
        f"💡 {role_title} | Expertise in {top_skills_str} | Driving Technical Excellence & Innovation",
        f"⚡ {role_title} | {top_skills_str} | Passionate about System Architecture & Engineering Performance",
        f"🌟 {role_title} | Technical Mastery in {top_skills_str} | Solving Complex Problems at Scale"
    ]
    headline = random.choice(headline_variants)

    # Tone-based "About" Section Summaries (Multiple Dynamic Variants per Tone)
    if "Bold" in selected_tone or "Executive" in selected_tone:
        about_variants = [
            (
                f"As a results-oriented {role_title}, I combine technical depth with strategic vision to architect high-performance systems and drive measurable business impact.\n\n"
                f"Throughout my technical journey, I have cultivated deep expertise in:\n"
                f"{skills_bullet_str}\n\n"
                f"🎯 Core Strengths & Value Drivers:\n"
                f"• System Architecture & Scalability: Designing resilient, production-ready solutions.\n"
                f"• Cross-Functional Leadership: Partnering with product teams and stakeholders to turn complex goals into software.\n"
                f"• Continuous Technical Rigor: Championing code quality, performance optimization, and modern best practices.\n\n"
                f"I thrive in fast-paced environments where innovation, analytical problem-solving, and execution excellence are paramount.\n\n"
                f"📩 Open to connecting with fellow engineers, tech leaders, and recruiters. Let's discuss new opportunities and technical initiatives!\n\n"
                f"{hashtags}"
            ),
            (
                f"Strategic and execution-focused {role_title} dedicated to leading high-capacity engineering initiatives and delivering scalable enterprise tools.\n\n"
                f"💼 Primary Domain Competencies:\n"
                f"{skills_bullet_str}\n\n"
                f"🚀 Executive Focus Areas:\n"
                f"• Enterprise Reliability: Scaling backend services, microservices, and database models.\n"
                f"• Engineering Governance: Enforcing clean architecture, peer reviews, and automated CI/CD deployment.\n"
                f"• Strategic Alignment: Aligning technical infrastructure with high-growth business objectives.\n\n"
                f"Looking to drive transformative outcomes and partner with visionary engineering teams.\n\n"
                f"📫 Connect with me to discuss strategic technical roles and collaborations.\n\n"
                f"{hashtags}"
            )
        ]
    elif "Enthusiastic" in selected_tone or "Passion" in selected_tone:
        about_variants = [
            (
                f"Passionate, curiosity-driven {role_title} on a mission to build technology that makes a real difference! ✨\n\n"
                f"I love taking complex challenges and turning them into clean, elegant, and user-focused technical solutions. My core skill set centers around:\n"
                f"{skills_bullet_str}\n\n"
                f"🌟 What excites me most:\n"
                f"• Solving tough engineering puzzles with creative, modern approaches.\n"
                f"• Collaborating with passionate teams and learning new technologies every single day.\n"
                f"• Delivering impactful tools and systems that empower users and scale seamlessly.\n\n"
                f"Always eager to expand my network, exchange ideas, and explore exciting career opportunities in {role_title}!\n\n"
                f"📬 Feel free to drop a message or connect—I'd love to chat!\n\n"
                f"{hashtags}"
            ),
            (
                f"Hi there! 👋 I am an energetic {role_title} who loves building digital solutions, hacking through tricky bugs, and bringing ideas to life!\n\n"
                f"🔥 My Core Technical Arsenal:\n"
                f"{skills_bullet_str}\n\n"
                f"💡 What drives me forward:\n"
                f"• The thrill of seeing clean code deploy seamlessly into production.\n"
                f"• Brainstorming with incredible cross-functional teams to solve real-world problems.\n"
                f"• Staying ahead of technological shifts and continuously expanding my domain knowledge.\n\n"
                f"Always open for a friendly tech chat, networking, or exploring career opportunities!\n\n"
                f"💬 Drop me a note—let's connect and innovate together!\n\n"
                f"{hashtags}"
            )
        ]
    elif "Technical" in selected_tone or "Metrics" in selected_tone:
        about_variants = [
            (
                f"Hands-on {role_title} focused on building robust, scalable infrastructure and end-to-end software solutions.\n\n"
                f"🛠 Technical Stack & Competencies:\n"
                f"{skills_bullet_str}\n\n"
                f"📊 Key Focus Areas:\n"
                f"• High-Performance System Engineering: Optimizing latency, resource allocation, and throughput.\n"
                f"• Modular Architecture: Applying design patterns, unit testing, and automated deployment pipelines.\n"
                f"• Data & Algorithmic Problem Solving: Translating raw data and business rules into efficient algorithms.\n\n"
                f"Directly focused on delivering reliable technical outcomes and tackling complex engineering roadmaps.\n\n"
                f"📫 Open to technical discussions, peer networking, and strategic {role_title} opportunities.\n\n"
                f"{hashtags}"
            ),
            (
                f"Technical {role_title} specializing in system performance, modular engineering, and data pipeline efficiency.\n\n"
                f"💻 Core Tech Stack:\n"
                f"{skills_bullet_str}\n\n"
                f"⚡ Engineering Capabilities:\n"
                f"• Code & Query Optimization: Enhancing database indexing, API throughput, and execution speed.\n"
                f"• Production Reliability: Implementing rigorous error handling, logging, and monitoring.\n"
                f"• Test-Driven Development: Writing test suites to guarantee long-term stability and regression resistance.\n\n"
                f"Committed to technical excellence, continuous delivery, and clean code hygiene.\n\n"
                f"📩 Open for technical collaboration, engineering networking, and targeted role discussions.\n\n"
                f"{hashtags}"
            )
        ]
    else:  # Professional & Catchy (Default)
        about_variants = [
            (
                f"Welcome to my profile! I am a dedicated {role_title} committed to building high-quality software, optimizing technical workflows, and delivering innovative digital solutions.\n\n"
                f"With a strong foundation in core engineering principles, my technical toolkit includes:\n"
                f"{skills_bullet_str}\n\n"
                f"💡 What I Bring to the Table:\n"
                f"• Proven ability to design and implement resilient systems using {top_skills_str}.\n"
                f"• Strong analytical mindset with a focus on clean code, system scalability, and business impact.\n"
                f"• Collaborative approach to teamwork, technical documentation, and agile execution.\n\n"
                f"I am actively seeking opportunities to contribute to forward-thinking tech teams as a {role_title}.\n\n"
                f"🤝 Let's connect! Always happy to network with recruiters, hiring managers, and fellow tech enthusiasts.\n\n"
                f"{hashtags}"
            ),
            (
                f"Hello! As a professional {role_title}, I combine hands-on problem solving with a deep passion for modern software engineering.\n\n"
                f"🛠 Featured Competencies & Tools:\n"
                f"{skills_bullet_str}\n\n"
                f"🌟 Highlights & Achievements:\n"
                f"• Experienced in building robust, production-grade applications with {top_skills_str}.\n"
                f"• Passionate about software craftsmanship, performance optimization, and clean architectural design.\n"
                f"• Proven track record of fast adaptation to new stacks, tools, and fast-paced team environments.\n\n"
                f"I am eager to leverage my skills to build high-value products and accelerate engineering goals.\n\n"
                f"✉️ Feel free to connect or send a message regarding potential roles or tech discussions!\n\n"
                f"{hashtags}"
            )
        ]

    about_summary = random.choice(about_variants)

    # Networking / Connection Messages
    recruiter_note_variants = [
        f"Hi! I came across your profile while exploring {role_title} opportunities. With hands-on experience in {top_skills_str}, I would love to connect and stay in touch regarding potential roles on your team!",
        f"Hello! I am a {role_title} specialized in {top_skills_str}. I am currently expanding my network with technical recruiters and would be thrilled to connect!",
        f"Hi! I admire your work in talent acquisition. As a {role_title} passionate about {found_skills[0] if found_skills else 'tech'}, I'd love to add you to my professional network.",
        f"Greetings! I noticed you recruit for high-performing engineering teams. I specialize in {role_title} ({top_skills_str}) and would appreciate connecting with you."
    ]

    recruiter_full_variants = [
        (
            f"Subject: Inquiring About {role_title} Opportunities\n\n"
            f"Dear [Recruiter Name],\n\n"
            f"I hope this message finds you well! I have been following your recruiting updates and am very impressed by the talent and engineering culture at your organization.\n\n"
            f"As a {role_title} with specialized experience in {top_skills_str}, I am actively exploring opportunities where I can contribute to high-impact projects. My background combines technical execution, clean system design, and collaborative problem-solving.\n\n"
            f"Key technical competencies include:\n"
            f"{skills_bullet_str}\n\n"
            f"I would welcome the opportunity to connect for a quick introductory chat to discuss how my qualifications align with your active or upcoming roles.\n\n"
            f"Thank you for your time, and I look forward to connecting!\n\n"
            f"Best regards,\n[Your Name]\n[LinkedIn Profile Link]"
        ),
        (
            f"Subject: Application & Introduction – {role_title}\n\n"
            f"Hello [Recruiter Name],\n\n"
            f"I hope you are having a productive week! I am reaching out because I am very interested in software engineering and {role_title} opportunities within your company.\n\n"
            f"With a strong foundation in {top_skills_str}, I bring a track record of building reliable backend systems, writing clean modular code, and collaborating closely across teams.\n\n"
            f"Core skill highlights:\n"
            f"{skills_bullet_str}\n\n"
            f"If you are currently sourcing talent for {role_title} positions, I would be delighted to share my resume and discuss how I can add immediate value to your pipeline.\n\n"
            f"Warm regards,\n[Your Name]"
        )
    ]

    hiring_manager_note_variants = [
        f"Hi [Hiring Manager Name], I really admire your team's work in tech innovation. As a {role_title} skilled in {top_skills_str}, I'd love to connect and follow your team's progress!",
        f"Hello [Hiring Manager Name]! I am a {role_title} with a strong focus on {top_skills_str}. I am eager to connect with engineering leaders like you in the industry.",
        f"Hi! I came across your work leading engineering teams. I specialize in {role_title} ({top_skills_str}) and would love to join your professional network.",
        f"Hello [Hiring Manager Name]! Your team's technical achievements in engineering are inspiring. I work in {role_title} and would love to stay connected."
    ]

    hiring_manager_full_variants = [
        (
            f"Subject: Connecting & Technical Inquiry – {role_title}\n\n"
            f"Dear [Hiring Manager Name],\n\n"
            f"I hope you are having a great week! I have been following your team's accomplishments in engineering and wanted to reach out directly.\n\n"
            f"I am a {role_title} with hands-on expertise in {top_skills_str}. I focus on building scalable architectures, optimizing code performance, and delivering reliable features.\n\n"
            f"A snapshot of my technical strengths:\n"
            f"{skills_bullet_str}\n\n"
            f"If you are currently expanding your engineering team or open to informal technical chats, I would be thrilled to introduce myself and share how I could add value to your roadmap.\n\n"
            f"Thanks for your time and consideration!\n\n"
            f"Best regards,\n[Your Name]"
        ),
        (
            f"Subject: Technical Synergy & Introduction – {role_title}\n\n"
            f"Dear [Hiring Manager Name],\n\n"
            f"I hope all is well. I am reaching out to connect with engineering leadership in the {role_title} domain.\n\n"
            f"My technical background centers around {top_skills_str}. I specialize in architecting efficient workflows, solving complex technical challenges, and executing product roadmaps.\n\n"
            f"Key competencies:\n"
            f"{skills_bullet_str}\n\n"
            f"I would be glad to connect and learn more about your team's ongoing technical initiatives.\n\n"
            f"Sincerely,\n[Your Name]"
        )
    ]

    peer_note_variants = [
        f"Hi [Name]! I noticed we share a strong background in {role_title} and {found_skills[0] if found_skills else 'software'}. Always great connecting with fellow engineers—looking forward to following your work!",
        f"Hello! As a fellow {role_title}, I'm expanding my network of technical peers working on {top_skills_str}. Excited to connect!",
        f"Hi! Great to see your work in tech. I also work in {role_title} with a focus on {top_skills_str}. Let know if you'd like to exchange ideas sometime!",
        f"Hey [Name]! Love connecting with fellow builders and {role_title} professionals. Looking forward to staying connected on LinkedIn!"
    ]

    return {
        "target_role": role_title,
        "tone": selected_tone,
        "headline": headline,
        "about_summary": about_summary,
        "hashtags": hashtags,
        "detected_skills": found_skills[:8],
        "key_highlights": [
            f"Specialized domain focus in {top_skills_str}",
            f"Proven track record of building production solutions and clean architectures",
            f"Strong cross-functional collaboration and technical problem-solving capabilities"
        ],
        "networking_messages": {
            "recruiter_note": random.choice(recruiter_note_variants),
            "recruiter_full": random.choice(recruiter_full_variants),
            "hiring_manager_note": random.choice(hiring_manager_note_variants),
            "hiring_manager_full": random.choice(hiring_manager_full_variants),
            "peer_note": random.choice(peer_note_variants)
        }
    }


@analysis_bp.route("/linkedin-hub", methods=["POST"])
@jwt_required(optional=True)
def linkedin_hub():
    text = (request.form.get("resume_text") or "").strip()
    uploaded_file = request.files.get("file")
    target_role = (request.form.get("target_role") or "Software Engineer").strip()
    tone = (request.form.get("tone") or "Professional & Catchy").strip()

    if uploaded_file and uploaded_file.filename:
        try:
            extracted = _extract_file_text(uploaded_file).strip()
            if extracted:
                text = extracted
        except Exception:
            pass

    res = _generate_linkedin_hub_data(text, target_role, tone)
    return jsonify(res), 200


def _evaluate_interview_answer(question, answer, job_role, detected_skills):
    text = (answer or "").strip()
    words = re.findall(r"\w+", text)
    word_count = len(words)
    lower_ans = text.lower()
    lower_q = (question or "").lower()

    # Base scoring out of 10 based on length, detail, and keyword presence
    score = 6.0

    if word_count == 0:
        return {
            "score": 0.0,
            "rating": "Needs Answer",
            "feedback": "No answer was provided. Try speaking or typing a structured response explaining your approach.",
            "improvement_tips": [
                "Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
                "Mention specific technical tools, frameworks, and architecture decisions.",
                "Provide quantified results or metrics where possible."
            ]
        }

    # Length & detail bonus
    if word_count >= 15: score += 1.0
    if word_count >= 40: score += 1.0
    if word_count >= 80: score += 0.5

    # Tech keyword & skill density check
    matched_skills = [s for s in (detected_skills or []) if s.lower() in lower_ans]
    if matched_skills:
        score += min(1.5, len(matched_skills) * 0.5)

    # STAR structure indicators
    star_keywords = {"situation", "task", "action", "result", "led", "built", "designed", "optimized", "solved", "improved", "implemented", "achieved"}
    star_matches = sum(1 for k in star_keywords if k in lower_ans)
    if star_matches >= 2:
        score += 0.5

    final_score = round(min(10.0, max(3.5, score)), 1)

    # Feedback rating category
    if final_score >= 8.5:
        rating = "Excellent"
        feedback = f"Outstanding answer! You effectively articulated technical concepts and structure. Mentioning tools like {', '.join(matched_skills) if matched_skills else 'core domain practices'} adds strong credibility."
    elif final_score >= 7.0:
        rating = "Strong"
        feedback = "Solid response with clear reasoning. To elevate this to top-tier, elaborate more on specific metrics, trade-offs, and outcomes."
    else:
        rating = "Developing"
        feedback = "Good foundation, but your answer could be expanded with more technical details, explicit action steps, and measurable results."

    improvement_tips = []
    if not matched_skills:
        improvement_tips.append("Incorporate specific technical tools or methods (e.g. state management, API design, data pipelines) to demonstrate deep hands-on experience.")
    if word_count < 35:
        improvement_tips.append("Expand on your answer with concrete context: outline the problem, your exact technical contributions, and the final impact.")
    if not any(k in lower_ans for k in ["result", "percent", "percentile", "%", "metric", "improved", "scaled"]):
        improvement_tips.append("Conclude your response with measurable outcomes or impact (e.g., 'reduced latency by 30%', 'scaled to 10k users').")
    if len(improvement_tips) < 2:
        improvement_tips.append("Maintain clear articulation and concise structure using the STAR methodology for storytelling.")

    return {
        "score": final_score,
        "rating": rating,
        "feedback": feedback,
        "improvement_tips": improvement_tips[:3]
    }


@analysis_bp.route("/mock-interview/evaluate", methods=["POST"])
@jwt_required(optional=True)
def evaluate_mock_interview():
    data = request.get_json(silent=True) or request.form
    question = (data.get("question") or "").strip()
    answer = (data.get("answer") or "").strip()
    job_role = (data.get("job_role") or "Software Engineer").strip()
    skills = data.get("skills") or []
    if isinstance(skills, str):
        skills = [s.strip() for s in skills.split(",") if s.strip()]

    result = _evaluate_interview_answer(question, answer, job_role, skills)
    return jsonify(result), 200


def _generate_interview_questions_backend(text, job_description, interview_type, difficulty, question_count):
    # Parse text strictly from scratch for this request
    detected_skills = _extract_skills_from_text(text)
    
    # Dynamic fallback ONLY if no COMMON_SKILLS matched in raw file text
    if not detected_skills and text:
        candidate_name_words = _extract_candidate_name_words(text)
        blacklisted = STOPWORDS_AND_NAMES.union(candidate_name_words)
        tech_words = re.findall(r"\b[A-Za-z0-9#+.-]{3,}\b", text)
        extracted_words = []
        for w in tech_words:
            if w.lower() not in blacklisted and len(extracted_words) < 8:
                extracted_words.append(w.title())
        detected_skills = extracted_words if extracted_words else ["Core Engineering"]

    # ABSOLUTE STRICT WHITELIST OF EXTRACTED SKILLS
    whitelisted_skills = set(s.lower() for s in detected_skills)

    # Repository of domain question pools mapped strictly to skill keys
    SKILL_QUESTION_POOLS = {
        # --- CORE ENGINEERING & CAD/CAM/CAE POOLS ---
        "solidworks": [
            {
                "id": "sw_1",
                "category": "Technical",
                "domain": "SolidWorks 3D CAD & Mechanical Design",
                "question": "How do you design complex 3D parametric parts, weldments, and large assemblies in SolidWorks using proper geometric constraints, equations, and MBD annotations?",
                "resumeBadge": "Tailored from resume skill: SolidWorks",
                "sampleAnswer": "I build parametric sketches with fully defined relations, utilize top-down assembly modeling to prevent interferences, and apply MBD annotations for manufacturing handoff."
            },
            {
                "id": "sw_2",
                "category": "Technical",
                "domain": "SolidWorks Motion & GD&T Drafting",
                "question": "Describe your approach to conducting motion analysis, collision detection, and drafting manufacturing drawings with GD&T callouts in SolidWorks.",
                "resumeBadge": "Tailored from resume skill: SolidWorks",
                "sampleAnswer": "I set up SolidWorks Motion studies to evaluate kinematic forces and joint clearance, drafting ASME Y14.5 compliant engineering drawings with datum targets and tolerance stacks."
            }
        ],
        "ansys": [
            {
                "id": "ansys_1",
                "category": "Technical",
                "domain": "ANSYS FEA & Structural Simulation",
                "question": "How do you set up Finite Element Analysis (FEA) models in ANSYS Mechanical, defining boundary conditions, meshing refinement, and contact formulations?",
                "resumeBadge": "Tailored from resume skill: ANSYS",
                "sampleAnswer": "I import CAD geometry, apply mesh convergence studies using hex/tetrahedral elements, define non-linear contact behavior (bonded/frictional), and solve for Von Mises stress and safety factors."
            },
            {
                "id": "ansys_2",
                "category": "Technical",
                "domain": "ANSYS Thermal & CFD Analysis",
                "question": "Describe your workflow for running steady-state thermal, modal vibration, or Fluent CFD simulations in ANSYS to optimize part thermal dissipation and structural resonance.",
                "resumeBadge": "Tailored from resume skill: ANSYS",
                "sampleAnswer": "I define fluid domains and inflation layers in ANSYS Fluent, solve Navier-Stokes turbulence models (k-epsilon), and verify natural frequency modes to avoid harmonic resonance."
            }
        ],
        "autocad": [
            {
                "id": "acad_1",
                "category": "Technical",
                "domain": "AutoCAD 2D/3D Drafting & Standards",
                "question": "How do you structure layer standards, dynamic blocks, external references (Xrefs), and sheet sets in AutoCAD for architectural or mechanical drafting?",
                "resumeBadge": "Tailored from resume skill: AutoCAD",
                "sampleAnswer": "I enforce standardized AIA/ISO layer conventions, create dynamic blocks with visibility states, link Xrefs for collaborative drafting, and publish multi-sheet plotting layouts."
            },
            {
                "id": "acad_2",
                "category": "Technical",
                "domain": "AutoCAD Dimensioning & Tolerance Stacks",
                "question": "Describe how you ensure dimensioning accuracy, tolerance stacks, and title block compliance across production engineering drawings in AutoCAD.",
                "resumeBadge": "Tailored from resume skill: AutoCAD",
                "sampleAnswer": "I apply explicit dimension styles, calculate worst-case and RSS tolerance stacks, and audit drawing revisions against engineering release standards."
            }
        ],
        "matlab": [
            {
                "id": "mat_1",
                "category": "Technical",
                "domain": "MATLAB & Control System Modeling",
                "question": "How do you model control systems, signal processing algorithms, and dynamic system simulations using MATLAB and Simulink?",
                "resumeBadge": "Tailored from resume skill: MATLAB",
                "sampleAnswer": "I derive system transfer functions, analyze stability using Bode plots and Root Locus in MATLAB, and build block diagram feedback loops in Simulink."
            },
            {
                "id": "mat_2",
                "category": "Technical",
                "domain": "MATLAB Scripting & Optimization",
                "question": "Describe your approach to writing modular vectorized MATLAB scripts for numerical analysis, data visualization, and parameter optimization.",
                "resumeBadge": "Tailored from resume skill: MATLAB",
                "sampleAnswer": "I replace scalar loops with matrix operations, write custom M-file functions, and use optimization toolboxes (fmincon / lsqcurvefit) to fit empirical data models."
            }
        ],
        # --- FINANCIAL, ACCOUNTING & ERP POOLS ---
        "sap": [
            {
                "id": "sap_1",
                "category": "Technical",
                "domain": "SAP FICO & Enterprise Resource Planning",
                "question": "How do you configure and manage General Ledger (G/L), Accounts Payable (A/P), and Accounts Receivable (A/R) modules in SAP FICO to ensure seamless financial closing?",
                "resumeBadge": "Tailored from resume skill: SAP FICO",
                "sampleAnswer": "I configure G/L master records, document types, and posting keys while executing automated month-end clearing and bank reconciliation workflows in SAP FICO."
            },
            {
                "id": "sap_2",
                "category": "Technical",
                "domain": "SAP Asset Accounting & Controlling",
                "question": "Describe your process for asset depreciation runs, cost center allocation, and internal order settlement within SAP FICO / Controlling (CO).",
                "resumeBadge": "Tailored from resume skill: SAP FICO",
                "sampleAnswer": "I define asset classes and depreciation keys in SAP FI-AA, run monthly AFAB depreciation postings, and settle internal order variances to cost centers."
            }
        ],
        "quickbooks": [
            {
                "id": "qb_1",
                "category": "Technical",
                "domain": "QuickBooks & Bookkeeping Automation",
                "question": "How do you structure the Chart of Accounts, reconcile bank feeds, and automate recurring invoices in QuickBooks to maintain accurate real-time cash flow visibility?",
                "resumeBadge": "Tailored from resume skill: QuickBooks",
                "sampleAnswer": "I organize account hierarchies, map bank feeds using automated rules, and execute monthly bank and credit card reconciliations in QuickBooks Online/Desktop."
            },
            {
                "id": "qb_2",
                "category": "Technical",
                "domain": "QuickBooks Payroll & Reporting",
                "question": "Walk through how you resolve unallocated transactions, process payroll tax liabilities, and generate P&L statements in QuickBooks for annual audit readiness.",
                "resumeBadge": "Tailored from resume skill: QuickBooks",
                "sampleAnswer": "I reclassify uncategorized expenses, verify payroll tax liability registers, and run comparative Profit & Loss and Balance Sheet reports for executive management."
            }
        ],
        "tally": [
            {
                "id": "tally_1",
                "category": "Technical",
                "domain": "Tally ERP 9 / TallyPrime Accounting",
                "question": "How do you manage GST/VAT compliance, voucher entry, and inventory batch tracking in Tally ERP 9 / TallyPrime?",
                "resumeBadge": "Tailored from resume skill: Tally",
                "sampleAnswer": "I maintain ledger masters, configure GST tax rates, record sales/purchase vouchers, and generate GSTR-1 and GSTR-3B audit returns directly from Tally."
            },
            {
                "id": "tally_2",
                "category": "Technical",
                "domain": "Tally Trial Balance & Closing Entries",
                "question": "Describe your approach to generating Trial Balances, Balance Sheets, and Profit & Loss statements in Tally for annual audit readiness.",
                "resumeBadge": "Tailored from resume skill: Tally",
                "sampleAnswer": "I review ledger balances, record year-end closing and adjustment vouchers, and export verified financial statements for external auditor review."
            }
        ],
        "excel": [
            {
                "id": "xl_1",
                "category": "Technical",
                "domain": "Advanced Excel & Financial Automation",
                "question": "How do you leverage advanced Excel functions (INDEX/MATCH, XLOOKUP, Dynamic Arrays, Power Query) to consolidate multi-entity financial data pipelines?",
                "resumeBadge": "Tailored from resume skill: Advanced Excel",
                "sampleAnswer": "I build dynamic data models using XLOOKUP and Power Query ETL queries, eliminating manual copy-pasting and establishing automated refreshable reporting workbooks."
            },
            {
                "id": "xl_2",
                "category": "Technical",
                "domain": "Excel Financial Dashboards & PivotTables",
                "question": "Describe how you build interactive financial executive dashboards using PivotTables, Slicers, and Data Validation while preserving workbook calculation speed.",
                "resumeBadge": "Tailored from resume skill: Advanced Excel",
                "sampleAnswer": "I structure data in clean tabular formats, build PivotTables with calculated fields and slicers, and optimize formula efficiency to avoid heavy volatile functions like OFFSET."
            }
        ],
        "financial modeling": [
            {
                "id": "fm_1",
                "category": "Technical",
                "domain": "Financial Modeling & Valuation",
                "question": "Walk through how you construct an integrated 3-Statement Financial Model (Income Statement, Balance Sheet, Cash Flow) from raw historical trial balances.",
                "resumeBadge": "Tailored from resume skill: Financial Modeling",
                "sampleAnswer": "I project revenue and expense drivers on the Income Statement, build supporting working capital and debt schedules, link net income to Cash Flow, and balance the Balance Sheet."
            },
            {
                "id": "fm_2",
                "category": "Technical",
                "domain": "DCF Valuation & Sensitivity Analysis",
                "question": "How do you incorporate sensitivity analysis, Scenario Manager, and WACC calculations into Discounted Cash Flow (DCF) valuation models to quantify financial risk?",
                "resumeBadge": "Tailored from resume skill: Financial Modeling",
                "sampleAnswer": "I calculate WACC using CAPM, project Unlevered Free Cash Flows over a 5-year horizon, estimate Terminal Value using Gordon Growth, and build 2-way data tables for sensitivity."
            }
        ],
        "auditing": [
            {
                "id": "audit_1",
                "category": "Technical",
                "domain": "Internal & External Auditing",
                "question": "Describe your methodology for developing an internal audit plan, testing key internal controls (SOX compliance), and documenting audit working papers.",
                "resumeBadge": "Tailored from resume skill: Auditing",
                "sampleAnswer": "I conduct risk assessments to identify high-risk financial processes, perform walkthroughs and sample testing of key controls, and log audit findings in standardized working papers."
            },
            {
                "id": "audit_2",
                "category": "Technical",
                "domain": "Audit Analytics & Substantive Testing",
                "question": "How do you execute audit sampling, journal entry analytics, and substantive analytical procedures to detect financial misstatements or fraud risks?",
                "resumeBadge": "Tailored from resume skill: Auditing",
                "sampleAnswer": "I extract ledger data into audit analytics tools, run Benford's Law and unusual keyword tests on manual journal entries, and perform detailed voucher verification."
            }
        ],
        "taxation": [
            {
                "id": "tax_1",
                "category": "Technical",
                "domain": "Corporate Taxation & Compliance",
                "question": "How do you ensure compliance with corporate income tax, indirect tax (GST/VAT), and deferred tax accounting regulations during quarterly tax filings?",
                "resumeBadge": "Tailored from resume skill: Taxation",
                "sampleAnswer": "I prepare tax provision calculations (ASC 740 / IAS 12), reconcile book-to-tax differences, and file accurate tax returns adhering to statutory tax deadlines."
            }
        ],
        "accounting": [
            {
                "id": "acct_1",
                "category": "Technical",
                "domain": "Financial Accounting & GAAP/IFRS Standards",
                "question": "Explain how you apply GAAP/IFRS revenue recognition standards (ASC 606 / IFRS 15) to complex customer contracts and multi-element deliverables.",
                "resumeBadge": "Tailored from resume skill: Accounting",
                "sampleAnswer": "I identify performance obligations in customer contracts, allocate transaction prices based on standalone selling prices, and recognize revenue as obligations are satisfied."
            },
            {
                "id": "acct_2",
                "category": "Technical",
                "domain": "Month-End Close & Reconciliation",
                "question": "Describe your step-by-step process for performing accruals, prepayments, balance sheet reconciliations, and journal entry adjustments during month-end close.",
                "resumeBadge": "Tailored from resume skill: Accounting",
                "sampleAnswer": "I review recurring schedules for prepaids and accruals, perform subledger-to-G/L reconciliations, log adjusting journal entries, and prepare verified closing binders."
            }
        ],
        "financial analysis": [
            {
                "id": "fa_1",
                "category": "Technical",
                "domain": "Financial Planning & Analysis (FP&A)",
                "question": "How do you perform Variance Analysis comparing Actual vs Budgeted financial performance, and how do you translate cost drivers into executive recommendations?",
                "resumeBadge": "Tailored from resume skill: Financial Analysis",
                "sampleAnswer": "I dissect revenue and cost variances into volume, price, and mix components, building bridge charts that summarize performance drivers for business unit heads."
            }
        ],
        "risk management": [
            {
                "id": "risk_1",
                "category": "Technical",
                "domain": "Enterprise Risk Management & Compliance",
                "question": "How do you establish enterprise risk management (ERM) frameworks, assess operational/financial risk exposure, and ensure strict regulatory compliance?",
                "resumeBadge": "Tailored from resume skill: Risk Management",
                "sampleAnswer": "I design risk matrices that score risk likelihood and financial impact, define key risk indicators (KRIs), and implement mitigation controls across business operations."
            }
        ],

        # --- TECH & SOFTWARE POOLS ---
        "python": [
            {
                "id": "py_1",
                "category": "Technical",
                "domain": "Python Data Processing & Vectorization",
                "question": "How do you optimize data processing pipelines in Python using Pandas and NumPy to replace slow scalar loops with vectorized operations?",
                "resumeBadge": "Tailored from resume skill: Python",
                "sampleAnswer": "I replace scalar loop operations with vectorized Pandas dataframe transformations, downcast numerical data types, and use NumPy array broadcasting to optimize CPU execution."
            },
            {
                "id": "py_2",
                "category": "Technical",
                "domain": "Python Memory & GIL Concurrency",
                "question": "How does the Python Global Interpreter Lock (GIL) impact multi-threaded CPU-bound vs I/O-bound tasks, and when should you use multiprocessing or asyncio instead?",
                "resumeBadge": "Tailored from resume skill: Python",
                "sampleAnswer": "The GIL prevents true parallel execution of CPython threads on multi-core CPUs. For CPU-bound tasks, I use Python multiprocessing. For I/O-bound tasks, I use asyncio or threading."
            }
        ],
        "pytorch": [
            {
                "id": "torch_1",
                "category": "Technical",
                "domain": "PyTorch Deep Learning Models",
                "question": "Can you explain how you design custom PyTorch Dataset and DataLoader classes for efficient batching, data augmentation, and GPU memory management (.to(device))?",
                "resumeBadge": "Tailored from resume skill: PyTorch",
                "sampleAnswer": "I subclass torch.utils.data.Dataset, implementing __len__ and __getitem__ methods to load and preprocess samples lazily. I configure DataLoader with pinned memory and num_workers."
            }
        ],
        "xgboost": [
            {
                "id": "xgb_1",
                "category": "Technical",
                "domain": "XGBoost & Gradient Boosting",
                "question": "How do you handle class imbalance and prevent overfitting when training XGBoost models? Which parameters (e.g., scale_pos_weight, max_depth, subsample, learning_rate, reg_alpha, reg_lambda) do you tune?",
                "resumeBadge": "Tailored from resume skill: XGBoost",
                "sampleAnswer": "I use scale_pos_weight or SMOTE to balance loss weights. To prevent overfitting, I tune max_depth (3-7), subsample (0.8), colsample_bytree (0.8), and apply L1/L2 regularization."
            }
        ],
        "sql": [
            {
                "id": "sql_1",
                "category": "Technical",
                "domain": "SQL Query Execution & Schema Design",
                "question": "Describe how you write complex SQL queries using CTEs, window functions, and indexing to process analytics data efficiently.",
                "resumeBadge": "Tailored from resume skill: SQL",
                "sampleAnswer": "I structure complex aggregations using Common Table Expressions (CTEs) for readability and use window functions (ROW_NUMBER(), PARTITION BY) for ranking while analyzing execution plans."
            }
        ]
    }

    # STRICT WHITELIST COLLECTION: Gather ONLY questions matching whitelisted skills
    candidate_tech_pool = []
    
    for skill_key, questions in SKILL_QUESTION_POOLS.items():
        if skill_key in whitelisted_skills or any(skill_key in s for s in whitelisted_skills):
            for q in questions:
                if q not in candidate_tech_pool:
                    candidate_tech_pool.append(q)

    # Dynamic custom technical & functional questions for ALL candidate detected skills
    for sk in detected_skills:
        sk_title = sk.title()
        sk_slug = re.sub(r"[^a-z0-9]", "_", sk.lower())
        
        custom_q_1 = {
            "id": f"custom_{sk_slug}_prod",
            "category": "Technical",
            "domain": f"Domain Competency & {sk_title}",
            "question": f"How do you leverage {sk_title} in professional environments to streamline workflows, enforce accuracy, and optimize operational performance?",
            "resumeBadge": f"Tailored from resume skill: {sk_title}",
            "sampleAnswer": f"I follow industry best practices when executing tasks with {sk_title}, establishing standardized procedures, conducting thorough quality checks, and monitoring key metrics."
        }
        custom_q_2 = {
            "id": f"custom_{sk_slug}_arch",
            "category": "Technical",
            "domain": f"Strategy & {sk_title}",
            "question": f"Describe your approach to troubleshooting errors, auditing data integrity, and solving complex challenges when working with {sk_title}.",
            "resumeBadge": f"Tailored from resume skill: {sk_title}",
            "sampleAnswer": f"I isolate root causes systematically, analyze input parameters against compliance standards, and implement permanent corrective controls."
        }
        custom_q_3 = {
            "id": f"custom_{sk_slug}_report",
            "category": "Technical",
            "domain": f"Reporting & {sk_title}",
            "question": f"How do you present analytical findings, reconciliations, and reporting insights derived from {sk_title} to executive decision-makers?",
            "resumeBadge": f"Tailored from resume skill: {sk_title}",
            "sampleAnswer": f"I translate raw outputs into executive summary dashboards, highlighting key trends, risk exposures, and actionable strategic recommendations."
        }
        custom_q_4 = {
            "id": f"custom_{sk_slug}_scale",
            "category": "Technical",
            "domain": f"Process Scaling & {sk_title}",
            "question": f"Walk through a scenario where you scaled or automated a manual process involving {sk_title} to increase efficiency and eliminate manual error.",
            "resumeBadge": f"Tailored from resume skill: {sk_title}",
            "sampleAnswer": f"I documented baseline manual steps, identified repetitive bottlenecks, built automated templates and validation rules, reducing cycle time substantially."
        }

        for cq in [custom_q_1, custom_q_2, custom_q_3, custom_q_4]:
            if not any(q["id"] == cq["id"] for q in candidate_tech_pool):
                candidate_tech_pool.append(cq)

    # 15 Comprehensive Behavioral & HR Questions
    hr_questions = [
        {
            "id": "hr_1",
            "category": "HR & Behavioral",
            "domain": "Conflict Resolution & Leadership",
            "question": "Tell me about a time when you had a professional disagreement with a colleague or manager. How did you reach a productive consensus?",
            "resumeBadge": "Behavioral & Leadership",
            "sampleAnswer": "Situation: A colleague preferred a traditional manual approach while I advocated for an automated workflow. Action: I built a side-by-side demonstration showing accuracy gains. Result: Empirical results convinced the team to adopt the automated solution."
        },
        {
            "id": "hr_2",
            "category": "HR & Behavioral",
            "domain": "Time Management & Deadlines",
            "question": "Describe a situation where project deliverables changed close to a tight deadline. How did you adapt your priorities?",
            "resumeBadge": "Agile Adaptation",
            "sampleAnswer": "Situation: Requirements shifted 48 hours before release. Action: I reprioritized core critical deliverables, communicated transparently with stakeholders, and completed essential tasks on schedule."
        },
        {
            "id": "hr_3",
            "category": "HR & Behavioral",
            "domain": "Incident Management & Ownership",
            "question": "Describe a scenario where a production report or process encountered a critical error. What steps did you take to resolve and prevent it?",
            "resumeBadge": "Incident Management",
            "sampleAnswer": "Situation: An unexpected data discrepancy altered reporting outputs. Action: I paused distribution, traced the calculation error to source files, corrected the validation rule, and republished verified figures."
        },
        {
            "id": "hr_4",
            "category": "HR & Behavioral",
            "domain": "Cross-Functional Communication",
            "question": "How do you communicate complex domain insights or financial metrics to non-technical executive stakeholders?",
            "resumeBadge": "Communication & Strategy",
            "sampleAnswer": "I translate low-level technical trade-offs into high-level business impact metrics, leveraging concise visual dashboards and clear executive summaries."
        },
        {
            "id": "hr_5",
            "category": "HR & Behavioral",
            "domain": "Workload Prioritization",
            "question": "How do you handle multiple competing high-priority tasks when resources or time are constrained?",
            "resumeBadge": "Prioritization",
            "sampleAnswer": "I evaluate tasks by business urgency and financial impact, set transparent milestones with stakeholders, and delegate effectively."
        },
        {
            "id": "hr_6",
            "category": "HR & Behavioral",
            "domain": "Process Improvement",
            "question": "Give an example of a legacy process you audited and successfully streamlined to improve accuracy or speed.",
            "resumeBadge": "Process Optimization",
            "sampleAnswer": "I identified redundant manual data entry steps, implemented standardized templates with validation checks, cutting processing time by 40%."
        },
        {
            "id": "hr_7",
            "category": "HR & Behavioral",
            "domain": "Ethics & Compliance",
            "question": "Describe how you handle situations where compliance standards or internal controls might be compromised.",
            "resumeBadge": "Ethics & Compliance",
            "sampleAnswer": "I adhere strictly to regulatory policies, document discrepancies transparently, and escalate compliance risks to audit leads immediately."
        },
        {
            "id": "hr_8",
            "category": "HR & Behavioral",
            "domain": "Stakeholder Negotiation",
            "question": "Tell me about a time you had to push back against unrealistic budget or project timeline expectations.",
            "resumeBadge": "Stakeholder Alignment",
            "sampleAnswer": "I presented data-driven resource estimates showing trade-offs, offering phased delivery options that met core business goals within realistic constraints."
        }
    ]

    selected_tech = []
    selected_hr = []

    if interview_type == "technical":
        selected_tech = candidate_tech_pool[:question_count]
    elif interview_type == "hr":
        selected_hr = hr_questions[:question_count]
    else:
        tech_cnt = int(question_count / 2 + 0.5)
        hr_cnt = int(question_count / 2)
        selected_tech = candidate_tech_pool[:tech_cnt]
        selected_hr = hr_questions[:hr_cnt]

    canonical_skills = [s.title() for s in detected_skills[:10]]

    return {
        "type": interview_type,
        "difficulty": difficulty,
        "questionCount": len(selected_tech) + len(selected_hr),
        "detectedSkills": canonical_skills,
        "technicalQuestions": selected_tech,
        "hrQuestions": selected_hr
    }


@analysis_bp.route("/interview-prep/generate", methods=["POST"])
@jwt_required(optional=True)
def generate_interview_prep():
    uploaded_file = request.files.get("file")
    job_description = (request.form.get("job_description") or "").strip()
    interview_type = (request.form.get("interview_type") or "mixed").strip()
    difficulty = (request.form.get("difficulty") or "Intermediate").strip()
    try:
        question_count = int(request.form.get("question_count") or 10)
    except (ValueError, TypeError):
        question_count = 10

    text = ""
    if uploaded_file and uploaded_file.filename:
        try:
            uploaded_file.seek(0)
            extracted = _extract_file_text(uploaded_file).strip()
            if extracted:
                text = extracted
        except Exception as e:
            print("File extraction notice:", e)
        
        if not text:
            return jsonify({"message": "Could not extract text from the uploaded PDF/file. Please upload a readable text-based PDF or DOCX file."}), 400

    if not text:
        text = (request.form.get("resume_text") or "").strip()

    if not text:
        return jsonify({"message": "Please upload a resume file or enter skills text."}), 400

    res = _generate_interview_questions_backend(text, job_description, interview_type, difficulty, question_count)
    return jsonify(res), 200



