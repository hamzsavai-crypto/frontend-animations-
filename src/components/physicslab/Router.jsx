import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './Layout';
import HomePage from './pages/HomePage';
import SimulationsPage from './pages/SimulationsPage';
import SimDetailPage from './pages/SimDetailPage';
import ConceptsPage from './pages/ConceptsPage';
import ConceptDetailPage from './pages/ConceptDetailPage';
import ExperimentsPage from './pages/ExperimentsPage';
import ExperimentDetailPage from './pages/ExperimentDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // delay for route transition
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}

export default function LabRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulations" element={<SimulationsPage />} />
          <Route path="/simulations/:id" element={<SimDetailPage />} />
          <Route path="/concepts" element={<ConceptsPage />} />
          <Route path="/concepts/:id" element={<ConceptDetailPage />} />
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/experiments/:id" element={<ExperimentDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
