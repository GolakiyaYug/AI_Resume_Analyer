import hashlib
import secrets
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage

from flask import current_app

CODE_LENGTH = 6
CODE_EXPIRY_MINUTES = 15
CODE_RESEND_SECONDS = 60
MAX_CODE_ATTEMPTS = 5


def generate_code():
    return f"{secrets.randbelow(10 ** CODE_LENGTH):0{CODE_LENGTH}d}"


def hash_code(code):
    return hashlib.sha256(code.encode("utf-8")).hexdigest()


def code_expiry():
    return datetime.utcnow() + timedelta(minutes=CODE_EXPIRY_MINUTES)


def can_send_code(last_sent_at):
    if not last_sent_at:
        return True
    return (datetime.utcnow() - last_sent_at).total_seconds() >= CODE_RESEND_SECONDS


def send_code_email(recipient, code, purpose):
    host = current_app.config["SMTP_HOST"]
    port = current_app.config["SMTP_PORT"]
    username = current_app.config["SMTP_USERNAME"]
    password = current_app.config["SMTP_PASSWORD"]
    sender = current_app.config["SMTP_FROM"]
    if not all((host, username, password, sender)):
        raise RuntimeError("Email delivery is not configured. Set the SMTP variables in backend/.env.")

    subject = "Verify your ResumeCraft email" if purpose == "verification" else "Reset your ResumeCraft password"
    action = "verify your email address" if purpose == "verification" else "reset your password"
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = recipient
    message.set_content(
        f"Your ResumeCraft code to {action} is: {code}\n\n"
        f"This code expires in {CODE_EXPIRY_MINUTES} minutes and can be used only once."
    )
    smtp_class = smtplib.SMTP_SSL if current_app.config["SMTP_USE_TLS"] == "ssl" else smtplib.SMTP
    with smtp_class(host, port, timeout=15) as smtp:
        if current_app.config["SMTP_USE_TLS"] == "starttls":
            smtp.starttls()
        smtp.login(username, password)
        smtp.send_message(message)
