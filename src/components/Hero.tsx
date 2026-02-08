import { Link } from 'react-router-dom';
import headshotImage from '../assets/images/177973283_10215629675493784_5339630275291513824_n.jpg';

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] pt-24">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 py-20">
        <div className="text-center max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12 flex justify-center">
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-[#F4B400] to-[#ff8c00] p-1.5">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src={headshotImage}
                  alt="Nick Irmo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold mb-6 sm:mb-8">
            <span className="text-white">Nick</span> <span className="text-[#F4B400]">Irmo</span>
          </h1>

          <p className="text-lg sm:text-2xl md:text-3xl text-gray-300 mb-8 sm:mb-10 px-4">
            Digital Marketing Strategist • Marketing Director & Team Builder • Creative Director
          </p>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-12 sm:mb-16 max-w-4xl mx-auto leading-relaxed px-4">
            I'm Nick Irmo, a multifaceted professional specializing in Digital Marketing and Creative Direction.
            With over 15 years of experience, I help brands achieve their goals through innovative strategies
            and compelling creative solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 sm:mb-20 px-4">
            <Link
              to="/resume"
              className="bg-[#F4B400] text-black px-8 sm:px-12 py-4 sm:py-5 rounded-md font-semibold hover:bg-[#e5a800] transition-colors text-lg sm:text-xl text-center"
            >
              View My Resume
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className="border-2 border-[#F4B400] text-[#F4B400] px-8 sm:px-12 py-4 sm:py-5 rounded-md font-semibold hover:bg-[#F4B400] hover:text-black transition-colors text-lg sm:text-xl"
            >
              Get in Touch
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 px-4">
            <div className="text-center">
              <div className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#F4B400] mb-2 sm:mb-3">15+</div>
              <div className="text-gray-400 text-sm sm:text-base">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#F4B400] mb-2 sm:mb-3">200+</div>
              <div className="text-gray-400 text-sm sm:text-base">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#F4B400] mb-2 sm:mb-3">50+</div>
              <div className="text-gray-400 text-sm sm:text-base">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#F4B400] mb-2 sm:mb-3">6</div>
              <div className="text-gray-400 text-sm sm:text-base">Books Published</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
