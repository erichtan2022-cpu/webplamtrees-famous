import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import MontessoriMethod from "./pages/MontessoriMethod";
import InclusionProgram from "./pages/InclusionProgram";
import Admission from "./pages/Admission";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBlogList from "./pages/admin/BlogList";
import AdminBlogEditor from "./pages/admin/BlogEditor";
import AdminPageEditor from "./pages/admin/PageEditor";
import AdminCardManager from "./pages/admin/CardManager";
import AdminSettingsManager from "./pages/admin/SettingsManager";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

// Handles /?lang=en legacy redirect
const RootWithLegacyRedirect = () => {
  const [searchParams] = useSearchParams();
  if (searchParams.get('lang') === 'en') {
    return <Navigate to="/en/admission" replace />;
  }
  return <LanguageProvider><Index /></LanguageProvider>;
};

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootWithLegacyRedirect />} />

            {/* Legacy 301 redirects */}
            <Route path="/admissions" element={<Navigate to="/id/pendaftaran" replace />} />
            <Route path="/admissions/" element={<Navigate to="/id/pendaftaran" replace />} />

            {/* Indonesian routes */}
            <Route path="/id/beranda" element={<LanguageProvider initialLang="id"><Home /></LanguageProvider>} />
            <Route path="/id/tentang-kami" element={<LanguageProvider initialLang="id"><About /></LanguageProvider>} />
            <Route path="/id/program" element={<LanguageProvider initialLang="id"><Programs /></LanguageProvider>} />
            <Route path="/id/metode-montessori" element={<LanguageProvider initialLang="id"><MontessoriMethod /></LanguageProvider>} />
            <Route path="/id/program-inklusi" element={<LanguageProvider initialLang="id"><InclusionProgram /></LanguageProvider>} />
            <Route path="/id/pendaftaran" element={<LanguageProvider initialLang="id"><Admission /></LanguageProvider>} />
            <Route path="/id/blog" element={<LanguageProvider initialLang="id"><Blog /></LanguageProvider>} />
            <Route path="/id/blog/:slug" element={<LanguageProvider initialLang="id"><BlogPost /></LanguageProvider>} />
            <Route path="/id/kontak" element={<LanguageProvider initialLang="id"><Contact /></LanguageProvider>} />

            {/* English routes */}
            <Route path="/en/home" element={<LanguageProvider initialLang="en"><Home /></LanguageProvider>} />
            <Route path="/en/about-us" element={<LanguageProvider initialLang="en"><About /></LanguageProvider>} />
            <Route path="/en/programs" element={<LanguageProvider initialLang="en"><Programs /></LanguageProvider>} />
            <Route path="/en/montessori-method" element={<LanguageProvider initialLang="en"><MontessoriMethod /></LanguageProvider>} />
            <Route path="/en/inclusive-program" element={<LanguageProvider initialLang="en"><InclusionProgram /></LanguageProvider>} />
            <Route path="/en/admission" element={<LanguageProvider initialLang="en"><Admission /></LanguageProvider>} />
            <Route path="/en/blog" element={<LanguageProvider initialLang="en"><Blog /></LanguageProvider>} />
            <Route path="/en/blog/:slug" element={<LanguageProvider initialLang="en"><BlogPost /></LanguageProvider>} />
            <Route path="/en/contact" element={<LanguageProvider initialLang="en"><Contact /></LanguageProvider>} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
            <Route path="/admin/dashboard" element={<AdminAuthProvider><ProtectedRoute><AdminDashboard /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/blog" element={<AdminAuthProvider><ProtectedRoute><AdminBlogList /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/blog/new" element={<AdminAuthProvider><ProtectedRoute><AdminBlogEditor /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/blog/:id" element={<AdminAuthProvider><ProtectedRoute><AdminBlogEditor /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/pages/:pageKey" element={<AdminAuthProvider><ProtectedRoute><AdminPageEditor /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/teachers" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="teacher" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/testimonials" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="testimonial" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/programs-cards" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="program" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/facilities" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="facility" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/faqs" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="faq" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/steps" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="admission_step" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/advantages" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="advantage" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/pillars" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="pillar" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/reasons" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="reason" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/rhythm" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="day_rhythm" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/ceo-message" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="ceo_message" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/instagram" element={<AdminAuthProvider><ProtectedRoute><AdminCardManager cardType="instagram" /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin/settings" element={<AdminAuthProvider><ProtectedRoute><AdminSettingsManager /></ProtectedRoute></AdminAuthProvider>} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            <Route path="*" element={<LanguageProvider><NotFound /></LanguageProvider>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
