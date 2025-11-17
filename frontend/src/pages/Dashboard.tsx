import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, TrendingUp, Users, ShoppingCart, Zap, Target, Award } from "lucide-react";
import { AnimatedSearchBar } from "@/components/dashboard/AnimatedSearchBar";
import { LoadingAnimation, SkeletonCard } from "@/components/dashboard/LoadingAnimation";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      title: "Total Conversations",
      value: "1,234",
      change: "+12.3%",
      icon: MessageSquare,
    },
    {
      title: "Active Users",
      value: "856",
      change: "+8.1%",
      icon: Users,
    },
    {
      title: "Recommendations Made",
      value: "3,456",
      change: "+23.5%",
      icon: TrendingUp,
    },
    {
      title: "Products Sold",
      value: "892",
      change: "+15.2%",
      icon: ShoppingCart,
    },
  ];

  if (isLoading) {
    return <LoadingAnimation text="Loading your dashboard..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section with Animated Search */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative px-6 pt-12 pb-16">
          <div className="max-w-4xl mx-auto text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-in">
              <Zap className="h-4 w-4" />
              AI-Powered Retail Assistant
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Find Anything You Need
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get personalized recommendations powered by advanced AI
            </p>
          </div>
          
          <AnimatedSearchBar />
          
          {/* Quick Stats */}
          <div className="max-w-4xl mx-auto mt-12 grid grid-cols-3 gap-6 text-center">
            {[
              { icon: Target, label: "Accuracy", value: "98%" },
              { icon: MessageSquare, label: "Conversations", value: "10K+" },
              { icon: Award, label: "Satisfaction", value: "4.9/5" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="animate-slide-up p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 pb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat, i) => (
            <Card
              key={stat.title}
              className="animate-fade-in hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2 animate-fade-in" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest conversations and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { text: "Customer inquired about product recommendations", time: "2 hours ago" },
                  { text: "New product catalog update completed", time: "5 hours ago" },
                  { text: "AI model improved recommendation accuracy", time: "1 day ago" },
                ].map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-muted/50 to-transparent hover:from-muted hover:shadow-md transition-all duration-300 group cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {activity.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { title: "Start New Chat", desc: "Begin a new conversation", icon: MessageSquare },
                  { title: "View Analytics", desc: "Check performance metrics", icon: TrendingUp },
                  { title: "Manage Products", desc: "Update product catalog", icon: ShoppingCart },
                ].map((action) => (
                  <button
                    key={action.title}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 hover:to-primary/5 transition-all duration-300 hover:shadow-md hover:scale-[1.02] group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <action.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm group-hover:text-primary transition-colors">
                          {action.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{action.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
