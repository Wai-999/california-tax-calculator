import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import './index.css';
import App from './App';

// HashRouter is used deliberately: this app is deployed as a static site on
// GitHub Pages, which has no server-side rewrite rule for client-side
// routing. Hash-based routes (e.g. /#/tax-laws) always resolve correctly
// with zero extra server configuration, so deep links and page refreshes
// never 404 in production.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </HashRouter>
  </StrictMode>,
);
