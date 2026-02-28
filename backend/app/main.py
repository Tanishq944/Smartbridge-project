from fastapi import FastAPI

from app.routers import auth, papers, chat

app = FastAPI(title="ResearchHub AI Backend")

app.include_router(auth.router)
app.include_router(papers.router)
app.include_router(chat.router)
