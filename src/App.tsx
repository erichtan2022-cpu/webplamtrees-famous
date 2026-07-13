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
import AdminBlog from "./pages/AdminBlog";
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

            {/* Admin (password protected via edge function) */}
            <Route path="/admin/blog" element={<AdminBlog />} />

            <Route path="*" element={<LanguageProvider><NotFound /></LanguageProvider>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
