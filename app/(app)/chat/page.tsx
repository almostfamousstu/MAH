"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">AI Assistant</h1>
        <p className="mt-2 text-sm text-slate-400">
          Ask questions about automation workflows, incidents, best practices, and more.
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-4xl"></div>
              <p className="text-lg font-semibold text-slate-300">Start a conversation</p>
              <p className="mt-2 text-sm text-slate-500">
                Ask me anything about the Micro Automation Hub platform
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-accent/20 text-slate-100 border border-accent/30"
                      : "bg-slate-800/60 text-slate-200 border border-slate-700/50"
                  }`}
                >
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {message.role === "user" ? "You" : "AI Assistant"}
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Customize link styling
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            className="text-accent hover:text-accent/80 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ),
                        // Customize code block styling
                        code: ({ node, className, children, ...props }: any) => {
                          const isInline = !className;
                          return isInline ? (
                            <code
                              {...props}
                              className="rounded bg-slate-700/50 px-1 py-0.5 text-xs font-mono text-accent"
                            >
                              {children}
                            </code>
                          ) : (
                            <code
                              {...props}
                              className="block rounded-lg bg-slate-900 p-3 text-xs font-mono overflow-x-auto"
                            >
                              {children}
                            </code>
                          );
                        },
                        // Customize list styling
                        ul: ({ node, ...props }) => (
                          <ul {...props} className="list-disc list-inside space-y-1" />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol {...props} className="list-decimal list-inside space-y-1" />
                        ),
                        // Customize paragraph spacing
                        p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
                        // Customize headings
                        h1: ({ node, ...props }) => (
                          <h1 {...props} className="text-lg font-bold mb-2 text-slate-100" />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 {...props} className="text-base font-bold mb-2 text-slate-100" />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 {...props} className="text-sm font-bold mb-1 text-slate-100" />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl border border-slate-700/50 bg-slate-800/60 px-4 py-3">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    AI Assistant
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-accent"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-accent delay-75"></div>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-accent delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/50 bg-red-500/10 p-4">
            <p className="text-sm font-semibold text-red-400">Error</p>
            <p className="mt-1 text-xs text-red-300">{error.message}</p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-xl border border-accent/50 bg-accent/10 px-6 py-3 text-sm font-semibold text-accent transition hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Powered by OpenAI GPT-4o • Supplied by DeepCurrents
        </p>
      </form>
    </div>
  );
}
