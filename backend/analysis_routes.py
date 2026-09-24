import io
import json
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
    "python", "java", "javascript", "typescript", "react", "vue", "angular", "node", "express", "next.js", "html", "css", "tailwind", "bootstrap",
    "sql", "postgresql", "mysql", "mongodb", "redis", "sqlite",
    "numpy", "pandas", "scikit-learn", "pytorch", "tensorflow", "keras", "deep learning", "machine learning", "nlp", "opencv", "data analysis", "power bi", "tableau", "excel", "statistics",
    "flask", "django", "fastapi", "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "git", "c++", "c#", "go", "rust", "swift", "kotlin",
    "figma", "ui/ux", "ux", "ui", "photoshop", "illustrator", "wireframing", "user research", "design systems",
    "communication", "leadership", "problem solving",
}
ROLE_SKILLS = {
    "Frontend Developer": {"javascript", "typescript", "react", "html", "css"},
    "Backend Developer": {"python", "java", "flask", "django", "node", "sql"},
    "Full Stack Developer": {"javascript", "react", "node", "python", "sql"},
    "Data Analyst": {"python", "sql", "excel", "machine learning"},
    "Machine Learning Engineer": {"python", "machine learning", "sql"},
    "DevOps Engineer": {"aws", "docker", "git", "python"},
}


def _extract_file_text(file_storage):
    filename = (file_storage.filename or "").lower()
    content = file_storage.read()
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
    found_skills = sorted(skill for skill in COMMON_SKILLS if skill in lower)
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
    found_skills = sorted(skill for skill in COMMON_SKILLS if skill in lower_text)
    
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

    phone_script = (
        f"Recruiter/Hiring Manager: 'We are excited to offer you the {job_role or 'target'} role at {formatted_min} base salary.'\n\n"
        f"Candidate Response:\n"
        f"'Thank you so much! I am extremely excited about the team and the vision at your company. Based on my hands-on experience in "
        f"{', '.join([s.title() for s in found_skills[:4]]) if found_skills else 'software engineering'} and current market data for "
        f"{job_role or 'this role'} in {location or 'this location'} with {experience_years} of experience, my research indicates that total compensation for this level typically ranges between "
        f"{formatted_avg} and {formatted_max}.\n\n"
        f"Given my proven achievements and immediate readiness to deliver value, I would be thrilled to sign immediately if we can align around "
        f"{formatted_avg} base salary with an annual performance bonus.'"
    )

    email_template = (
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
    )

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

