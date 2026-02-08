import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase, type Book } from '../lib/supabase';

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .eq('show_on_homepage', true)
          .order('order_index', { ascending: true })
          .limit(3);

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

  if (loading) {
    return (
      <section id="books" className="py-24 bg-[#0f0f0f]">
        <div className="container mx-auto px-12">
          <div className="text-center">
            <div className="text-gray-400 text-xl">Loading books...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="books" className="py-16 sm:py-24 bg-[#0f0f0f]">
      <div className="container mx-auto px-6 sm:px-8 md:px-12">
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 sm:mb-8 px-4">
            <span className="text-[#F4B400]">Published</span> <span className="text-white">Books</span>
          </h2>
          <p className="text-gray-400 max-w-4xl mx-auto text-base sm:text-lg md:text-xl px-4">
            Sharing knowledge and insights across various fields
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {books.map((book) => (
            <div key={book.id} className="group cursor-pointer">
              {book.cover_image_vertical ? (
                <div className="aspect-[3/4] relative" style={{ perspective: '1000px' }}>
                  <div className="w-full h-full preserve-3d transition-transform duration-700 group-hover:rotate-y-180">
                    {/* Front - Image */}
                    <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-black">
                      <img
                        src={book.cover_image_vertical}
                        alt={book.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {/* Back - Color card */}
                    <div
                      className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg flex flex-col items-center justify-center p-6 sm:p-12"
                      style={{ backgroundColor: book.cover_color, transform: 'rotateY(180deg)' }}
                    >
                      <BookOpen className="text-white/80 mb-4 sm:mb-6" size={56} />
                      <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-3">
                        {book.title}
                      </h3>
                      {book.subtitle && (
                        <p className="text-white/80 text-sm sm:text-base text-center">
                          {book.subtitle}
                        </p>
                      )}
                      {book.year && (
                        <p className="text-white/60 text-xs sm:text-sm mt-4 sm:mt-6">{book.year}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="aspect-[3/4] rounded-lg flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: book.cover_color }}
                >
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  <BookOpen className="text-white/80 mb-4 sm:mb-6 relative z-10" size={56} />
                  <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-3 relative z-10">
                    {book.title}
                  </h3>
                  {book.subtitle && (
                    <p className="text-white/80 text-sm sm:text-base text-center relative z-10">
                      {book.subtitle}
                    </p>
                  )}
                  {book.year && (
                    <p className="text-white/60 text-xs sm:text-sm mt-4 sm:mt-6 relative z-10">{book.year}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center px-4">
          <button
            onClick={() => navigate('/books')}
            className="bg-[#F4B400] text-black px-8 sm:px-12 py-4 sm:py-5 rounded-md font-semibold hover:bg-[#e5a800] transition-colors text-lg sm:text-xl"
          >
            View All Books
          </button>
        </div>
      </div>
    </section>
  );
}
