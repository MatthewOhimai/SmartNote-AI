import os
import json
import PyPDF2
from google import genai
from google.genai import types
import logging

logger = logging.getLogger(__name__)

# ─── AI Client Configuration ───────────────────────────────────────────────────
# Injected from environment — never hardcoded.
_gemini_api_key = os.environ.get('GEMINI_API_KEY')
_gemini_model = os.environ.get('GEMINI_MODEL', 'gemini-2.5-flash')

def _get_gemini_client():
    """Returns a configured Gemini client. Raises if API key is missing."""
    if not _gemini_api_key:
        raise EnvironmentError(
            "GEMINI_API_KEY is not set. "
            "Please add it to your .env file."
        )
    return genai.Client(api_key=_gemini_api_key)

def _parse_json_response(content):
    """Strips markdown code blocks and parses JSON."""
    content = content.strip()
    if content.startswith('```'):
        first_newline = content.find('\n')
        if first_newline != -1:
            content = content[first_newline:].strip()
        if content.endswith('```'):
            content = content[:-3].strip()
    return json.loads(content)


# ─── PDF Text Extraction ───────────────────────────────────────────────────────

def extract_text_from_pdf(file_path):
    """
    Extracts text from a given PDF file path using PyPDF2.
    """
    text = ""
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        logger.error(f"Failed to extract text from PDF {file_path}: {e}")
        raise ValueError(f"Could not read PDF file: {str(e)}")

    return text.strip()


# ─── Summary Generation ────────────────────────────────────────────────────────

def generate_summary(text):
    """
    Generates a short summary and bullet-point summary of the given text
    using the Gemini API. Returns a dict with 'short' and 'bullets' keys.
    """
    client = _get_gemini_client()

    prompt = (
        "You are an academic assistant. Given the following document text, "
        "produce:\n"
        "1. A short summary (2-3 sentences).\n"
        "2. A bullet-point summary (5-7 key points).\n\n"
        "Return your answer in this exact JSON format:\n"
        '{"short": "...", "bullets": ["point1", "point2", ...]}\n\n'
        f"Document text:\n{text[:10000]}"
    )

    try:
        response = client.models.generate_content(
            model=_gemini_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.5,
                max_output_tokens=1200,
                response_mime_type="application/json"
            )
        )
        content = response.text.strip()
        return _parse_json_response(content)
    except json.JSONDecodeError:
        logger.warning("Gemini summary response was not valid JSON, returning raw text.")
        return {"short": content, "bullets": []}
    except Exception as e:
        logger.error(f"Summary generation failed: {e}")
        raise ValueError(f"Failed to generate summary: {str(e)}")


# ─── Quiz Generation ───────────────────────────────────────────────────────────

def generate_quiz(text, num_questions=5):
    """
    Generates multiple-choice quiz questions from the given text.
    Returns a list of dicts, each with 'question', 'options', and 'correct_answer'.
    """
    client = _get_gemini_client()

    prompt = (
        "You are an academic quiz generator. Based on the following document text, "
        f"generate {num_questions} multiple choice questions.\n\n"
        "Return your answer as a JSON array. Each element must have:\n"
        '- "question": the question string\n'
        '- "options": {"A": "...", "B": "...", "C": "...", "D": "..."}\n'
        '- "correct_answer": the letter of the correct option (e.g. "A")\n\n'
        f"Document text:\n{text[:10000]}"
    )

    try:
        response = client.models.generate_content(
            model=_gemini_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=2000,
                response_mime_type="application/json"
            )
        )
        content = response.text.strip()
        return _parse_json_response(content)
    except json.JSONDecodeError:
        logger.warning("Gemini quiz response was not valid JSON, returning raw text.")
        return []
    except Exception as e:
        logger.error(f"Quiz generation failed: {e}")
        raise ValueError(f"Failed to generate quiz: {str(e)}")


# ─── Chat With Document ────────────────────────────────────────────────────────

def chat_with_document(text, user_question):
    """
    Answers a user question using the document text as context.
    Returns the AI-generated answer string.
    """
    client = _get_gemini_client()

    system_instruction = (
        "You are a helpful study assistant. Use ONLY the following "
        "document context to answer the user's question. If the answer "
        "cannot be found in the context, say so clearly.\n\n"
        "IMPORTANT: Do NOT use markdown formatting (like **, _, or #). "
        "Provide your answers in readable, detailed plain text paragraphs.\n\n"
        f"Document context:\n{text[:10000]}"
    )

    try:
        response = client.models.generate_content(
            model=_gemini_model,
            contents=user_question,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.4,
                max_output_tokens=1000,
            )
        )
        return response.text.strip()
    except Exception as e:
        logger.error(f"Chat failed: {e}")
        raise ValueError(f"Failed to chat with document: {str(e)}")
