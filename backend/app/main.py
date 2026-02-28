from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, papers, chat

app = FastAPI(title="ResearchHub AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(papers.router)
app.include_router(chat.router)
