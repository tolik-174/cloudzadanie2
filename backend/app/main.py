from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import health, meetings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Meeting Summarizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(meetings.router)


@app.get("/")
def root():
    return {"message": "API is running"}