import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./components/PublicLayout";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Register from "./pages/Register";
import DocumentationPage from "./pages/DocumentationPage";
import Contact from "./pages/Contact";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminRegistrants from "./pages/admin/AdminRegistrants";
import AdminDocumentations from "./pages/admin/AdminDocumentations";
import AdminPosters from "./pages/admin/AdminPosters";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Pages with Layout */}
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="/admin/events" element={<AdminLayout />}>
            <Route index element={<AdminEvents />} />
          </Route>

          <Route path="/admin/registrants" element={<AdminLayout />}>
            <Route index element={<AdminRegistrants />} />
          </Route>

          <Route path="/admin/documentations" element={<AdminLayout />}>
            <Route index element={<AdminDocumentations />} />
          </Route>

          <Route path="/admin/posters" element={<AdminLayout />}>
            <Route index element={<AdminPosters />} />
          </Route>

          {/* /admin root → NotFound */}
          <Route path="/admin" element={<NotFound />} />

          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
