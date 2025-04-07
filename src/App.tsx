
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Tasks from "./pages/Tasks";
import TimeBlocks from "./pages/TimeBlocks";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Insights from "./pages/Insights";
import Notifications from "./pages/Notifications";
import AiCoach from "./pages/AiCoach";
import FlowState from "./pages/FlowState";
import IdeaGenerator from "./pages/IdeaGenerator";
import ProductivityAi from "./pages/ProductivityAi";
import AiFeedback from "./pages/AiFeedback";
import HabitBuilder from "./pages/HabitBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tasks" element={<MainLayout><Tasks /></MainLayout>} />
          <Route path="/timeblocks" element={<MainLayout><TimeBlocks /></MainLayout>} />
          <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/assistant" element={<MainLayout><Assistant /></MainLayout>} />
          <Route path="/insights" element={<MainLayout><Insights /></MainLayout>} />
          <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
          <Route path="/ai-coach" element={<MainLayout><AiCoach /></MainLayout>} />
          <Route path="/flow-state" element={<MainLayout><FlowState /></MainLayout>} />
          <Route path="/idea-generator" element={<MainLayout><IdeaGenerator /></MainLayout>} />
          <Route path="/productivity-ai" element={<MainLayout><ProductivityAi /></MainLayout>} />
          <Route path="/ai-feedback" element={<MainLayout><AiFeedback /></MainLayout>} />
          <Route path="/habit-builder" element={<MainLayout><HabitBuilder /></MainLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
