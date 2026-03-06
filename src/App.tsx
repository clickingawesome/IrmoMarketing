import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import ResumePage from './pages/ResumePage';
import CaseStudyPage from './pages/CaseStudyPage';
import ProjectGalleryPage from './pages/ProjectGalleryPage';
import AllProjectsPage from './pages/AllProjectsPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import MusicPage from './pages/MusicPage';
import AdminTestimonialsPage from './pages/AdminTestimonialsPage';
import AdminBooksPage from './pages/AdminBooksPage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import AdminResourcesPage from './pages/AdminResourcesPage';
import AdminMusicPage from './pages/AdminMusicPage';
import TestimonialsPage from './pages/TestimonialsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/projects" element={<AllProjectsPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:slug" element={<ResourceDetailPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/project/:id/case-study" element={<CaseStudyPage />} />
          <Route path="/project/:id/gallery" element={<ProjectGalleryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonialsPage /></ProtectedRoute>} />
          <Route path="/admin/books" element={<ProtectedRoute><AdminBooksPage /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><AdminProjectsPage /></ProtectedRoute>} />
          <Route path="/admin/resources" element={<ProtectedRoute><AdminResourcesPage /></ProtectedRoute>} />
          <Route path="/admin/music" element={<ProtectedRoute><AdminMusicPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
