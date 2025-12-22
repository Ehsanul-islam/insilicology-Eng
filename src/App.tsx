import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoadingFallback from "@/components/common/LoadingFallback";

// Eagerly load critical components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other pages
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const PortfolioDetail = lazy(() => import("./pages/PortfolioDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const Career = lazy(() => import("./pages/Career"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const CertificateVerify = lazy(() => import("./pages/CertificateVerify"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const MyCertificates = lazy(() => import("./pages/MyCertificates"));

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEnrollments = lazy(() => import("./pages/admin/AdminEnrollments"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const AdminCourseEditor = lazy(() => import("./pages/admin/AdminCourseEditor"));
const AdminCertificates = lazy(() => import("./pages/admin/AdminCertificates"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminLessonEditor = lazy(() => import("./pages/admin/AdminLessonEditor"));
const AdminPortfolio = lazy(() => import("./pages/admin/AdminPortfolio"));
const AdminPortfolioEditor = lazy(() => import("./pages/admin/AdminPortfolioEditor"));
const AdminPortfolioCategories = lazy(() => import("./pages/admin/AdminPortfolioCategories"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminBlogEditor = lazy(() => import("./pages/admin/AdminBlogEditor"));
const AdminBlogCategories = lazy(() => import("./pages/admin/AdminBlogCategories"));

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
            <Suspense fallback={<LoadingFallback variant="page" />}>
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
                <Route
                  path="/admin/blog"
                  element={
                    <ProtectedRoute>
                      <AdminBlog />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog/new"
                  element={
                    <ProtectedRoute>
                      <AdminBlogEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog/:id/edit"
                  element={
                    <ProtectedRoute>
                      <AdminBlogEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blog/categories"
                  element={
                    <ProtectedRoute>
                      <AdminBlogCategories />
                    </ProtectedRoute>
                  }
                />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
