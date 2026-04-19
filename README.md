# 🧠 Smart Meeting Summarizer

> **AI-powered web application that transforms meeting audio and transcripts into structured summaries and actionable tasks — instantly.**

Smart Meeting Summarizer is a full-stack, cloud-ready web application built for processing meeting recordings and transcripts using large language models and speech-to-text AI. Users can either **upload a meeting audio file** (which is automatically transcribed to text via Deepgram) or **paste a transcript directly**. The application then generates a concise summary and extracts a bullet-pointed list of action items. All processed meetings are persisted in a PostgreSQL database and can be browsed, searched, and deleted through a dedicated history view.

The project was developed for the **Cloud Technologies** university course and demonstrates real-world application of cloud-native backend architecture, RESTful API design, AI speech-to-text integration, LLM-based summarization, and modern frontend development.

> **🌐 Live version:** The fully deployed application is accessible at **[https://cloudzadanie2copy.vercel.app](https://cloudzadanie2copy.vercel.app)**. The frontend is hosted on Vercel, the backend on Render, and the database on Neon.tech. The setup instructions in this README describe how to run the project **locally** for development purposes.

---

## ✨ What It Does

1. **Audio Upload & Transcription** — the user uploads a meeting audio file (MP3, WAV, M4A, WEBM, OGG, or OPUS, up to 25 MB). The backend sends it to the **Deepgram Nova-3** model, which returns a full text transcript with smart formatting and automatic language detection.
2. **Transcript Submission** — alternatively, the user can paste a raw transcript directly into the text area, skipping the audio step entirely.
3. **AI Summarization** — the backend calls the [Groq](https://groq.com) API, running Meta's **LLaMA 3.1 8B Instant** model, to generate a brief, readable summary of the meeting.
4. **Action Item Extraction** — a second AI call extracts every concrete task or follow-up from the transcript and formats them as bullet points.
5. **Persistence** — the meeting record (title, transcript, summary, action items, timestamp) is saved to a **PostgreSQL** database via SQLAlchemy.
6. **History & Search** — all saved meetings are listed in a searchable history view with clickable detail cards.
7. **Deletion** — individual meetings can be permanently deleted from both the history list and the detail page.

---

## 🖥️ Main Features

- **Audio-to-text transcription** — upload a recording and let Deepgram Nova-3 convert speech to text automatically
- **Paste & summarize** — submit any meeting transcript directly and get instant AI output
- **Automatic action item extraction** — bullet-point tasks parsed from raw text by LLaMA 3.1
- **Full meeting history** — browse all past meetings in reverse-chronological order
- **Live search** — filter meeting cards by title or summary content
- **Meeting detail view** — read summary, action items, and original transcript in one place
- **Delete meetings** — remove individual records from the database
- **Client-side audio validation** — file type and size checked in the browser before upload
- **Health check endpoint** — `GET /health` for deployment monitoring
- **Interactive API docs** — Swagger UI available at `/docs`
- **Cloud-ready** — deployed on Render with Neon.tech PostgreSQL

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| **Python 3.10+** | Primary language |
| **FastAPI** | High-performance async REST API framework |
| **SQLAlchemy** | ORM for database access |
| **Pydantic v2** | Request/response validation and serialization |
| **Uvicorn** | ASGI server |
| **Groq SDK** | Python client for the Groq inference API (LLaMA 3.1) |
| **Deepgram SDK** (`deepctl`) | Speech-to-text transcription via Deepgram Nova-3 |
| **psycopg2-binary** | PostgreSQL database driver |
| **python-dotenv** | `.env` file loading |
| **httpx** | Async HTTP client |
| **python-multipart** | Multipart form data support for audio file uploads |

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI library |
| **Vite 5** | Lightning-fast dev server and build tool |
| **React Router DOM v6** | Client-side routing |
| **Axios** | HTTP client for REST API calls |
| **CSS Modules** | Scoped component styling |
| **@vitejs/plugin-react** | Babel-based React HMR for Vite |

### Database

| Technology | Purpose |
|---|---|
| **PostgreSQL 16** | Relational database for meeting storage |
| **Neon.tech** | Serverless cloud PostgreSQL (used in production) |
| **Docker / docker-compose** | Local PostgreSQL container for development |

### AI / Cloud Services

| Service | Purpose |
|---|---|
| **Deepgram Nova-3** | Speech-to-text transcription of uploaded audio files |
| **Groq API** (`llama-3.1-8b-instant`) | Meeting summarization and action item extraction |
| **Render** | Backend deployment (PaaS) |

---

## 📁 Project Structure

```
cloudzadanie2/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app entry point — CORS, router registration, table creation
│   │   ├── config.py          # Loads environment variables: DATABASE_URL, DEEPGRAM_API_KEY, GROQ_API_KEY
│   │   ├── database.py        # SQLAlchemy engine, session factory, Base, get_db dependency
│   │   ├── models.py          # ORM model: Meeting table (id, title, transcript, summary, action_items, created_at)
│   │   ├── schemas.py         # Pydantic schemas: MeetingCreate (input) and MeetingResponse (output)
│   │   ├── crud.py            # Database operations: create, list, get by id, delete
│   │   ├── routers/
│   │   │   ├── meetings.py    # /meetings routes: POST /transcribe, POST /text, GET /, GET /{id}, DELETE /{id}
│   │   │   └── health.py      # GET /health — returns {"status": "ok"}
│   │   └── services/
│   │       ├── summarizer.py  # Groq AI client — generate_summary() and extract_action_items()
│   │       └── transcription.py  # Deepgram client — transcribe_audio_file(); validates file type/size, calls Nova-3
│   ├── requirements.txt       # Python dependency list
│   └── .env                   # Environment variables (DATABASE_URL, GROQ_API_KEY, DEEPGRAM_API_KEY)
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # React entry point — mounts App into #root
│   │   ├── App.jsx            # BrowserRouter with three routes: /, /history, /meetings/:id
│   │   ├── index.css          # Global CSS reset and base styles
│   │   ├── api/
│   │   │   └── meetings.js    # Axios API client — submitMeeting, transcribeMeetingAudio, getAllMeetings, getMeetingById, deleteMeeting
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page — manages all form state, audio validation, transcription and submission flow
│   │   │   ├── History.jsx    # Searchable meeting list with delete support
│   │   │   └── MeetingDetails.jsx  # Detail view for a single meeting by ID
│   │   └── components/
│   │       ├── Navbar.jsx          # Top navigation bar with links to Home and History
│   │       ├── MeetingForm.jsx     # Controlled form: title input, audio file picker + transcribe button, transcript textarea
│   │       ├── MeetingResult.jsx   # Renders summary, action items, and original transcript in sections
│   │       ├── MeetingCard.jsx     # Clickable card used in the History grid; includes delete button
│   │       └── LoadingSpinner.jsx  # Animated spinner shown during API calls
│   ├── .env                   # Frontend env: VITE_API_URL (local or Render deployment URL)
│   ├── index.html             # Vite HTML shell
│   ├── vite.config.js         # Vite configuration with React plugin
│   └── package.json           # Frontend dependencies and npm scripts
│
├── docker-compose.yml         # PostgreSQL 16 container for local development
└── README.md                  # This file
```

---

## ⚙️ How It Works

### Path A — Audio Upload

```
User uploads audio file
        │
        ▼
 React (Home.jsx)
 Client-side validation (MIME type, file size ≤ 25 MB)
        │  POST /meetings/transcribe  (multipart/form-data)
        ▼
 FastAPI → transcription.py
        │
        └──► Deepgram Nova-3 API ──► Full text transcript
                                           │
                                    Returned to frontend
                                    → auto-fills transcript textarea
```

### Path B — Transcript Submission

```
User enters title + transcript (typed or auto-filled from audio)
        │  POST /meetings/text  (JSON)
        ▼
 FastAPI → meetings.py router
        │
        ├──► Groq API (LLaMA 3.1 8B) ──► Summary text
        │
        ├──► Groq API (LLaMA 3.1 8B) ──► Action items list
        │
        └──► PostgreSQL (SQLAlchemy) ──► Saved meeting record
                                              │
                                              ▼
                                   JSON response → MeetingResult UI
```

Both paths can be combined: upload audio → transcribe → review/edit transcript → generate summary.

---

## 🚀 Setup Instructions (Local Development)

> The instructions below are for running the project on your own machine. If you just want to use the app, visit **[https://cloudzadanie2.vercel.app](https://cloudzadanie2.vercel.app)** — no setup required.

### Prerequisites

- **PostgreSQL 16** (local via Docker, or a cloud provider like Neon.tech)
- **Python 3.10+**
- **Node.js 18+** and **npm**
- A **Groq API key** — get one free at [console.groq.com](https://console.groq.com)
- A **Deepgram API key** — get one free at [console.deepgram.com](https://console.deepgram.com)

---

### 🐧 Linux / macOS Setup

#### 1. Clone the repository

```bash
git clone <your-repository-url>
cd cloudzadanie2
```

#### 2. Start PostgreSQL (Docker recommended)

```bash
docker-compose up -d
```

This starts a PostgreSQL 16 container on port `5432` with database `meeting_db`, user `postgres`, password `postgres`.

#### 3. Set up the Python backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 4. Configure environment variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meeting_db
GROQ_API_KEY=your_groq_api_key_here
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

#### 5. Run the backend server

```bash
uvicorn app.main:app --reload
```

The API will be available at:
- **REST API:** `http://127.0.0.1:8000`
- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

#### 6. Run the frontend

In a new terminal, create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Then start the dev server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

### 🪟 Windows Setup

This section describes how to set up the project on Windows using **Anaconda** or **Miniconda** for the Python backend, and **Node.js** for the frontend.

#### Step 1 — Install Anaconda or Miniconda

Download and install one of the following:
- **Anaconda** (full distribution): [anaconda.com/download](https://www.anaconda.com/download)
- **Miniconda** (minimal install, recommended): [docs.conda.io/en/latest/miniconda.html](https://docs.conda.io/en/latest/miniconda.html)

After installation, open **Anaconda Prompt** (search for it in the Start menu).

#### Step 2 — Install Node.js

Download the **LTS version** of Node.js from [nodejs.org](https://nodejs.org/en/download) and run the installer. This also installs **npm** automatically.

Verify the installation by opening a new Command Prompt or PowerShell window:

```cmd
node --version
npm --version
```

#### Step 3 — Clone the repository

```cmd
git clone <your-repository-url>
cd cloudzadanie2
```

#### Step 4 — Start PostgreSQL (Docker recommended)

Ensure **Docker Desktop** is installed and running, then:

```cmd
docker-compose up -d
```

Alternatively, you can use a free cloud database like [Neon.tech](https://neon.tech) and skip Docker entirely — just set `DATABASE_URL` in your `.env` to the Neon connection string.

#### Step 5 — Create a Conda virtual environment

In **Anaconda Prompt**, navigate to the backend folder and create a new environment:

```bash
cd backend
conda create -n meeting-env python=3.11 -y
conda activate meeting-env
```

#### Step 6 — Install Python dependencies

With the `meeting-env` environment activated:

```bash
pip install -r requirements.txt
```

#### Step 7 — Configure environment variables

Create a file named `.env` inside the `backend/` folder with the following content:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meeting_db
GROQ_API_KEY=your_groq_api_key_here
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

Replace the placeholder values with your actual API keys from [console.groq.com](https://console.groq.com) and [console.deepgram.com](https://console.deepgram.com).

#### Step 8 — Run the backend (Anaconda Prompt)

Make sure you are in the `backend/` directory with `meeting-env` activated:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

#### Step 9 — Run the frontend (separate terminal)

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Then open a new **Command Prompt** or **PowerShell** window, navigate to the `frontend/` folder, and run:

```cmd
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

> **Summary for Windows:** keep the Anaconda Prompt running `uvicorn app.main:app --reload`, and a separate Command Prompt running `npm run dev`. Both must be active at the same time.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check — returns `{"status": "ok"}` |
| `POST` | `/meetings/transcribe` | Upload audio file → returns transcribed text |
| `POST` | `/meetings/text` | Submit a transcript → returns AI summary + saved meeting |
| `GET` | `/meetings` | List all meetings (newest first) |
| `GET` | `/meetings/{id}` | Get a single meeting by ID |
| `DELETE` | `/meetings/{id}` | Delete a meeting by ID |

### Example — Transcribe Audio

```http
POST /meetings/transcribe
Content-Type: multipart/form-data

file: <audio binary>
```

**Response:**

```json
{
  "text": "Alice said we need to finish the login page by Friday. Bob will handle the API integration..."
}
```

### Example — Create Meeting from Transcript

```http
POST /meetings/text
Content-Type: application/json

{
  "title": "Sprint Planning Q2",
  "transcript": "Alice: We need to finish the login page by Friday. Bob: I'll handle the API integration..."
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Sprint Planning Q2",
  "transcript": "Alice: We need to finish the login page by Friday...",
  "summary": "The team discussed sprint goals for Q2. Alice is responsible for the login page by Friday and Bob will handle the API integration.",
  "action_items": "- Alice to complete the login page by Friday\n- Bob to handle API integration\n- Schedule a follow-up review next Monday",
  "created_at": "2025-04-18T13:04:00Z"
}
```

---

## 🗄️ Database Schema

The application uses a single `meetings` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | `INTEGER` | Auto-incremented primary key |
| `title` | `VARCHAR(255)` | Meeting title entered by the user |
| `transcript` | `TEXT` | Full meeting transcript (typed or Deepgram-generated) |
| `summary` | `TEXT` | AI-generated meeting summary |
| `action_items` | `TEXT` | Extracted action items (newline-separated bullet points) |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | Record creation timestamp (server default) |

In production the database is hosted on **Neon.tech** — a serverless PostgreSQL provider. For local development, the included `docker-compose.yml` spins up a PostgreSQL 16 container.

---

## 🎙️ Speech-to-Text — Deepgram Nova-3

Audio transcription is handled by **Deepgram's Nova-3 model**, accessed via the official Deepgram Python SDK (`deepctl`). The full implementation lives in `backend/app/services/transcription.py`.

### Supported Audio Formats

| Format | MIME Types |
|--------|-----------|
| MP3 | `audio/mpeg`, `audio/mp3` |
| WAV | `audio/wav`, `audio/x-wav` |
| M4A | `audio/mp4`, `audio/x-m4a` |
| WEBM | `audio/webm` |
| OGG | `audio/ogg` |
| OPUS | `audio/opus` |

**Maximum file size:** 25 MB

### Transcription Features

The Deepgram call is configured with the following options:

```python
response = deepgram.listen.v1.media.transcribe_file(
    request=audio_bytes,
    model="nova-3",
    smart_format=True,    # Adds punctuation, capitalisation, and formatting
    detect_language=True, # Automatically identifies the spoken language
)
```

- **`nova-3`** — Deepgram's most accurate and fastest general-purpose model
- **`smart_format`** — automatically applies punctuation, capitalisation, number formatting, and paragraph structure to the raw transcript
- **`detect_language`** — identifies the language spoken without requiring any configuration

### Validation & Error Handling

Before the file is sent to Deepgram, the backend performs strict validation:

- Content-type must be one of the supported MIME types (HTTP 400 if not)
- File extension must match a supported format (HTTP 400 if not)
- File content must not be empty (HTTP 400)
- File size must not exceed 25 MB (HTTP 400)
- `DEEPGRAM_API_KEY` must be present in the environment (HTTP 500 if missing)
- If Deepgram returns an empty transcript, an HTTP 422 error is raised with a descriptive message
- All other exceptions are caught and surfaced as HTTP 500 with the original error message
- The temporary file written to disk is always deleted in a `finally` block, regardless of success or failure

### Frontend Integration

The `MeetingForm` component includes a dedicated **Audio Upload** section with a file picker and a **"Transcribe Audio"** button. Client-side validation mirrors the backend rules (type check and 25 MB size check) and shows inline error messages before the request is even sent. Once transcription completes, the resulting text is automatically populated into the transcript textarea, where the user can review or edit it before generating the summary.

---

## 🤖 AI Summarization — Groq + LLaMA 3.1

Meeting summarization and action item extraction are handled by the **Groq** inference API running Meta's **LLaMA 3.1 8B Instant** model. The full implementation lives in `backend/app/services/summarizer.py`.

Two separate prompts are sent per meeting submission:

**Summarization:**

```
System: "Summarize this meeting briefly."
User:   <transcript>
```

**Action item extraction:**

```
System: "Extract action items as bullet points."
User:   <transcript>
```

Both calls use the `llama-3.1-8b-instant` model — optimised for low-latency inference, making it well suited for interactive summarization workflows.

---

## 🐳 Docker

A `docker-compose.yml` is included to start a local PostgreSQL 16 instance:

```yaml
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: meeting_db
```

Start the database:

```bash
docker-compose up -d
```

Stop and remove:

```bash
docker-compose down
```

---

## ☁️ Deployment

The application is deployed on the following services:

- **Backend:** [Render](https://render.com) — `https://cloudzadanie2.onrender.com`
- **Database:** [Neon.tech](https://neon.tech) — serverless PostgreSQL, `eu-central-1` region
- **Frontend:** can be deployed on Vercel, Netlify, or Render Static Sites

To point the frontend at the deployed backend, set the following in `frontend/.env`:

```env
VITE_API_URL=https://cloudzadanie2.onrender.com
```

---

## 👥 Team Members

| Name | Role |
|------|------|
| **Anatolii Vasylov** | Team Lead |
| **Viktor Uhrynchuk** | Developer |
| **Volodymyr Mishchuk** | Developer |

---

## 📚 Documentation

The `docs/` folder contains:
- `api.md` — API reference
- `architecture.md` — architecture diagram and design decisions
- `team-contributions.md` — individual contribution breakdown

---

## 🎓 Course

**Cloud Technologies Project** — demonstrates multi-tier cloud application design, AI speech-to-text and LLM integration, serverless database hosting, PaaS deployment, and full-stack web development.
