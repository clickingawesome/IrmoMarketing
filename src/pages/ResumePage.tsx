import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Linkedin, Award, Briefcase, GraduationCap, Download } from 'lucide-react';
import SEO from '../components/SEO';

export default function ResumePage() {
  return (
    <>
      <SEO
        title="Resume - Nick Irmo"
        description="View Nick Irmo's professional resume. Marketing Director with 15+ years experience in channel marketing, digital strategy, and creative direction."
        canonical="https://irmomarketing.com/resume"
      />
      <div className="min-h-screen bg-[#0f0f0f]">
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] py-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#F4B400] hover:text-[#d99f00] transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <a
              href="/nick_irmo_marketing_director_team_builder.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#F4B400]/20 hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Download size={20} />
              View Resume
            </a>
          </div>

          <div className="max-w-6xl mx-auto bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
            <div className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] p-12 border-b border-gray-800">
              <div className="flex items-start justify-between flex-wrap gap-8">
                <div>
                  <h1 className="text-5xl font-bold text-white mb-4">Nick Irmo</h1>
                  <h2 className="text-2xl text-[#F4B400] mb-6">
                    Marketing Director & Team Builder
                  </h2>
                  <p className="text-gray-300 text-lg max-w-3xl leading-relaxed mb-6">
                    Channel Marketing Expert | $40M+ Pipeline • 110K+ Partners • AI-Driven Growth | Author
                  </p>
                </div>
                <div className="flex flex-col gap-3 text-gray-300">
                  <a href="mailto:nick.irmo@gmail.com" className="flex items-center gap-3 hover:text-[#F4B400] transition-colors">
                    <Mail size={20} />
                    nick.irmo@gmail.com
                  </a>
                  <a href="tel:8474144272" className="flex items-center gap-3 hover:text-[#F4B400] transition-colors">
                    <Phone size={20} />
                    (847) 414-4272
                  </a>
                  <a href="https://www.linkedin.com/in/nickirmo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#F4B400] transition-colors">
                    <Linkedin size={20} />
                    linkedin.com/in/nickirmo
                  </a>
                </div>
              </div>
            </div>

            <div className="p-12">
              <section className="mb-12">
                <h3 className="text-2xl font-bold text-[#F4B400] mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-[#F4B400] rounded-full"></div>
                  Summary
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Results-oriented marketing leader driving rapid growth for B2B and B2C companies. I specialize in channel marketing, partner programs, and digital transformation—connecting strategy with execution to deliver measurable pipeline results.
                </p>

                <div className="bg-[#0f0f0f] rounded-lg p-6 border border-gray-800 mb-6">
                  <h4 className="text-white font-semibold mb-4">TRACK RECORD:</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Generated $40M+ in qualified pipeline opportunities</li>
                    <li>• Scaled partner networks to 110K+ registered users</li>
                    <li>• Drove 730% increase in lead generation through integrated digital strategies</li>
                    <li>• Achieved 98/100 Google PageSpeed scores with 400+ pages indexed</li>
                    <li>• Led teams of up to 10 people with budgets exceeding $5M</li>
                  </ul>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4">
                  I build and scale marketing engines that work. Whether it's launching a 700-page website rebuild, managing 110K-partner networks, or implementing AI-powered marketing automation, I focus on removing obstacles, coaching teams, and finding quick wins that increase both leads and operational efficiency.
                </p>

                <p className="text-gray-300 leading-relaxed">
                  My approach combines technical depth (Wordpress, Next.js, Salesforce, HubSpot, marketing automation) with strategic thinking (go-to-market planning, channel development, stakeholder communication). I'm known for translating complex technical concepts into compelling narratives that drive action.
                </p>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-bold text-[#F4B400] mb-6 flex items-center gap-3">
                  <Briefcase className="text-[#F4B400]" size={28} />
                  Experience
                </h3>

                <div className="space-y-8">
                  <div className="border-l-2 border-[#F4B400] pl-6">
                    <h4 className="text-xl font-bold text-white mb-2">Digital Marketing Manager</h4>
                    <p className="text-[#F4B400] mb-2">Amplify HR Management</p>
                    <p className="text-gray-400 text-sm mb-4">December 2024 - Present | Northbrook, Illinois</p>
                    <p className="text-gray-300 mb-3 leading-relaxed">
                      Driving digital transformation and growth strategy for a B2B SaaS HR Outsourcing PEO services firm, focusing on website optimization, demand generation, and brand positioning.
                    </p>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Led complete website rebuild deploying 700+ pages of optimized content; achieved 98/100 Google PageSpeed score (up from 34/100) and indexed 400+ additional pages</li>
                      <li>• Adopted AI tools and marketing automation to simplify content creation, improve campaign efficiency, and speed up time-to-market</li>
                      <li>• Established social proof engine generating 70+ five-star Google and G2 reviews, earning official G2 badge</li>
                      <li>• Built comprehensive marketing asset library supporting social media, print collateral, and sales enablement</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-gray-700 pl-6">
                    <h4 className="text-xl font-bold text-white mb-2">Founder & Marketing Consultant</h4>
                    <p className="text-[#F4B400] mb-2">Clicking Awesome</p>
                    <p className="text-gray-400 text-sm mb-4">October 2017 - Present | United States</p>
                    <p className="text-gray-300 mb-3 leading-relaxed">
                      Founded and operated full-service digital marketing consultancy serving 200+ small and medium businesses across financial services, legal, real estate, senior care, and hospitality industries.
                    </p>
                    <div className="bg-[#0f0f0f] rounded-lg p-4 border border-gray-800 mt-3">
                      <h5 className="text-white font-semibold mb-3">Select Client Engagements:</h5>
                      <ul className="text-gray-300 space-y-2 text-sm">
                        <li><strong className="text-[#F4B400]">Unilever - Dove Brand:</strong> Designed and executed B2B landing page strategy and digital ad placement campaign for North American hotel industry expansion</li>
                        <li><strong className="text-[#F4B400]">Reeds Jewelers:</strong> Led Magento 2 platform upgrade and digital transformation including brand strategy for proprietary collections</li>
                        <li><strong className="text-[#F4B400]">Timeless Mortgage:</strong> Created full-service brand identity package including logo design, brand color system, and visual identity guidelines</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-l-2 border-gray-700 pl-6">
                    <h4 className="text-xl font-bold text-white mb-2">Head Of Marketing</h4>
                    <p className="text-[#F4B400] mb-2">Alpha Mortgage Corporation</p>
                    <p className="text-gray-400 text-sm mb-4">January 2022 - December 2023 | Wilmington, North Carolina</p>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Drove 275% increase in inbound traffic and 730% surge in internet lead generation within 90 days</li>
                      <li>• Developed and launched social media and video-enhanced lead generation system generating $40M in qualified opportunities within 30 days</li>
                      <li>• Created and distributed quarterly realtor-facing magazine "Beyond Alpha" to enhance B2B relationships</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-gray-700 pl-6">
                    <h4 className="text-xl font-bold text-white mb-2">Vice President of Channel Marketing</h4>
                    <p className="text-[#F4B400] mb-2">Guaranteed Rate</p>
                    <p className="text-gray-400 text-sm mb-4">November 2020 - November 2021 | Chicago, Illinois</p>
                    <p className="text-gray-300 mb-3 leading-relaxed">
                      Led marketing strategy for Agent Advantage, the company's real estate agent partnership platform serving 110,000+ registered partners.
                    </p>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Scaled partner marketing program supporting 110K-agent network, increasing capture rates through comprehensive educational initiatives and CRM training</li>
                      <li>• Built high-engagement community platform launching private Facebook group that grew to 2,000+ members in six months</li>
                      <li>• Directed integrated marketing operations overseeing creative teams, video production, email marketing, and automated CRM campaigns</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-gray-700 pl-6">
                    <h4 className="text-xl font-bold text-white mb-2">Marketing Director</h4>
                    <p className="text-[#F4B400] mb-2">101 Mobility</p>
                    <p className="text-gray-400 text-sm mb-4">April 2017 - November 2017 | Wilmington, North Carolina</p>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Delivered $250K+ in annualized savings by strategically reducing external vendor dependence</li>
                      <li>• Overhauled PPC program managing $1M+ annual budget, contributing to record $5.3M single-month sales</li>
                      <li>• Implemented multi-national advertising campaign consolidating franchisee ad spend</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-bold text-[#F4B400] mb-6 flex items-center gap-3">
                  <GraduationCap className="text-[#F4B400]" size={28} />
                  Education
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">Western Illinois University</h4>
                    <p className="text-gray-400">Marketing</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Oakton Community College</h4>
                    <p className="text-gray-400">Computer Science</p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h3 className="text-2xl font-bold text-[#F4B400] mb-6 flex items-center gap-3">
                  <Award className="text-[#F4B400]" size={28} />
                  Certifications & Publications
                </h3>
                <div className="bg-[#0f0f0f] rounded-lg p-6 border border-gray-800">
                  <h4 className="text-white font-semibold mb-3">Certifications:</h4>
                  <ul className="text-gray-300 space-y-2 mb-6">
                    <li>• Adobe Marketing Cloud</li>
                    <li>• Leading a Marketing Team</li>
                    <li>• Google Analytics</li>
                    <li>• Hubspot</li>
                  </ul>
                  <h4 className="text-white font-semibold mb-3">Publications:</h4>
                  <p className="text-gray-300">
                    <strong className="text-[#F4B400]">Published Author:</strong> "Jumpstart Your Life: 101 Quick Lessons for Teens and Young Adults to Succeed, Grow, and Thrive" (jumpstart101.com)
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold text-[#F4B400] mb-6 flex items-center gap-3">
                  <div className="w-1 h-8 bg-[#F4B400] rounded-full"></div>
                  Expertise
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['Channel Marketing', 'Partner Programs', 'Demand Generation', 'Digital Transformation',
                    'Marketing Automation', 'Team Leadership', 'Budget Management', 'AI Tools',
                    'CRM Systems', 'SEO/SEM', 'Content Strategy', 'Brand Development',
                    'Branding & Identity', 'Logo Design', 'Brand Strategy'].map((skill) => (
                    <span key={skill} className="bg-[#0f0f0f] border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
