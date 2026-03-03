import React, { useState } from "react";
import { apiFetch } from "./api";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);

  const send = async () => {
    const res = await apiFetch("/chat/chat?workspace_id=1", {
      method: "POST",
      body: JSON.stringify({ content: message })
    });

    setResponses([
      ...responses,
      { user: message, bot: res.response }
    ]);

    setMessage("");
  };

  return (
    <div>
      <h3>Chat With Papers</h3>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={send}>Send</button>

      <div>
        {responses.map((r, index) => (
          <div key={index}>
            <p><b>You:</b> {r.user}</p>
            <p><b>AI:</b> {r.bot}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
