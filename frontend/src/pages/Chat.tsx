// 🔥 Chat.tsx — FULL FIXED VERSION
import { useState, useEffect } from "react";
import { Message, ChatUser } from "@/types/chat";
import { ChatArea } from "@/components/chat/ChatArea";
import { ChatInput } from "@/components/chat/ChatInput";
import { LoadingAnimation } from "@/components/dashboard/LoadingAnimation";
import { getRecommendations } from "@/lib/recommend";
import axios from "axios";

const mockUser: ChatUser = {
  id: "user-1",
  name: "John Doe",
  avatar: "",
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // ⚡ NEW: store sessionId returned by backend
  const [sessionId, setSessionId] = useState<string | null>(null);

  // ------------------------------------------------------
  // 1️⃣ CREATE A SESSION + LOAD HISTORY
  // ------------------------------------------------------
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // CREATE SESSION
        const sessionRes = await axios.post("http://localhost:8000/session", {
          userId: "user-1",
        });

        const newSessionId = sessionRes.data._id;
        setSessionId(newSessionId);

        // LOAD HISTORY FOR THIS SESSION
        const historyRes = await axios.get(
          `http://localhost:8000/history/${newSessionId}`
        );

        const history = historyRes.data;

        if (!history || history.length === 0) {
          setMessages([
            {
              id: "welcome-1",
              role: "bot",
              timestamp: new Date(),
              content:
                "👋 Welcome to Retail Assistant! Ask me anything to get personalized recommendations.",
            },
          ]);
        } else {
          setMessages(history);
        }
      } catch (err) {
        console.error("Error initializing chat:", err);
      }

      setIsInitialLoading(false);
    };

    initializeChat();
  }, []);

  // ------------------------------------------------------
  // 2️⃣ HANDLE SENDING MESSAGE
  // ------------------------------------------------------
  const handleSendMessage = async (content: string) => {
    if (!sessionId) return alert("No session available!");

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // SAVE USER MESSAGE
    await axios.post("http://localhost:8000/message", {
      sessionId,
      role: "user",
      content,
    });

    setIsLoading(true);

    // Loading placeholder
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "bot",
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // GET RECOMMENDATIONS
      const response = await getRecommendations({
        query: content,
        user_id: "user-1",
        top_k: 5,
      });

      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "bot",
        timestamp: new Date(),
        type: "products",
        products: response.results,
        content: "",
      };

      // Remove loading & add bot message
      setMessages((prev) =>
        prev.filter((msg) => !msg.isLoading).concat(botMessage)
      );

      // SAVE BOT MESSAGE
      await axios.post("http://localhost:8000/message", {
        sessionId,
        role: "assistant",
        content: "Recommended products",
      });
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        content: "❌ Error fetching recommendations.",
        role: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) =>
        prev.filter((msg) => !msg.isLoading).concat(errorMessage)
      );
    }

    setIsLoading(false);
  };

  // ------------------------------------------------------
  // 3️⃣ INITIAL LOADING SCREEN
  // ------------------------------------------------------
  if (isInitialLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <LoadingAnimation text="Initializing AI assistant..." />
      </div>
    );
  }

  // ------------------------------------------------------
  // 4️⃣ RENDER CHAT UI
  // ------------------------------------------------------
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <ChatArea messages={messages} user={mockUser} />
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default Chat;
