# Smart Meeting Summarizer

Smart Meeting Summarizer is a cloud-based web application for processing meeting recordings and transcripts. The application allows users to upload meeting audio or text, automatically generates a summary, extracts key discussion points, and creates a list of action items.

This project was created for the Cloud Technologies course and demonstrates the use of multiple cloud services, database integration, and AI-based processing.

---

## Main Features

- Upload meeting transcript or audio
- Automatic meeting summarization
- Extraction of action items
- Storage of processed meetings in a database
- REST API for frontend communication
- Cloud-ready backend deployment

---

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database
- PostgreSQL

### Cloud Services
- Hosting provider: Azure / Render / other PaaS
- External AI/Speech provider: OpenAI API, AWS Transcribe, or Google Speech-to-Text

---

## Project Structure

backend/
│
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── routers/
│   │   ├── meetings.py
│   │   └── health.py
│   └── services/
│       ├── summarizer.py
│       └── transcription.py
│
├── requirements.txt
└── .env

---

## How It Works

1. The user uploads a meeting transcript or audio file
2. The backend processes the input
3. Audio is transcribed using a cloud speech-to-text service
4. The text is sent to an AI service for summarization
5. Summary and action items are stored in the database
6. Results are returned to the user

---

## Setup Instructions

### 1. Clone repository

git clone <your-repository-url>
cd backend

### 2. Create virtual environment

python -m venv venv

Activate:

Windows:
venv\Scripts\activate

Linux / macOS:
source venv/bin/activate

### 3. Install dependencies

pip install -r requirements.txt

### 4. Create .env file

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/meeting_db  
OPENAI_API_KEY=api_key  
SPEECH_API_KEY=api_key  

### 5. Run server

uvicorn app.main:app --reload

API доступний:
http://127.0.0.1:8000

Swagger:
http://127.0.0.1:8000/docs

---

## API Endpoints

GET /health  
POST /meetings  
GET /meetings  
GET /meetings/{id}

---

## Database

The application stores:
- meeting title
- transcript
- summary
- action items
- created date

---

## AI and Dataset

The application does not train its own model.

It uses external AI services for:
- speech-to-text
- summarization
- task extraction

### Input Data
- user uploaded audio
- user uploaded text

For testing:
AMI Meeting Corpus can be used.

---

## Deployment

Planned deployment:
- Azure App Service / Render / Railway

External APIs are accessed via REST.

---

## Team Members

- Anatolii Vasylov — Team Lead
- Viktor Uhrynchuk
- Volodymyr Mishchuk

---

## Documentation

Includes:
- analysis
- architecture diagram
- tech justification
- team contributions
- usage instructions

---

## Course

Cloud Technologies Project
