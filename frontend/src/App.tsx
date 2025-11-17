import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import History from "./pages/History";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import RecommendPage from "./pages/Recommend";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full bg-background">
            <DashboardSidebar />
            <div className="flex-1 flex flex-col">
              <DashboardHeader />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/recommend" element={<RecommendPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
