from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# =========================================================
# Create FastAPI app FIRST
# =========================================================
app = FastAPI(title="ResearchHub AI Backend")

# =========================================================
# CORS (for React frontend)
# =========================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# Import routers AFTER app creation
# =========================================================
from app.routers import auth, papers, chat

# =========================================================
# Include routers
# =========================================================
app.include_router(auth.router)
app.include_router(papers.router)
app.include_router(chat.router)
