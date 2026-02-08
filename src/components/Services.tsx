import { Megaphone, Target, Award, Lightbulb, Search, Camera, Globe, Mail, Home } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Megaphone,
      title: 'Digital Marketing',
      description: 'Strategic digital marketing campaigns that drive engagement, increase brand visibility, and generate measurable results across all digital channels.',
    },
    {
      icon: Target,
      title: 'Channel Marketing',
      description: 'Optimize your marketing channels for maximum reach and ROI. From social media to email campaigns, I help you connect with your audience effectively.',
    },
    {
      icon: Home,
      title: 'Mortgage Marketing',
      description: 'Specialized marketing strategies for mortgage professionals and lenders. Drive qualified leads and build lasting relationships with homebuyers.',
    },
    {
      icon: Lightbulb,
      title: 'Brand & Creative',
      description: 'Develop compelling brand identities and creative assets that resonate with your target audience and set you apart from competitors.',
    },
    {
      icon: Search,
      title: 'SEO',
      description: 'Comprehensive SEO strategies to improve your search rankings, drive organic traffic, and increase your online visibility to reach more customers.',
    },
    {
      icon: Camera,
      title: 'Photography',
      description: 'Professional photography services for commercial, product, and corporate needs. Capture stunning visuals that tell your brand story.',
    },
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Custom web development solutions that combine beautiful design with powerful functionality to create exceptional user experiences.',
    },
    {
      icon: Mail,
      title: 'Email Marketing',
      description: 'Create engaging email campaigns that nurture leads, build customer loyalty, and drive conversions with personalized messaging and automation.',
    },
    {
      icon: Award,
      title: 'Consulting & Strategy',
      description: 'Expert consulting services to help you develop comprehensive marketing strategies that align with your business goals and drive sustainable growth.',
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-[#0f0f0f]">
      <div className="container mx-auto px-6 sm:px-8 md:px-12">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 sm:mb-8 px-4">
            <span className="text-[#F4B400]">Services</span> <span className="text-white">I Offer</span>
          </h2>
          <p className="text-gray-400 max-w-4xl mx-auto text-base sm:text-lg md:text-xl px-4">
            Comprehensive marketing and creative services tailored to drive your business forward
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-[#1a1a1a] p-6 sm:p-8 rounded-lg border border-gray-800 hover:border-[#F4B400] transition-all duration-300 group"
              >
                <div className="w-14 h-14 sm:w-18 sm:h-18 bg-[#F4B400]/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#F4B400] transition-colors">
                  <Icon className="text-[#F4B400] group-hover:text-black transition-colors" size={28} />
                </div>
                <h3 className="text-white text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-base sm:text-lg">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
