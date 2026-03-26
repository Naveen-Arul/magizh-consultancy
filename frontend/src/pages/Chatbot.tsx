import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const quickQueries = [
  "Is Paracetamol available?",
  "Which medicines are near expiry?",
  "Check stock of Amoxicillin",
  "Show me low stock medicines",
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: "bot",
      text: "Hello! I'm the MagizhHealDesk AI stock enquiry assistant. Ask me about medicine availability, stock levels, or expiry dates. I have real-time access to your inventory!",
    },
  ]);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: nextId, from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chatbot/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to get response");
      }

      const botMsg: Message = {
        id: nextId + 1,
        from: "bot",
        text: data.message || "Sorry, I couldn't process that query.",
      };

      setMessages((prev) => [...prev, botMsg]);
      setNextId((n) => n + 2);
    } catch (error: any) {
      console.error("Chatbot error:", error);
      const errorMsg: Message = {
        id: nextId + 1,
        from: "bot",
        text: `Warning: ${error.message || "Unable to connect to AI service. Please check if the backend server is running and the AI key is configured."}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
      setNextId((n) => n + 2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-0 flex-1 flex-col pb-4">
      <section className="page-surface flex min-h-[calc(100vh-13.5rem)] flex-1 flex-col overflow-hidden">
        <div className="border-b bg-card/70 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary shadow-card">
                <MessageCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                  AI Stock Enquiry Chatbot
                </h1>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Powered by Groq AI • Real-time inventory data
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Inventory-aware answers", "Expiry checks", "Availability lookup"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="mx-auto flex max-w-4xl flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.from === "user" ? "justify-end" : ""}`}>
                  {msg.from === "bot" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[80%] ${
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border bg-card shadow-sm"
                    }`}
                  >
                    {msg.from === "bot" ? (
                      <div className="text-sm">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="mb-3 leading-relaxed text-foreground last:mb-0">{children}</p>
                            ),
                            ul: ({ children }) => <ul className="mb-3 ml-0 space-y-2 last:mb-0">{children}</ul>,
                            ol: ({ children }) => (
                              <ol className="mb-3 ml-4 list-decimal space-y-2 last:mb-0">{children}</ol>
                            ),
                            li: ({ children }) => (
                              <li className="flex gap-2 text-foreground">
                                <span className="text-primary">•</span>
                                <span className="flex-1">{children}</span>
                              </li>
                            ),
                            strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                            em: ({ children }) => <em className="font-medium text-primary">{children}</em>,
                            code: ({ children }) => (
                              <code className="rounded bg-accent px-1.5 py-0.5 text-xs font-mono text-foreground">
                                {children}
                              </code>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mb-3 mt-4 flex items-center gap-2 text-base font-bold text-foreground">
                                {children}
                              </h3>
                            ),
                            h4: ({ children }) => <h4 className="mb-2 mt-3 font-semibold text-foreground">{children}</h4>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                                {children}
                              </blockquote>
                            ),
                            table: ({ children }) => (
                              <div className="my-4 overflow-x-auto rounded-lg border">
                                <table className="w-full border-collapse text-sm">{children}</table>
                              </div>
                            ),
                            thead: ({ children }) => <thead className="bg-primary/10">{children}</thead>,
                            tbody: ({ children }) => <tbody className="divide-y">{children}</tbody>,
                            tr: ({ children }) => (
                              <tr className="transition-colors hover:bg-accent/50">{children}</tr>
                            ),
                            th: ({ children }) => (
                              <th className="border-b border-border px-4 py-2.5 text-left font-semibold text-foreground">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="border-b border-border px-4 py-2.5 text-foreground">{children}</td>
                            ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {msg.from === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Analyzing stock data...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t bg-card/80 px-4 py-3 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Quick prompts
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    disabled={loading}
                    className="shrink-0 rounded-full border bg-background px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t bg-card px-4 py-4 shadow-lg sm:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                  placeholder="Ask about medicine availability, stock levels, or expiry dates..."
                  disabled={loading}
                  className="min-w-0 flex-1 rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  onClick={() => send(input)}
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:self-stretch"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Press Enter to send. Ask about stock, batches, shortages, or upcoming expiry.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chatbot;
