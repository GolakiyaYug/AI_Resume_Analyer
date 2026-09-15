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
    "python", "java", "javascript", "typescript", "react", "node", "sql",
    "flask", "django", "aws", "docker", "git", "machine learning", "excel",
    "html", "css", "c++", "communication", "leadership",
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
