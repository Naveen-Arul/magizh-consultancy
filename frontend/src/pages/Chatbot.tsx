import { useState } from "react";
import { MessageCircle, Send, Maximize2, Minimize2, Bot, User } from "lucide-react";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
}

const sampleReplies: Record<string, string> = {
  "is paracetamol available": "Yes, Paracetamol is available. We have 200 units (Batch B001, Expiry 2026-12-01) and 50 units (Batch B002, Expiry 2026-04-15).",
  "which medicines are near expiry": "The following medicines are near expiry:\n• Cetirizine — Expiry: 2026-03-05 (3 units)\n• Paracetamol — Expiry: 2026-04-15 (50 units)\n• Omeprazole — Expiry: 2026-05-01 (15 units)",
  "check stock of amoxicillin": "Amoxicillin: 8 units remaining (Batch B003, Expiry 2026-08-20). ⚠️ Low stock — consider reordering.",
  "low stock medicines": "Medicines with low stock (≤20 units):\n• Amoxicillin — 8 units\n• Cetirizine — 3 units\n• Omeprazole — 15 units",
};

function getReply(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, val] of Object.entries(sampleReplies)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return "I can help you check medicine availability, stock levels, and expiry dates. Try asking:\n• \"Is Paracetamol available?\"\n• \"Which medicines are near expiry?\"\n• \"Low stock medicines\"";
}

const quickQueries = [
  "Is Paracetamol available?",
  "Which medicines are near expiry?",
  "Check stock of Amoxicillin",
  "Low stock medicines",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, from: "bot", text: "Hello! I'm the MagizhHealDesk stock enquiry assistant. Ask me about medicine availability, stock levels, or expiry dates." },
  ]);
  const [input, setInput] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [nextId, setNextId] = useState(1);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: nextId, from: "user", text };
    const botMsg: Message = { id: nextId + 1, from: "bot", text: getReply(text) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setNextId((n) => n + 2);
    setInput("");
  };

  return (
    <div className={`${fullscreen ? "fixed inset-0 z-50 bg-background" : "container py-10"}`}>
      {/* Header */}
      {!fullscreen && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Stock Enquiry Chatbot</h1>
          </div>
          <div className="rounded-lg border bg-accent/50 p-4">
            <p className="text-sm text-muted-foreground">
              This internal chatbot helps pharmacy staff quickly check medicine availability, stock quantity, and expiry details without navigating inventory tables.
              <span className="mt-1 block font-medium text-foreground">Internal Use Only — Pharmacy Staff Assistant</span>
            </p>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className={`flex flex-col rounded-xl border bg-card shadow-card ${fullscreen ? "h-full" : "h-[520px]"}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-heading text-sm font-semibold text-foreground">MagizhHealDesk Assistant</span>
          </div>
          <button onClick={() => setFullscreen(!fullscreen)} className="rounded p-1.5 text-muted-foreground hover:bg-accent">
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.from === "user" ? "justify-end" : ""}`}>
              {msg.from === "bot" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm whitespace-pre-line ${
                  msg.from === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-foreground"
                }`}
              >
                {msg.text}
              </div>
              {msg.from === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Queries */}
        <div className="flex gap-2 overflow-x-auto border-t px-4 py-2">
          {quickQueries.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t p-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask about medicine availability..."
              className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => send(input)}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-primary-foreground hover:shadow-card-hover"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
