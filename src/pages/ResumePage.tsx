import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Linkedin, Briefcase, Download, Target, Layers, Globe } from 'lucide-react';
import SEO from '../components/SEO';
import { buildResumePageSchema } from '../lib/structuredData';

type Role = {
  title: string;
  company: string;
  location: string;
  dates: string;
  summary?: string;
  bullets: string[];
  accent?: boolean;
};

const experience: Role[] = [
  {
    title: 'Digital Marketing Manager (Sole Marketing Function, Reporting to CEO)',
    company: 'Amplify HR Management',
    location: 'Northbrook, IL',
    dates: 'December 2024 - March 2026',
    summary:
      'Recruited as the first dedicated marketing hire to stand up the entire marketing function for a growth-stage PEO. Owned brand, demand, web, content, and marketing technology in partnership with the CEO and executive team.',
    accent: true,
    bullets: [
      'Rebrand and Website Transformation: Delivered a complete corporate rebrand and 700+ page Next.js website, repositioning Amplify as an enterprise contender in a crowded PEO market.',
      'AI-Assisted Content Operations: Architected editorial pipelines pairing generative AI with human oversight, enabling full-funnel content coverage across web, sales enablement, and external publishing.',
      'Marketing Technology Stack: Integrated Salesforce and Pardot for attribution, stood up Looker Studio executive reporting, and ran retargeting, cold outbound, and paid search programs hands-on.',
      'Sales and Marketing Alignment: Owned the marketing-to-sales handoff including pipeline reviews, lead routing, and SLA agreements, ensuring shared revenue targets and consistent qualified-opportunity definitions.',
    ],
  },
  {
    title: 'Head of Marketing (two tenures)',
    company: 'Alpha Mortgage Corporation',
    location: 'Wilmington, NC',
    dates: 'May 2019 - November 2020  •  January 2022 - December 2023',
    summary:
      'Owned the full marketing function for a regional mortgage lender across two tenures bracketing a senior role at Guaranteed Rate, with accountability spanning three related brands: AlphaMortgage.com, the Alpha Mortgage Advantage branch network, and the Reverse Mortgage Division.',
    bullets: [
      'Pipeline Generation: Drove a 275% lift in inbound traffic and a 730% surge in internet lead volume within 90 days; rolled out a social and video lead system that produced $40M in qualified mortgage opportunities in 30 days.',
      'CRM Rollout: Led company-wide evaluation, rollout, and adoption of SureFire Top of Mind, a specialized mortgage CRM equipping 50+ loan officers and their referral partners with automated nurture and branded lifecycle communication.',
      'Multi-Brand Platform Rebuild: Architected and launched a new website platform for AlphaMortgage.com while unifying brand standards across Advantage branches and Reverse Mortgage, navigating a challenging post-COVID rate environment.',
    ],
  },
  {
    title: 'Vice President of Channel Marketing',
    company: 'Guaranteed Rate',
    location: 'Chicago, IL',
    dates: 'November 2020 - November 2021',
    summary:
      'Owned the marketing strategy for Agent Advantage (agents.rate.com), the flagship real estate agent partnership platform at one of the top three retail mortgage lenders in the United States (Scotsman Guide, 2021), supporting 110,000+ registered partners whose referrals underpinned loan production company-wide.',
    bullets: [
      'Channel Infrastructure at National Scale: Stewarded the 110K-agent partner network that served as the backbone of transaction flow nationwide, scaling the coaching, content, and Total Expert CRM systems that powered day-to-day loan officer activity.',
      'Community Platform: Stood up a private partner community that grew to 2,000+ active members in six months, sustained through branded guides, coaching video series, and live engagements.',
      'Celebrity Brand Content: Ghostwrote long-form editorial content for a nationally recognized home improvement television personality, producing voice-consistent brand content across Guaranteed Rate properties including GRatelife.',
    ],
  },
  {
    title: 'Marketing Director',
    company: '101 Mobility',
    location: 'Wilmington, NC',
    dates: 'April 2017 - November 2017',
    summary:
      'Led marketing transformation for a $50M+ medical equipment franchise network across the United States, directing a five-person team supporting 65+ franchise locations.',
    bullets: [
      'Paid Media and Operational Savings: Rebuilt a $1M+ annual PPC program contributing to a record $5.3M single-month franchise sales result, while capturing $250,000+ in annualized savings by consolidating vendor relationships.',
      'Omnichannel Program: Rolled out an integrated strategy covering email, PPC, print, video, social, and national tradeshows.',
    ],
  },
  {
    title: 'Marketing Director (Promoted from Digital Marketing Manager)',
    company: 'In Home Personal Services and Affiliated Brands',
    location: 'Crystal Lake, IL',
    dates: 'March 2015 - February 2017',
    summary:
      'Owned marketing strategy across a family of five related operating brands sharing common ownership: In Home Personal Services (flagship $50M+ non-skilled senior care agency across Illinois, Texas, and Florida), Bowes In Home Care, Onward DME, Matthews Online Learning, and Nex Gen Dynamics. Promoted to Marketing Director within five months of joining.',
    bullets: [
      'Multi-Brand Portfolio Marketing: Held marketing accountability across five distinct brands serving five distinct audiences, establishing positioning, web presence, and demand programs for each.',
      'Built the Creative Function from Scratch: Designed the team structure and hired the first dedicated videographer, graphic designer, content writer, and supporting specialists, converting an outsourced marketing footprint into a 10-person in-house creative team.',
      'New Product and Service Line Launches: Led go-to-market for Bowes In Home Care, Onward DME (direct-to-consumer e-commerce), Matthews Online Learning (internal LMS), and the repositioning of Nex Gen Dynamics from internal IT into an external creative agency.',
    ],
  },
  {
    title: 'Digital Marketing Manager',
    company: 'Cartridge World',
    location: 'McHenry, IL',
    dates: 'January 2013 - August 2015',
    summary:
      'Modernized North American digital marketing for one of the top 100 global franchises, operating across the $80B remanufactured ink and toner category with 1,600 worldwide locations. Inherited a legacy radio-dominant marketing model and rebuilt it into a performance-driven digital and e-commerce engine.',
    bullets: [
      'Digital Transformation of a Radio-First Brand: Shifted the North American marketing model off of radio and into performance digital, introducing a SKU-level PPC program and Google Shopping presence that gave the corporate brand direct e-commerce traction for the first time.',
      'Franchise-Friendly E-Commerce Model: Resolved the long-standing franchise-versus-corporate conflict by designing a radius-based attribution and revenue-sharing model (modeled on Batteries Plus), converting franchisee resistance into network-wide support.',
      'National Speaker and Trainer: Presented at industry conferences across the Cartridge World franchise system; contributing writer to INKFO, the company\u2019s award-winning internal franchise publication.',
      'Strategic Outcome: Modernized infrastructure supported rapid system-wide growth; the global parent was subsequently acquired by a Chinese manufacturing and private equity group, consolidating North American operations.',
    ],
  },
];

const skillGroups: { label: string; icon: typeof Target; items: string[] }[] = [
  {
    label: 'Executive Leadership',
    icon: Target,
    items: [
      'Go-to-Market Strategy',
      'Brand Architecture',
      'Digital Transformation',
      'Organizational Design',
      'Marketing P&L and $5M+ Budget Ownership',
      'Sales and Marketing Alignment / RevOps',
      'Channel and Partner Marketing',
      'Team Building',
      'Vendor and Agency Management',
      'CEO and Board Communication',
    ],
  },
  {
    label: 'Growth and Revenue Marketing',
    icon: Layers,
    items: [
      'Demand Generation',
      'Pipeline Development',
      'Revenue Marketing',
      'Product Marketing and New Product Launches',
      'ICP Definition and Customer Segmentation',
      'ABM',
      'Attribution Modeling',
      'Conversion Rate Optimization',
      'Lifecycle Strategy',
      'SEO, SEM, AEO',
    ],
  },
  {
    label: 'MarTech and Analytics',
    icon: Briefcase,
    items: [
      'Contentful',
      'WordPress',
      'Magento',
      'Salesforce',
      'Pardot',
      'HubSpot',
      'Total Expert',
      'SureFire',
      'GA4',
      'Looker Studio',
      'Google Ads (certified)',
      'SEMrush',
      'Ahrefs',
      'Figma',
      'Adobe CS',
      'Generative AI',
      'Next.js',
      'Tailwind',
      'React',
    ],
  },
  {
    label: 'Industry Expertise',
    icon: Globe,
    items: [
      'B2B SaaS',
      'Financial Services and Mortgage',
      'Franchise and Multi-Location',
      'Senior Care and Healthcare',
      'Professional Services',
      'E-Commerce and DTC',
      'PE-Backed and Growth-Stage',
    ],
  },
];

export default function ResumePage() {
  return (
    <>
      <SEO
        title="Resume - Nick Irmo"
        description="Resume of Nick Irmo, Senior Marketing Executive specializing in channel marketing, brand, demand generation, and revenue operations."
        canonical="https://irmomarketing.com/resume"
        structuredData={buildResumePageSchema()}
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
                href="/Nick_Irmo_Senior_Marketing_Executive.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#F4B400]/20 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Download size={20} />
                Download PDF
              </a>
            </div>

            <div className="max-w-6xl mx-auto bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
              <div className="bg-gradient-to-r from-[#2a2a2a] to-[#1a1a1a] p-12 border-b border-gray-800">
                <div className="flex items-start justify-between flex-wrap gap-8">
                  <div>
                    <h1 className="text-5xl font-bold text-white mb-3">Nick Irmo</h1>
                    <h2 className="text-2xl text-[#F4B400] mb-4">
                      VP Channel Marketing &amp; Head of Marketing
                    </h2>
                    <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
                      Brand, Demand &amp; RevOps  •  Senior Marketing Executive
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
                    <span className="text-gray-400 text-sm">Barrington, IL</span>
                  </div>
                </div>
              </div>

              <div className="p-12">
                <section className="mb-12">
                  <h3 className="text-2xl font-bold text-[#F4B400] mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-[#F4B400] rounded-full"></div>
                    Executive Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Senior marketing executive who reports to CEOs and presents to boards; known for stepping into solo or understaffed marketing seats and converting them into full-stack growth engines spanning brand, demand, and revenue operations. Track record includes generating $40M+ in qualified pipeline inside 30 days, leading channel marketing at one of the top three retail mortgage lenders in the United States, modernizing digital for a 1,600-location global franchise later acquired by a private equity group, launching new products and service lines from concept through GTM, and advising 200+ small, mid-market, and enterprise clients (including Fortune 500 brands) through a consultancy operating continuously since 2008.
                  </p>
                </section>

                <section className="mb-12">
                  <h3 className="text-2xl font-bold text-[#F4B400] mb-6 flex items-center gap-3">
                    <Briefcase className="text-[#F4B400]" size={28} />
                    Professional Experience
                  </h3>

                  <div className="space-y-8">
                    {experience.map((role) => (
                      <div
                        key={`${role.company}-${role.dates}`}
                        className={`border-l-2 ${role.accent ? 'border-[#F4B400]' : 'border-gray-700'} pl-6`}
                      >
                        <h4 className="text-xl font-bold text-white mb-1">{role.title}</h4>
                        <p className="text-[#F4B400] mb-1">{role.company}</p>
                        <p className="text-gray-400 text-sm mb-4">
                          {role.dates} | {role.location}
                        </p>
                        {role.summary && (
                          <p className="text-gray-300 mb-3 leading-relaxed">{role.summary}</p>
                        )}
                        <ul className="text-gray-300 space-y-2 leading-relaxed">
                          {role.bullets.map((b, i) => (
                            <li key={i}>• {b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-12">
                  <h3 className="text-2xl font-bold text-[#F4B400] mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-[#F4B400] rounded-full"></div>
                    Independent Consulting &amp; Fractional Marketing Leadership
                  </h3>
                  <div className="border-l-2 border-gray-700 pl-6">
                    <h4 className="text-xl font-bold text-white mb-1">Founder, Principal Strategist, and Fractional CMO</h4>
                    <p className="text-[#F4B400] mb-1">Clicking Awesome (formerly Irmo Marketing)</p>
                    <p className="text-gray-400 text-sm mb-4">2008 - Present | Barrington, IL</p>
                    <p className="text-gray-300 mb-3 leading-relaxed">
                      Operated independently as Irmo Marketing from 2008 and rebranded the client-service practice as Clicking Awesome in 2017; Clicking Awesome inherited all active clients while irmomarketing.com became my personal portfolio. Across both entities, the practice has served 200+ clients across financial services, legal, real estate, senior care, hospitality, and retail.
                    </p>
                    <ul className="text-gray-300 space-y-2 leading-relaxed">
                      <li>• Fractional CMO and Marketing Leadership: Senior marketing leadership for growth-stage and mid-market companies, including marketing audits, GTM strategy, MarTech evaluation, team structure, and quarterly roadmaps tied to revenue outcomes.</li>
                      <li>• Enterprise and Fortune 500 Engagements: Delivered B2B and B2C marketing programs for nationally recognized brands and Fortune 500 companies, including landing page strategy, paid media campaigns, brand positioning, and category expansion work.</li>
                      <li>• Website Design, Brand Identity, and Social Media: Integrated programs across financial services, legal, senior care, hospitality, and retail, with emphasis on translating executive vision into brand systems that scale.</li>
                    </ul>
                    <div className="bg-[#0f0f0f] rounded-lg p-4 border border-gray-800 mt-4">
                      <h5 className="text-white font-semibold mb-3">Selected Engagements</h5>
                      <ul className="text-gray-300 space-y-2 text-sm leading-relaxed">
                        <li><strong className="text-[#F4B400]">B2B SaaS &amp; Enterprise:</strong> Opus21 Utility Management (cloud utility billing platform serving 180+ municipal and private utilities); Unilever (Dove brand B2B hospitality vertical).</li>
                        <li><strong className="text-[#F4B400]">Multi-Location Retail &amp; E-Commerce:</strong> Reeds Jewelers (largest family-owned jewelry chain in North America, Magento Commerce platform migration).</li>
                        <li><strong className="text-[#F4B400]">Nonprofit &amp; Quality Systems:</strong> Wisconsin Center for Performance Excellence (state-level Baldrige Award nonprofit).</li>
                        <li><strong className="text-[#F4B400]">Financial Services:</strong> Revolution Mortgage, Oakstar Mortgage, Timeless Mortgage.</li>
                        <li><strong className="text-[#F4B400]">Hospitality &amp; Food Service:</strong> Sybaris (five-location Midwest luxury couples resort chain), Tempesta, Elevation Meats.</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-[#F4B400] mb-6 flex items-center gap-3">
                    <div className="w-1 h-8 bg-[#F4B400] rounded-full"></div>
                    Skills &amp; Credentials
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {skillGroups.map(({ label, icon: Icon, items }) => (
                      <div key={label} className="bg-[#0f0f0f] rounded-lg p-6 border border-gray-800">
                        <h4 className="text-white font-semibold mb-4 flex items-center gap-3">
                          <Icon className="text-[#F4B400]" size={20} />
                          {label}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {items.map((item) => (
                            <span
                              key={item}
                              className="bg-[#1a1a1a] border border-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-sm"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
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
