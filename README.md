# Nexus AI Backend | Feedback Intelligence System

The Nexus AI Backend is an intelligent processing engine designed to transform unstructured user feedback into actionable insights. By utilizing Large Language Models (LLMs), it automatically classifies data, detects sentiment, and routes issues to the appropriate internal teams.

🚀 Live Demo: https://nexus-ai-backend-chi.vercel.app/

## 🚀 Project Overview

Manually triaging hundreds of user logs is inefficient. This system automates the "Triage" phase of product management. When feedback is submitted, the backend performs a real-time analysis using a **Structured Output Chain** to ensure the AI's response perfectly matches the system's database schema.

---

## ✨ Key Features

- **AI-Driven Triage:** Automated analysis of Category, Priority, and Sentiment using Google Gemini.
- **Structured Output:** Uses **Zod** and **LangChain** to guarantee that LLM responses adhere to strict TypeScript types.
- **Failover Logic:** Includes a built-in "AI Failover" mechanism that applies safe defaults if the LLM service is unreachable.
- **MVC Architecture:** Clean separation of concerns between controllers, models, and services.
- **CORS Enabled:** Pre-configured for seamless integration with modern frontend frameworks (Vite/React).

---

## 🛠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js (v5.x)
- **AI Orchestration:** LangChain.js
- **LLM Model:** Google Gemini 2.5 Flash
- **Database:** MongoDB via Mongoose
- **Validation:** Zod (for AI schema enforcement)
- **Development:** TypeScript & TSX

---

## 📂 Project Structure

```text
src/
├── controllers/          # Request handlers & Business logic
│   └── feedback.controller.ts
├── models/               # Mongoose schemas & TypeScript interfaces
│   └── Feedback.ts
├── services/             # External integrations (AI/LLM Logic)
│   └── llm.service.ts
├── types/                # Shared TypeScript types
│   └── Feedback.ts
└── index.ts              # Server entry point & DB connection

```

---

## ⚙️ Installation & Setup

### 1. Prerequisites

- Node.js v20+
- A MongoDB Atlas account or local instance
- A [Google AI Studio API Key](https://aistudio.google.com/)

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_gemini_api_key

```

### 3. Installation Steps

**Clone the repository:**

```bash
git clone https://github.com/shadeshsaha/User-Feedback-Intelligence-System.git
cd User-Feedback-Intelligence-System

```

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

```

---

## 📡 API Endpoints

| Method   | Endpoint                  | Description                                     |
| -------- | ------------------------- | ----------------------------------------------- |
| `GET`    | `/api/getFeedbacks`       | Fetch all analyzed feedback (Sorted by Newest). |
| `POST`   | `/api/createFeedback`     | Submit new feedback for AI analysis & storage.  |
| `DELETE` | `/api/deleteFeedback/:id` | Remove a feedback entry by ID.                  |

---

### 📤 POST `/api/createFeedback` — Request Body

The endpoint expects a JSON object containing the raw user input.

```json
{
  "userName": "Shadesh Saha",
  "content": "The login page takes too long to load on mobile devices."
}
```

---

### 📥 POST `/api/createFeedback` — Response

The system returns the processed feedback, including the AI's intelligence report.

```json
{
  "success": true,
  "data": {
    "_id": "65e123abc...",
    "userName": "Shadesh Saha",
    "originalText": "The login page takes too long to load on mobile devices.",
    "category": "Performance",
    "priority": "High",
    "sentiment": "Negative",
    "assignedTeam": "Frontend Team",
    "aiFailover": false,
    "createdAt": "2026-03-10T..."
  }
}
```

---

## 🛡️ Security & Reliability

- **SSL/TLS:** The MongoDB connection is configured with `tls: true` for secure data transit.
- **Sanitization:** Mongoose `trim: true` and Zod validation ensure data integrity before persistence.
