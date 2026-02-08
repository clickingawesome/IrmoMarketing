import { useEffect, useState } from 'react';
import { Upload, Image as ImageIcon, Save } from 'lucide-react';
import { supabase, type Book } from '../lib/supabase';
import AdminNav from '../components/AdminNav';

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingBookId, setUploadingBookId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

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
      showMessage('error', 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleImageUpload(bookId: string, file: File, type: 'vertical' | 'horizontal' | 'featured') {
    try {
      setUploadingBookId(bookId);

      const fileExt = file.name.split('.').pop();
      const fileName = `${bookId}_${type}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('book_covers')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('book_covers')
        .getPublicUrl(filePath);

      const fieldName = type === 'vertical'
        ? 'cover_image_vertical'
        : type === 'horizontal'
        ? 'cover_image_horizontal'
        : 'featured_image';

      const { error: updateError } = await supabase
        .from('books')
        .update({ [fieldName]: urlData.publicUrl })
        .eq('id', bookId);

      if (updateError) throw updateError;

      await fetchBooks();
      const typeLabel = type === 'vertical' ? 'Vertical' : type === 'horizontal' ? 'Horizontal' : 'Featured';
      showMessage('success', `${typeLabel} cover uploaded successfully`);
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'Failed to upload image');
    } finally {
      setUploadingBookId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <AdminNav />
        <div className="py-20">
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
    <div className="min-h-screen bg-[#0f0f0f]">
      <AdminNav />

      <div className="py-12">
        <div className="container mx-auto px-6 max-w-7xl">

          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-white">Manage Book </span>
              <span className="text-[#F4B400]">Covers</span>
            </h1>
            <p className="text-gray-400">
              Upload cover images for your books. Vertical covers (3:4 aspect ratio) appear on the homepage.
              Horizontal covers (16:10 aspect ratio) appear in the books collection grid.
              Featured books can have a third image for the hero section on the Books page.
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-900/20 border border-green-700 text-green-400' : 'bg-red-900/20 border border-red-700 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6"
              >
                <div className="grid lg:grid-cols-[1fr,2fr] gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{book.title}</h3>
                    {book.subtitle && (
                      <p className="text-gray-400 mb-4">{book.subtitle}</p>
                    )}
                    <div className="flex gap-2 mb-4">
                      {book.is_featured && (
                        <span className="bg-[#F4B400] text-black text-xs font-bold px-2 py-1 rounded">
                          FEATURED
                        </span>
                      )}
                      {book.show_on_homepage && (
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                          ON HOMEPAGE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`grid gap-6 ${book.is_featured ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                          Vertical Cover (3:4)
                        </h4>
                        {book.cover_image_vertical && (
                          <ImageIcon className="text-green-500" size={16} />
                        )}
                      </div>

                      {book.cover_image_vertical && (
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black">
                          <img
                            src={book.cover_image_vertical}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(book.id, file, 'vertical');
                          }}
                          disabled={uploadingBookId === book.id}
                          className="hidden"
                        />
                        <div className={`flex items-center justify-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                          uploadingBookId === book.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}>
                          <Upload size={16} />
                          {uploadingBookId === book.id ? 'Uploading...' : book.cover_image_vertical ? 'Replace' : 'Upload'}
                        </div>
                      </label>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                          Horizontal Cover (16:10)
                        </h4>
                        {book.cover_image_horizontal && (
                          <ImageIcon className="text-green-500" size={16} />
                        )}
                      </div>

                      {book.cover_image_horizontal && (
                        <div className="aspect-[16/10] rounded-lg overflow-hidden bg-black">
                          <img
                            src={book.cover_image_horizontal}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(book.id, file, 'horizontal');
                          }}
                          disabled={uploadingBookId === book.id}
                          className="hidden"
                        />
                        <div className={`flex items-center justify-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                          uploadingBookId === book.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}>
                          <Upload size={16} />
                          {uploadingBookId === book.id ? 'Uploading...' : book.cover_image_horizontal ? 'Replace' : 'Upload'}
                        </div>
                      </label>
                    </div>

                    {book.is_featured && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                            Featured Hero Image
                          </h4>
                          {book.featured_image && (
                            <ImageIcon className="text-green-500" size={16} />
                          )}
                        </div>

                        {book.featured_image && (
                          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black">
                            <img
                              src={book.featured_image}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <label className="block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(book.id, file, 'featured');
                            }}
                            disabled={uploadingBookId === book.id}
                            className="hidden"
                          />
                          <div className={`flex items-center justify-center gap-2 bg-[#F4B400] hover:bg-[#d99f00] text-black font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                            uploadingBookId === book.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}>
                            <Upload size={16} />
                            {uploadingBookId === book.id ? 'Uploading...' : book.featured_image ? 'Replace' : 'Upload'}
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {books.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400">No books found. Add some books to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
