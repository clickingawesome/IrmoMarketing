import { useEffect, useState } from 'react';
import { ArrowLeft, Info, ShoppingCart, BookOpen, Rocket, Moon, Star, Compass, Ghost, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, type Book } from '../lib/supabase';
import Header from '../components/Header';
import SEO from '../components/SEO';
import { buildBooksPageSchema } from '../lib/structuredData';
import headshotImage from '../assets/images/177973283_10215629675493784_5339630275291513824_n.jpg';

const iconMap: Record<string, any> = {
  'rocket': Rocket,
  'moon': Moon,
  'star': Star,
  'compass': Compass,
  'ghost': Ghost,
  'package': Package,
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Books');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setBooks(data || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const featuredBook = books.find(book => book.is_featured);
  const categories = ['All Books', ...new Set(books.filter(b => b.category).map(b => b.category))];

  const filteredBooks = selectedCategory === 'All Books'
    ? books
    : books.filter(book => book.category === selectedCategory);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-book-notification`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        alert('Thanks for your interest! We\'ll notify you when new books are available.');
        setEmail('');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting notification request:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="text-gray-400">Loading books...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Books by Nick Irmo"
        description="Explore marketing books and guides by Nick Irmo. Learn about AI-powered marketing strategies, channel marketing, and digital transformation."
        canonical="https://irmomarketing.com/books"
        ogImage={featuredBook?.featured_image || featuredBook?.cover_image_vertical || undefined}
        structuredData={buildBooksPageSchema()}
      />
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 sm:px-8 md:px-12 max-w-7xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#F4B400] transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <div className="text-center mb-12 sm:mb-20">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 px-4">
              <span className="text-white">My </span>
              <span className="text-[#F4B400]">Books</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed px-4">
              From practical life guides to thrilling fiction and heartwarming children's stories
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>— explore my collection of published works.
            </p>
          </div>

          {featuredBook && (
            <div className="mb-20 sm:mb-32">
              <div className="text-center mb-8 sm:mb-16">
                <p className="text-[#F4B400] font-semibold tracking-widest uppercase text-xs">
                  FEATURED BOOK
                </p>
              </div>

              <div className="bg-gradient-to-b from-[#1a1a1a]/50 to-transparent rounded-3xl p-6 sm:p-8 md:p-16">
                <div className="grid lg:grid-cols-[400px,1fr] gap-8 sm:gap-16 items-center max-w-6xl mx-auto">
                  <div className="flex justify-center lg:justify-start">
                    {(featuredBook.featured_image || featuredBook.cover_image_vertical) ? (
                      <div
                        className="aspect-[3/4] w-full max-w-[350px] rounded-2xl overflow-hidden relative transform hover:scale-105 transition-transform duration-300"
                        style={{
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(244, 180, 0, 0.1)'
                        }}
                      >
                        <img
                          src={featuredBook.featured_image || featuredBook.cover_image_vertical}
                          alt={featuredBook.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-[3/4] w-full max-w-[350px] rounded-2xl flex flex-col items-center justify-center p-12 relative transform hover:scale-105 transition-transform duration-300"
                        style={{
                          backgroundColor: featuredBook.cover_color,
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 100px rgba(244, 180, 0, 0.1)'
                        }}
                      >
                        {featuredBook.icon && iconMap[featuredBook.icon] && (
                          (() => {
                            const IconComponent = iconMap[featuredBook.icon];
                            return <IconComponent className="text-white/90 mb-8" size={80} />;
                          })()
                        )}
                        {featuredBook.year && (
                          <p className="text-white/70 text-base mb-6">{featuredBook.year}</p>
                        )}
                        <h3 className="text-white text-3xl font-bold text-center mb-6 leading-tight">
                          {featuredBook.title}
                        </h3>
                        {featuredBook.subtitle && (
                          <p className="text-white/80 text-center text-sm leading-relaxed px-2">
                            {featuredBook.subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {featuredBook.tag && (
                      <span className="inline-block bg-[#F4B400]/15 text-[#F4B400] px-4 py-2 rounded-md text-xs font-semibold tracking-wide">
                        {featuredBook.tag}
                      </span>
                    )}

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                      {featuredBook.title}
                    </h2>

                    {featuredBook.subtitle && (
                      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                        {featuredBook.subtitle}
                      </p>
                    )}

                    {featuredBook.description && (
                      <p className="text-gray-400 leading-relaxed text-base">
                        {featuredBook.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                      {featuredBook.year && (
                        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Published</p>
                          <p className="text-white font-bold text-lg">{featuredBook.year}</p>
                        </div>
                      )}
                      {featuredBook.format && (
                        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Format</p>
                          <p className="text-white font-bold text-lg">{featuredBook.format}</p>
                        </div>
                      )}
                      {featuredBook.audience && (
                        <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Audience</p>
                          <p className="text-white font-bold text-lg">{featuredBook.audience}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                      {featuredBook.amazon_link && (
                        <a
                          href={featuredBook.amazon_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#F4B400] hover:bg-[#d99f00] text-black font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-[#F4B400]/20 hover:shadow-2xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                        >
                          <ShoppingCart size={18} />
                          Buy on Amazon
                        </a>
                      )}
                      {featuredBook.sample_link && (
                        <a
                          href={featuredBook.sample_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-transparent border-2 border-gray-700 hover:border-[#F4B400] text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#F4B400]/5 text-sm sm:text-base"
                        >
                          <BookOpen size={18} />
                          Read Sample
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-20 sm:mb-32">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-4">
                <span className="text-white">Complete </span>
                <span className="text-[#F4B400]">Collection</span>
              </h2>
              <p className="text-gray-400 text-base sm:text-lg px-4">
                Browse all my published works across different genres
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-12 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#F4B400] text-black'
                      : 'bg-transparent text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <div className="relative">
                    {book.cover_image_horizontal ? (
                      <div className="aspect-[16/10] relative">
                        {book.is_featured && (
                          <div className="absolute top-4 left-4 bg-[#F4B400] text-black text-xs font-bold px-3 py-1 rounded z-10">
                            FEATURED
                          </div>
                        )}
                        <img
                          src={book.cover_image_horizontal}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-[16/10] flex flex-col items-center justify-center p-8 relative"
                        style={{ backgroundColor: book.cover_color }}
                      >
                        {book.is_featured && (
                          <div className="absolute top-4 left-4 bg-[#F4B400] text-black text-xs font-bold px-3 py-1 rounded">
                            FEATURED
                          </div>
                        )}
                        {book.icon && iconMap[book.icon] && (
                          (() => {
                            const IconComponent = iconMap[book.icon];
                            return <IconComponent className="text-white/90 mb-4" size={56} />;
                          })()
                        )}
                        <h3 className="text-white text-xl font-bold text-center">
                          {book.title}
                        </h3>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {book.category && (
                      <p className="text-[#F4B400] text-sm font-medium mb-2">
                        {book.category}
                      </p>
                    )}

                    <h4 className="text-white text-xl font-bold mb-2">
                      {book.title}
                    </h4>

                    {book.subtitle && (
                      <p className="text-gray-400 text-sm mb-4">
                        {book.subtitle}
                      </p>
                    )}

                    {book.description && (
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {book.description}
                      </p>
                    )}

                    <div className="flex gap-3">
                      {book.amazon_link && (
                        <a
                          href={book.amazon_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-[#F4B400] hover:bg-[#ff8c00] text-black font-semibold py-2.5 rounded-lg transition-colors text-center text-sm"
                        >
                          Buy Now
                        </a>
                      )}
                      {book.sample_link && (
                        <a
                          href={book.sample_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#0f0f0f] hover:bg-black text-gray-400 hover:text-white p-2.5 rounded-lg transition-colors border border-gray-800"
                          title="Read Sample"
                        >
                          <Info size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-32">
            <div className="bg-[#1a1a1a] rounded-lg p-6 sm:p-8 md:p-12 text-center border border-gray-800">
              <Package className="text-[#F4B400] mx-auto mb-6" size={48} />
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                More Books Coming Soon
              </h3>
              <p className="text-gray-400 mb-8 text-sm sm:text-base">
                I'm always working on new projects. Sign up to be notified
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>when new books are released!
              </p>
              <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                />
                <button
                  type="submit"
                  className="bg-[#F4B400] hover:bg-[#ff8c00] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Notify Me
                </button>
              </form>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#F4B400] font-semibold tracking-wider uppercase text-sm mb-4">
                ABOUT THE AUTHOR
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">
                Nick Irmo
              </h2>
            </div>

            <div className="grid md:grid-cols-[300px,1fr] gap-12 items-start">
              <div className="flex justify-center md:justify-start">
                <div className="w-64 h-64 rounded-full border-4 border-[#F4B400]/30 overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] flex items-center justify-center">
                  <img
                    src={headshotImage}
                    alt="Nick Irmo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-gray-400 leading-relaxed">
                  Beyond my career in digital marketing and creative direction, writing has always been a passion. I believe in the power of words—whether I'm crafting strategies that help businesses grow, helping young adults navigate life's challenges, sparking imagination in children, or keeping readers on the edge of their seats.
                </p>

                <p className="text-gray-400 leading-relaxed">
                  Each book I write comes from a place of genuine desire to connect, inspire, or entertain. My diverse background in marketing, photography, and business gives me a unique perspective that I bring to every story.
                </p>

                <div className="grid grid-cols-3 gap-8 pt-6 border-t border-gray-800">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#F4B400] mb-2">6</p>
                    <p className="text-gray-500 text-sm">Books</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#F4B400] mb-2">3</p>
                    <p className="text-gray-500 text-sm">Genres</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-[#F4B400] mb-2">2025</p>
                    <p className="text-gray-500 text-sm">Since</p>
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href="/#contact"
                    className="text-[#F4B400] hover:text-white transition-colors inline-flex items-center gap-2 font-medium"
                  >
                    Get in touch for speaking engagements or collaborations →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-800 py-8 sm:py-12">
        <div className="container mx-auto px-6 sm:px-8 md:px-12">
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm">
            <p>&copy; 2026 Nick Irmo. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <a href="/#about" className="hover:text-white transition-colors">About</a>
              <a href="/#services" className="hover:text-white transition-colors">Services</a>
              <a href="/books" className="hover:text-white transition-colors">Books</a>
              <a href="/#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
