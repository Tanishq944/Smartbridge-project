from groq import Groq
from typing import List, Dict
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# In-memory context store (simple version)
workspace_memory: Dict[str, List[dict]] = {}


def chat_with_agent(workspace_id: str, message: str):
    if workspace_id not in workspace_memory:
        workspace_memory[workspace_id] = []

    history = workspace_memory[workspace_id]

    history.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=history,
        temperature=0.5,
    )

    reply = response.choices[0].message.content

    history.append({"role": "assistant", "content": reply})

    return reply
