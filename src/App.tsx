import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Career from "./pages/Career";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import CertificateVerify from "./pages/CertificateVerify";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import MyCertificates from "./pages/MyCertificates";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseEditor from "./pages/admin/AdminCourseEditor";
import AdminCertificates from "./pages/admin/AdminCertificates";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminLessonEditor from "./pages/admin/AdminLessonEditor";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminPortfolioEditor from "./pages/admin/AdminPortfolioEditor";
import AdminPortfolioCategories from "./pages/admin/AdminPortfolioCategories";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/career" element={<Career />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-certificate" element={<CertificateVerify />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/settings"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-certificates"
                element={
                  <ProtectedRoute>
                    <MyCertificates />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/enrollments"
                element={
                  <ProtectedRoute>
                    <AdminEnrollments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute>
                    <AdminCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses/new"
                element={
                  <ProtectedRoute>
                    <AdminCourseEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdminCourseEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses/:id/lessons"
                element={
                  <ProtectedRoute>
                    <AdminLessonEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/certificates"
                element={
                  <ProtectedRoute>
                    <AdminCertificates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/contacts"
                element={
                  <ProtectedRoute>
                    <AdminContacts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/portfolio"
                element={
                  <ProtectedRoute>
                    <AdminPortfolio />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/portfolio/new"
                element={
                  <ProtectedRoute>
                    <AdminPortfolioEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/portfolio/:id/edit"
                element={
                  <ProtectedRoute>
                    <AdminPortfolioEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/portfolio/categories"
                element={
                  <ProtectedRoute>
                    <AdminPortfolioCategories />
                  </ProtectedRoute>
                }
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
