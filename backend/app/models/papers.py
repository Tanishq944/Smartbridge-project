from pydantic import BaseModel
from typing import Optional, List


class PaperImport(BaseModel):
    title: str
    abstract: str
    authors: Optional[str] = None
    source_id: Optional[str] = None  # e.g., arXiv/DOI


class Paper(BaseModel):
    id: int
    title: str
    abstract: str
    authors: Optional[str] = None
    owner_id: int

    class Config:
        orm_mode = True


class PaperSearchResult(BaseModel):
    title: str
    abstract: str
    authors: Optional[str] = None
    source_id: Optional[str] = None


class PaperSearchResponse(BaseModel):
    papers: List[PaperSearchResult]
