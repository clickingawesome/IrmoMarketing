import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Books from '../components/Books';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import SEO from '../components/SEO';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Nick Irmo - Digital Marketing Strategist & Creative Director"
        description="Marketing Director and Creative Director with 15+ years experience. Channel Marketing Expert | $40M+ Pipeline • 110K+ Partners • AI-Driven Growth | Author"
        canonical="https://irmomarketing.com"
      />
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
    </>
  );
}
