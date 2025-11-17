import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";

const History = () => {
  const conversations = [
    {
      id: 1,
      title: "Product recommendation for summer collection",
      date: new Date(2025, 0, 15, 14, 30),
      messageCount: 12,
    },
    {
      id: 2,
      title: "Help with size selection",
      date: new Date(2025, 0, 15, 10, 15),
      messageCount: 8,
    },
    {
      id: 3,
      title: "Return policy inquiry",
      date: new Date(2025, 0, 14, 16, 45),
      messageCount: 6,
    },
    {
      id: 4,
      title: "Gift suggestions for anniversary",
      date: new Date(2025, 0, 14, 9, 20),
      messageCount: 15,
    },
    {
      id: 5,
      title: "Color matching advice",
      date: new Date(2025, 0, 13, 11, 30),
      messageCount: 10,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Chat History</h1>
        <p className="text-muted-foreground mt-1">Review your past conversations</p>
      </div>

      <div className="space-y-3">
        {conversations.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{conversation.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(conversation.date, 'MMM d, yyyy • HH:mm')}
                      </span>
                      <span>{conversation.messageCount} messages</span>
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;
