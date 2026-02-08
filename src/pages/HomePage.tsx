import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Books from '../components/Books';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Books />
      <Testimonials />
      <Contact />
    </div>
  );
}
