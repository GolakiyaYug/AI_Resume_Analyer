import hashlib
import logging
import secrets
import smtplib
import socket
import ssl
from datetime import datetime, timedelta
from email.message import EmailMessage

from flask import current_app

logger = logging.getLogger(__name__)

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
    """
    Sends an OTP email using configured SMTP settings.
    Safely handles DNS resolution (getaddrinfo failed), offline connection,
    timeout, SSL, and authentication errors to prevent application crashes.
    """
    host = str(current_app.config.get("SMTP_HOST", "") or "").strip()
    raw_port = current_app.config.get("SMTP_PORT", 587)
    username = str(current_app.config.get("SMTP_USERNAME", "") or "").strip()
    password = str(current_app.config.get("SMTP_PASSWORD", "") or "").strip()
    sender = str(current_app.config.get("SMTP_FROM", "") or "").strip() or username
    use_tls = str(current_app.config.get("SMTP_USE_TLS", "starttls") or "starttls").lower().strip()

    if not host or not username or not password or not sender:
        logger.error("SMTP delivery is not configured. Missing required SMTP config variables.")
        raise RuntimeError("Email delivery is not configured. Set the SMTP variables in backend/.env.")

    try:
        port = int(raw_port)
    except (ValueError, TypeError):
        port = 587

    # If Gmail app password contains spaces (e.g. "xxxx xxxx xxxx xxxx"), sanitize it
    if "gmail.com" in host.lower() and " " in password:
        password = password.replace(" ", "")

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

    try:
        if use_tls in ("ssl", "true", "465") or port == 465:
            context = ssl.create_default_context()
            smtp_class = smtplib.SMTP_SSL(host, port, timeout=10, context=context)
        else:
            smtp_class = smtplib.SMTP(host, port, timeout=10)

        with smtp_class as smtp:
            smtp.ehlo()
            if use_tls in ("starttls", "587") and port != 465:
                context = ssl.create_default_context()
                smtp.starttls(context=context)
                smtp.ehlo()
            smtp.login(username, password)
            smtp.send_message(message)
            logger.info(f"Email successfully sent to {recipient} for {purpose}.")

    except socket.gaierror as exc:
        logger.error(f"Failed to resolve SMTP host '{host}' (getaddrinfo failed): {exc}")
        raise RuntimeError(
            f"SMTP host connection failed ([Errno 11001] getaddrinfo failed). "
            "Please check your internet connection and SMTP host configuration."
        ) from exc

    except (socket.timeout, TimeoutError) as exc:
        logger.error(f"SMTP connection timeout to '{host}:{port}': {exc}")
        raise RuntimeError("SMTP connection timed out. Please check network connection.") from exc

    except smtplib.SMTPAuthenticationError as exc:
        logger.error(f"SMTP Authentication failed for user '{username}': {exc}")
        raise RuntimeError("SMTP authentication failed. Please check your username and app password.") from exc

    except smtplib.SMTPException as exc:
        logger.error(f"SMTP protocol error: {exc}")
        raise RuntimeError(f"SMTP error occurred while sending email: {exc}") from exc

    except (ssl.SSLError, ConnectionError, OSError) as exc:
        logger.error(f"Network or SSL connection error: {exc}")
        raise RuntimeError(f"Network error while connecting to mail server: {exc}") from exc

    except Exception as exc:
        logger.error(f"Unexpected error sending email: {exc}")
        raise RuntimeError(f"Failed to send email: {exc}") from exc

