# 🧠 SmartNote AI

Welcome to **SmartNote AI**, a lightweight, AI-powered study summary tool designed to help secondary and university students save time, digest information faster, and study more effectively.

## 🎯 The Problem

Students waste countless hours reading and trying to comprehend lengthy PDF documents. SmartNote AI streamlines this process by automatically extracting key information, summarizing it, and allowing interactive studying through the generation of quizzes and a document-aware chat interface.

---

## 🚀 Core Features

This project focuses on a tightly scoped, minimum viable but impressive feature set:

### 1️⃣ PDF Upload & Processing

- Secure PDF file upload natively handled by Django.
- Robust text extraction from document pages using PyPDF2.
- Persistent storage of files and their extracted text in a relational database.

### 2️⃣ Summary Generation

- Automatically generate short, high-level summaries of uploaded documents using Google's Gemini API.
- Extract bullet-point summaries for quick scanning and review.
- Store results persistently for later access.

### 3️⃣ Quiz Generator

- Automatically generate 5–10 multiple-choice questions based on the document's content using AI.
- Store generated quizzes in the database for knowledge testing.

### 4️⃣ Basic Chat With Document

- Ask specific questions about the uploaded document.
- Provide document context alongside the user's question to the AI for accurate, context-aware answers.

### 5️⃣ Aesthetic UI Interface

- Centralized upload area with premium aesthetic elements (Gradient background, smooth styling).
- Interactive cards, dynamic headers, and responsive document lists.

---

## 🏗️ Architecture & Tech Stack

The system is built to demonstrate strong technical signals in file handling, AI integration, asynchronous processing, and API design.

- **Frontend:** React + Vite + Tailwind CSS (plus Lucide React for Icons)
- **Backend:** Django 5 + Django REST Framework (DRF)
- **Architecture Style:** Modular Monolith (grouping related domain logic into cohesive modules while deploying as a single unit)
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **AI Engine:** Google Gemini API (gemini-2.5-flash) for state-of-the-art text processing, summarization, and chat.
- **Deployment Targets:**
  - **Frontend:** Vercel (recommended)
  - **Backend:** Render (recommended)

---

## ⚠️ Development Rules & Best Practices

Code quality and security are paramount. All development strictly adheres to the following rules:

### 🏆 The Golden Rule

> **If changing a value requires changing code, you’re probably hardcoding.**
>
> Production-ready developers:
>
> - **Configure**, not hardcode.
> - **Inject**, not embed.
> - **Separate** logic from settings.

### Strictly Enforced Guidelines

- 🚫 **No Hardcoded Secrets:** Never commit API keys, database credentials, or secret tokens. Use environment variables (`.env`) for all configuration and sensitive data.
- 🚫 **No Business Logic in Routes:** Views and controllers only handle HTTP logic (parsing requests, returning responses). All business rules, AI interactions, and complex data manipulations reside in detailed service layers.
- ✅ **Secure by Default:** Follows best security practices including validating and sanitizing all inputs, securing API endpoints, and utilizing modern module configuration via Vite.

---

## 💻 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ (or higher)

### 1. Backend Setup

1. Navigation into backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up Environment Variables:
   Create a `.env` file inside `backend/` and provide your Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
5. Apply database migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Run the server:
   ```bash
   python manage.py runserver
   ```
   The backend will be running at `http://127.0.0.1:8000`.

### 2. Frontend Setup

1. Open a new terminal and navigate into the frontend folder:
   ```bash
   cd frontend/smartnote
   ```
2. Install Node Module packages:
   ```bash
   npm install
   ```
3. Run the development environment:
   ```bash
   npm run dev
   ```
4. Access the SmartNote AI dashboard in your browser via the provided Vite local URL (typically `http://localhost:5173`).
