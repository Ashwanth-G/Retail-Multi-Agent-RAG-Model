import { useEffect, useRef } from "react";
import { Message, ChatUser } from "@/types/chat";
import { ChatMessage } from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatAreaProps {
  messages: Message[];
  user?: ChatUser;
}

export const ChatArea = ({ messages, user }: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-4">
      <div ref={scrollRef} className="max-w-4xl mx-auto py-6 space-y-6">
          {messages.length === 0 ? (
            <ChatMessage
              message={{
                id: "welcome-1",
                role: "bot",
                timestamp: new Date(),
                content:
                  "👋 Welcome to Retail Assistant! Ask me anything and I'll recommend the best products for you.",
              }}
              user={user}
            />
          ) : (
          messages.map((message) => (
            <div key={message.id}>

              {/* PRODUCT RESULT MESSAGE */}
              {message.type === "products" ? (
                <div className="space-y-4">

                  {/* Product Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {message.products?.map((p) => (
                      <div
                        key={p.id}
                        className="border rounded-xl p-4 shadow-sm bg-white dark:bg-gray-800"
                      >
                        <h3 className="font-semibold text-lg">{p.name}</h3>

                        {p.brand && (
                          <p className="text-sm text-muted-foreground">{p.brand}</p>
                        )}

                        <p className="text-sm mt-1">
                          Category: <span className="font-medium">{p.category}</span>
                        </p>

                        <p className="text-sm font-semibold mt-1">
                          Price: ₹{p.price}
                        </p>

                        {p.rating && (
                          <p className="text-xs mt-1">Rating: ⭐ {p.rating}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary Under Cards */}
                  <ChatMessage
                    message={{
                      id: message.id + "-summary",
                      role: "bot",
                      timestamp: message.timestamp, // keep same timestamp
                      content:
                        message.summary ??
                        "Here are the best options I found based on your query!",
                    }}
                    user={user}
                  />
                </div>
              ) : (
                /* NORMAL CHAT MESSAGE */
                <ChatMessage message={message} user={user} />
              )}

            </div>
          ))
        )}

      </div>
    </ScrollArea>
  );
};
