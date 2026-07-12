// AppLayout — entry point for the root "/" route.
// It renders the SAME revised Home page (src/pages/Home.tsx) used by /id/beranda,
// wrapped with the Indonesian language provider. This guarantees the root domain
// landing page is always identical to the Beranda page (single source of truth —
// no duplicated homepage content lives here anymore).

import { LanguageProvider } from '@/contexts/LanguageContext';
import Home from '@/pages/Home';

const AppLayout = () => (
  <LanguageProvider initialLang="id">
    <Home />
  </LanguageProvider>
);

export default AppLayout;
