from fastapi import APIRouter, Depends

from app.models.user import User
from app.models.chat import ChatMessage
from app.routers.auth import get_current_user
from app.utils.groq_client import client, MODEL_CONFIG
from app.models.papers import Paper
from app.routers.papers import fake_papers_db

router = APIRouter(prefix="/chat", tags=["chat"])


async def get_workspace_papers(workspace_id: int, owner_id: int) -> list[Paper]:
    # TODO: Replace with real DB query filtered by workspace_id and owner_id
    # For now, just return all papers belonging to the user
    return [
        Paper(**p) for p in fake_papers_db
        if p["owner_id"] == owner_id
    ]


def create_research_context(papers: list[Paper], user_query: str) -> str:
    # Simple context: concatenated titles & abstracts
    snippets = []
    for p in papers:
        snippets.append(f"Title: {p.title}\nAbstract: {p.abstract}")
    context = "\n\n".join(snippets)
    return context or "No papers available in this workspace."


async def store_conversation(workspace_id: int, user_msg: str, ai_msg: str) -> None:
    # TODO: Persist conversation to DB; for now, this is a no-op
    pass


@router.post("/chat")
async def chat_with_papers(
    message: ChatMessage,
    workspace_id: int,
    current_user: User = Depends(get_current_user),
):
    workspace_papers = await get_workspace_papers(workspace_id, current_user.id)
    context = create_research_context(workspace_papers, message.content)

    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f"You are a research assistant. Context: {context}",
            },
            {"role": "user", "content": message.content},
        ],
        **MODEL_CONFIG,
    )

    answer = response.choices[0].message.content
    await store_conversation(workspace_id, message.content, answer)

    return {"response": answer}
