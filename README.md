# 🧠 SmartNote AI

> **Note:** This README.md is AI-generated based on the initial project blueprint.

Welcome to **SmartNote AI**, a lightweight, AI-powered study summary tool designed to help secondary and university students save time, digest information faster, and study more effectively.

## 🎯 The Problem

Students waste countless hours reading and trying to comprehend lengthy PDF documents. SmartNote AI streamlines this process by automatically extracting key information, summarizing it, and allowing interactive studying through generation of quizzes and a document-aware chat interface.

---

## 🚀 Core Features

This project focuses on a tightly scoped, minimum viable but impressive feature set:

### 1️⃣ PDF Upload & Processing

- Secure PDF file upload.
- Robust text extraction from document pages.
- Persistent storage of files and their extracted text in the database.

### 2️⃣ Summary Generation

- Automatically generate short, high-level summaries of uploaded documents.
- Extract bullet-point summaries for quick scanning and review.
- Store results persistently for later access.

### 3️⃣ Quiz Generator

- Automatically generate 5–10 multiple-choice questions based on the document's content.
- Store generated quizzes in the database for knowledge testing.

### 4️⃣ Basic Chat With Document

- Ask specific questions about the uploaded document.
- Provide document context alongside the user's question to the AI for accurate, context-aware answers.

---

## 🏗️ Architecture & Tech Stack

The system is built to demonstrate strong technical signals in file handling, AI integration, asynchronous processing, and API design.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Django + Django REST Framework (DRF)
- **Architecture Style:** Modular Monolith (grouping related domain logic into cohesive modules while deploying as a single unit)
- **Database:** PostgreSQL (Production) / SQLite (Development)
- **AI Engine:** Google Gemini API (for state-of-the-art text processing and generation)
- **Deployment Targets:**
  - **Frontend:** Vercel
  - **Backend:** Render

---

## ⚠️ Development Rules & Best Practices

Code quality and security are paramount. All development must strictly adhere to the following rules to ensure the codebase remains production-ready.

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
- 🚫 **No Business Logic in Routes:** Views and controllers should only handle HTTP logic (parsing requests, returning responses). All business rules, AI interactions, and complex data manipulations must reside in dedicated service layers or decoupled modules.
- 🚫 **No `localStorage` Token Assumptions:** Implement secure and standard token handling for authentication; do not rely on insecure assumptions about client-side storage.
- ✅ **Production-Ready Standards:** Write clean, modular, and maintainable code. Implement proper error handling to prevent application crashes and provide meaningful feedback to the user.
- ✅ **Secure by Default:** Follow best security practices. Validate and sanitize all inputs (especially PDF file uploads), secure your API endpoints, and mitigate common web vulnerabilities.

---

## 💻 Getting Started

_(Instructions for setting up the Django backend, configuring environment variables, and running the React Vite frontend locally will be added here as the application is scaffolded.)_
