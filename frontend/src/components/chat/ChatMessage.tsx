import { Message, ChatUser } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
  user?: ChatUser;
}

export const ChatMessage = ({ message, user }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-accent text-accent-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-chat-user-bg text-chat-user-fg rounded-tr-sm'
              : 'bg-chat-bot-bg text-chat-bot-fg border border-border rounded-tl-sm'
          }`}
        >
          {message.isLoading ? (
            <div className="flex gap-1 py-1">
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {format(message.timestamp, 'HH:mm')}
        </span>
      </div>
    </div>
  );
};
