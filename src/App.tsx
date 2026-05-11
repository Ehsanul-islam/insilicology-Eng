import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoadingFallback from "@/components/common/LoadingFallback";
import { initMetaPixel, trackPageView } from "@/lib/analytics";

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
const SupabaseTest = lazy(() => import("./pages/SupabaseTest"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
// Future pages placeholders
const About = lazy(() => import("./pages/About"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const MyCertificates = lazy(() => import("./pages/MyCertificates"));
const StudentLiveSessions = lazy(() => import("./pages/StudentLiveSessions"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const Research = lazy(() => import("./pages/Research"));
const ResearchServiceDetail = lazy(() => import("./pages/ResearchServiceDetail"));
const Community = lazy(() => import("./pages/Community"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));

// Lazy load instructor pages
const InstructorLayout = lazy(() => import("./components/layouts/InstructorLayout"));
const InstructorDashboard = lazy(() => import("./pages/instructor/InstructorDashboard"));
const InstructorCourses = lazy(() => import("./pages/instructor/InstructorCourses"));
const InstructorCourseEditor = lazy(() => import("./pages/instructor/InstructorCourseEditor"));
// const CourseCurriculum = lazy(() => import("@/pages/instructor/CourseCurriculum"));
const InstructorLiveSessions = lazy(() => import("./pages/instructor/InstructorLiveSessions"));

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
const AdminPrograms = lazy(() => import("./pages/admin/AdminPrograms"));
const AdminProgramEditor = lazy(() => import("./pages/admin/AdminProgramEditor"));
const AdminLiveSessions = lazy(() => import("./pages/admin/AdminLiveSessions"));
const AdminResearchServices = lazy(() => import("./pages/admin/AdminResearchServices"));
const AdminResearchServiceEditor = lazy(() => import("./pages/admin/AdminResearchServiceEditor"));

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

// Component to handle Meta Pixel initialization and page tracking
const MetaPixelProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Initialize Meta Pixel on app load
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    if (pixelId) {
      initMetaPixel(pixelId);
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    trackPageView();
  }, [window.location.pathname]);

  return <>{children}</>;
};

import { WelcomeModal } from './components/WelcomeModal';
import { GuestCouponNotification } from './components/GuestCouponNotification';

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <MetaPixelProvider>
              <WelcomeModal />
              <GuestCouponNotification />
              <Suspense fallback={<LoadingFallback variant="page" />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:slug" element={<CourseDetail />} />
                  <Route path="/research" element={<Research />} />
                  <Route path="/research/:serviceSlug" element={<ResearchServiceDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
                  <Route path="/publications" element={<Portfolio />} />
                  <Route path="/publications/:slug" element={<PortfolioDetail />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-certificate" element={<CertificateVerify />} />
                  <Route path="/supabase-test" element={<SupabaseTest />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<CookiePolicy />} />
                  <Route path="/refunds" element={<RefundPolicy />} />

                  {/* Future Routes */}
                  <Route path="/about" element={<About />} />
                  <Route path="/stories" element={<SuccessStories />} />
                  <Route path="/help" element={<HelpCenter />} />

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
                    path="/my-sessions"
                    element={
                      <ProtectedRoute>
                        <StudentLiveSessions />
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
                  />                <Route
                    path="/my-certificates"
                    element={
                      <ProtectedRoute>
                        <MyCertificates />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/learn/:slug"
                    element={
                      <ProtectedRoute>
                        <LearnPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payment/:slug"
                    element={
                      <ProtectedRoute>
                        <PaymentPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Instructor Routes */}
                  <Route
                    path="/instructor"
                    element={
                      <ProtectedRoute>
                        <InstructorLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<InstructorDashboard />} />
                    <Route path="courses" element={<InstructorCourses />} />

                    {/* <Route path="courses/:courseId/curriculum" element={<CourseCurriculum />} /> */}
                    <Route path="live-sessions" element={<InstructorLiveSessions />} />
                  </Route>

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
                    path="/admin/live-sessions"
                    element={
                      <ProtectedRoute>
                        <AdminLiveSessions />
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
                  <Route
                    path="/admin/programs"
                    element={
                      <ProtectedRoute>
                        <AdminPrograms />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/programs/new"
                    element={
                      <ProtectedRoute>
                        <AdminProgramEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/programs/:id/edit"
                    element={
                      <ProtectedRoute>
                        <AdminProgramEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/research-services"
                    element={
                      <ProtectedRoute>
                        <AdminResearchServices />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/research-services/new"
                    element={
                      <ProtectedRoute>
                        <AdminResearchServiceEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/research-services/:id/edit"
                    element={
                      <ProtectedRoute>
                        <AdminResearchServiceEditor />
                      </ProtectedRoute>
                    }
                  />

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </MetaPixelProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
