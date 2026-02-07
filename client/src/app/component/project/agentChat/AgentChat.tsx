'use client';

import { useState } from 'react';


type ToolPart = {
  type: 'tool-db' | 'tool-schema';
  input?: any;
  output?: any;
  state?: 'input-streaming' | 'output-available';
};

type TextPart = {
  type: 'text';
  text: string;
};

type StepPart = {
  type: 'step-start';
};

type MessagePart = ToolPart | TextPart | StepPart;

type Message = {
  role: 'user' | 'assistant';
  parts: MessagePart[];
};

export default function AgentChat(accessToken:any) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    // 1️⃣ User message
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        parts: [{ type: 'text', text: input }],
      },
    ]);

    setInput('');
    setLoading(true);

    const res = await fetch('http://localhost:4000/api/user/agentChat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
        'authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODMxYWY2NTU4NzI3MDk1NzdhZWJjOSIsImVtYWlsIjoiZGVlcDE5OTkzMjRAZ21haWwuY29tIiwiaWF0IjoxNzcwNDUxNDg3LCJleHAiOjE3NzA0NTUwMjd9.GFMxQ-cPj-uMYouNgpNK7yIanQaUoulr-pEjjnSH-TI`
       },
      body: JSON.stringify({
        message: [{ role: 'user', content: input }],
      }),
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    // 2️⃣ Assistant message placeholder
    let assistantMessage: Message = {
      role: 'assistant',
      parts: [],
    };

    setMessages((prev) => [...prev, assistantMessage]);

    let currentText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const events = chunk.split('\n\n');

      for (const event of events) {
        if (!event.startsWith('data:')) continue;

        const data = event.replace('data:', '').trim();
        if (!data) continue;

        const parsed = JSON.parse(data);

        /* ---------- AI TEXT ---------- */
        if (parsed.type === 'text-delta') {
          currentText += parsed.text ?? '';

          const existingText = assistantMessage.parts.find(
            (p) => p.type === 'text'
          ) as TextPart | undefined;

          if (existingText) {
            existingText.text = currentText;
          } else {
            assistantMessage.parts.push({
              type: 'text',
              text: currentText,
            });
          }

          setMessages((prev) => [...prev.slice(0, -1), { ...assistantMessage }]);
        }

        /* ---------- STEP ---------- */
        if (parsed.type === 'step-start') {
          assistantMessage.parts.push({ type: 'step-start' });
          setMessages((prev) => [...prev.slice(0, -1), { ...assistantMessage }]);
        }

        /* ---------- TOOL CALL (QUERY) ---------- */
        if (parsed.type === 'tool-call') {
          assistantMessage.parts.push({
            type: `tool-${parsed.toolName}`,
            input: parsed.args,
            state: 'input-streaming',
          });

          setMessages((prev) => [...prev.slice(0, -1), { ...assistantMessage }]);
        }

        /* ---------- TOOL RESULT ---------- */
        if (parsed.type === 'tool-result') {
          const tool = assistantMessage.parts
            .slice()
            .reverse()
            .find((p) => p.type === `tool-${parsed.toolName}`) as ToolPart;

          if (tool) {
            tool.output = parsed.result;
            tool.state = 'output-available';
          }

          setMessages((prev) => [...prev.slice(0, -1), { ...assistantMessage }]);
        }
      }
    }

    setLoading(false);
  }

  return (
    <div>

    <div className="max-w-[90%] mx-auto p-6 flex flex-col items-center min-h-screen bg-blue-500">
      <h1 className="text-4xl font-semibold mb-4">AI SQL Assistant</h1>
      <div className='min-w-3xl m-4 bg-amber-300 '>
      <div className="space-y-6 m-">
        {messages.map((msg, i) => (
          <div key={i}>
            <div className="text-sm font-semibold mb-1">
              {msg.role === 'user' ? 'User' : 'Assistant'}
            </div>

            <div className="space-y-2">
              {msg.parts.map((part, j) => {
                /* ---------- TEXT ---------- */
                if (part.type === 'text') {
                  return (
                    <div key={j} className="whitespace-pre-wrap">
                      {part.text}
                    </div>
                  );
                }

                /* ---------- DB TOOL ---------- */
                if (part.type === 'tool-db') {
                  return (
                    <div
                      key={j}
                      className="p-3 border rounded bg-blue-50"
                    >
                      <div className="font-semibold">Generated SQL Query</div>

                      {part.input?.query && (
                        <pre className="text-xs mt-2 bg-white p-2 rounded">
                          {part.input.query}
                        </pre>
                      )}

                      {part.state === 'output-available' && (
                        <div className="text-sm text-green-700 mt-1">
                          Query processed
                        </div>
                      )}
                    </div>
                  );
                }

                /* ---------- SCHEMA TOOL ---------- */
                if (part.type === 'tool-schema') {
                  return (
                    <div
                      key={j}
                      className="p-3 border rounded bg-purple-50"
                    >
                      Schema loaded
                    </div>
                  );
                }

                /* ---------- STEP ---------- */
                if (part.type === 'step-start') {
                  return (
                    <div key={j} className="text-sm text-gray-500">
                      Processing...
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your database..."
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Send
        </button>
      </div>
      </div>
    </div>

    </div>
  );
}
