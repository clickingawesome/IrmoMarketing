import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import ResumePage from './pages/ResumePage';
import CaseStudyPage from './pages/CaseStudyPage';
import ProjectGalleryPage from './pages/ProjectGalleryPage';
import ResourcesPage from './pages/ResourcesPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import AdminTestimonialsPage from './pages/AdminTestimonialsPage';
import AdminBooksPage from './pages/AdminBooksPage';
import AdminProjectsPage from './pages/AdminProjectsPage';
import AdminResourcesPage from './pages/AdminResourcesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/:slug" element={<ResourceDetailPage />} />
        <Route path="/project/:id/case-study" element={<CaseStudyPage />} />
        <Route path="/project/:id/gallery" element={<ProjectGalleryPage />} />
        <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
        <Route path="/admin/books" element={<AdminBooksPage />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/resources" element={<AdminResourcesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
