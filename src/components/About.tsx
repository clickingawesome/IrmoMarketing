export default function About() {
  const skills = [
    { name: 'Digital Marketing', percentage: 95 },
    { name: 'Web Development', percentage: 90 },
    { name: 'Brand Identity', percentage: 85 },
    { name: 'Content Strategy', percentage: 92 },
    { name: 'Photography', percentage: 88 },
    { name: 'Project Management', percentage: 94 },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#1a1a1a]">
      <div className="container mx-auto px-6 sm:px-8 md:px-12">
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-12 sm:mb-20 text-center px-4">
          <span className="text-[#F4B400]">About</span> <span className="text-white">Me</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-10 sm:gap-16 max-w-7xl mx-auto">
          <div className="text-gray-300 text-base sm:text-lg">
            <p className="mb-4 sm:mb-6 leading-relaxed">
              Welcome! I'm a passionate marketing expert with a proven track record in both B2B and
              B2C markets. I specialize in crafting comprehensive marketing strategies that drive
              growth and achieve meaningful results for businesses of all sizes.
            </p>
            <p className="mb-4 sm:mb-6 leading-relaxed">
              My approach combines data-driven insights with creative thinking to develop campaigns
              that resonate with target audiences and deliver measurable ROI.
            </p>
            <p className="mb-6 sm:mb-9 leading-relaxed">
              With over 15 years of experience spanning strategic marketing, marketing operations,
              brand building, and business development, I bring a wealth of knowledge to every
              project I undertake. I'm particularly passionate about staying at the cutting edge of
              marketing technology and trends.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 mt-8 sm:mt-12">
              <div>
                <h3 className="text-[#F4B400] font-semibold mb-2 sm:mb-3 text-lg sm:text-xl">Education</h3>
                <p className="text-sm sm:text-base text-gray-400">Western Illinois University</p>
              </div>
              <div>
                <h3 className="text-[#F4B400] font-semibold mb-2 sm:mb-3 text-lg sm:text-xl">Experience</h3>
                <p className="text-sm sm:text-base text-gray-400">15+ Years in Marketing</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white text-2xl sm:text-3xl font-semibold mb-8 sm:mb-10">Core Expertise</h3>
            <div className="space-y-6 sm:space-y-8">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2 sm:mb-3">
                    <span className="text-gray-300 text-base sm:text-lg">{skill.name}</span>
                    <span className="text-[#F4B400] font-semibold text-base sm:text-lg">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
                    <div
                      className="bg-[#F4B400] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
