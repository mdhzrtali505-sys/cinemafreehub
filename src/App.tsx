import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SecureGateway from "./pages/SecureGateway.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import MovieDetail from "./pages/MovieDetail.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/:type/:id" element={<MovieDetail />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/pf-ctrl-9x7k" element={<SecureGateway />} />
          <Route path="/pf-ctrl-9x7k/dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
