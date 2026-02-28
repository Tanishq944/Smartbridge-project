from fastapi import APIRouter, Depends

from app.models.user import User
from app.models.papers import PaperImport, PaperSearchResponse, PaperSearchResult, Paper
from app.routers.auth import get_current_user

router = APIRouter(prefix="/papers", tags=["papers"])

# Temporary in-memory storage
fake_papers_db: list[dict] = []


async def query_academic_databases(query: str) -> list[PaperSearchResult]:
    # TODO: Integrate real external academic APIs (e.g., Semantic Scholar)
    # For now, return a dummy example
    return [
        PaperSearchResult(
            title=f"Example paper for '{query}'",
            abstract="This is a placeholder abstract for demonstration.",
            authors="Doe et al.",
            source_id="example-123",
        )
    ]


async def store_paper(paper_data: PaperImport, owner_id: int) -> Paper:
    paper_id = len(fake_papers_db) + 1
    record = {
        "id": paper_id,
        "title": paper_data.title,
        "abstract": paper_data.abstract,
        "authors": paper_data.authors,
        "owner_id": owner_id,
    }
    fake_papers_db.append(record)
    return Paper(**record)


@router.get("/search", response_model=PaperSearchResponse)
async def search_papers(query: str, current_user: User = Depends(get_current_user)):
    search_results = await query_academic_databases(query)
    return PaperSearchResponse(papers=search_results)


@router.post("/import")
async def import_paper(paper_data: PaperImport, current_user: User = Depends(get_current_user)):
    imported_paper = await store_paper(paper_data, current_user.id)
    return {"message": "Paper imported successfully", "paper": imported_paper}
