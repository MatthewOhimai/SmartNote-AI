import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.documents.services import generate_summary, generate_quiz, chat_with_document

sample_text = """
The mitochondria is the powerhouse of the cell. It is responsible for cellular respiration
and energy production. Plant cells also have chloroplasts for photosynthesis.
"""

print("--- Testing Summary ---")
try:
    summary = generate_summary(sample_text)
    print("Summary:", summary)
except Exception as e:
    print("Summary Failed:", e)

print("\n--- Testing Quiz ---")
try:
    quiz = generate_quiz(sample_text, num_questions=2)
    print("Quiz:", quiz)
except Exception as e:
    print("Quiz Failed:", e)

print("\n--- Testing Chat ---")
try:
    answer = chat_with_document(sample_text, "What is the powerhouse of the cell?")
    print("Chat Answer:", answer)
except Exception as e:
    print("Chat Failed:", e)
