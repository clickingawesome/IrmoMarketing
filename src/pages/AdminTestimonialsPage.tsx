import { useState, useEffect } from 'react';
import { supabase, type Testimonial } from '../lib/supabase';
import { Upload, Trash2, Star, User } from 'lucide-react';
import ImageCropper from '../components/ImageCropper';
import AdminNav from '../components/AdminNav';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    rating: 5,
    content: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropConfirm = (croppedBlob: Blob) => {
    const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(croppedBlob);

    setShowCropper(false);
    setTempImageSrc('');
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageSrc('');
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from('testimonial-avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('testimonial-avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let avatarUrl = null;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const { error } = await supabase.from('testimonials').insert([
        {
          ...formData,
          client_avatar: avatarUrl,
          order_index: testimonials.length,
        },
      ]);

      if (error) throw error;

      setFormData({
        client_name: '',
        client_role: '',
        rating: 5,
        content: '',
      });
      setAvatarFile(null);
      setAvatarPreview('');
      await fetchTestimonials();
      alert('Testimonial added successfully!');
    } catch (error) {
      console.error('Error adding testimonial:', error);
      alert('Error adding testimonial. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);

      if (error) throw error;

      await fetchTestimonials();
      alert('Testimonial deleted successfully!');
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f]">
        <AdminNav />
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showCropper && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
      <div className="min-h-screen bg-[#0f0f0f]">
        <AdminNav />
        <div className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12">
          Manage <span className="text-[#F4B400]">Testimonials</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6">Add New Testimonial</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Client Avatar</label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 flex-shrink-0 rounded-full bg-gradient-to-br from-[#F4B400] to-[#ff8c00] flex items-center justify-center overflow-hidden aspect-square">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-white" size={40} />
                    )}
                  </div>
                  <label className="flex-1 cursor-pointer">
                    <div className="bg-[#0f0f0f] border border-gray-700 hover:border-[#F4B400] transition-colors rounded-lg p-4 text-center">
                      <Upload className="inline-block text-[#F4B400] mb-2" size={24} />
                      <p className="text-gray-300 text-sm">Click to upload avatar</p>
                      <p className="text-gray-500 text-xs mt-1">JPG, PNG or WEBP (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Client Role *</label>
                <input
                  type="text"
                  required
                  value={formData.client_role}
                  onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
                  className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400]"
                  placeholder="CEO at Company Inc."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={
                          rating <= formData.rating
                            ? 'text-[#F4B400] fill-[#F4B400]'
                            : 'text-gray-600'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Testimonial Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  className="w-full bg-[#0f0f0f] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F4B400] resize-none"
                  placeholder="Write the testimonial content here..."
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#F4B400] hover:bg-[#ff8c00] text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Adding Testimonial...' : 'Add Testimonial'}
              </button>
            </form>
          </div>

          <div className="bg-[#1a1a1a] p-8 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Existing Testimonials ({testimonials.length})
            </h2>
            <div className="space-y-4 max-h-[800px] overflow-y-auto">
              {testimonials.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No testimonials yet. Add one to get started!</p>
              ) : (
                testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-[#0f0f0f] p-6 rounded-lg border border-gray-800"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 flex-shrink-0 rounded-full bg-gradient-to-br from-[#F4B400] to-[#ff8c00] flex items-center justify-center overflow-hidden aspect-square">
                        {testimonial.client_avatar ? (
                          <img
                            src={testimonial.client_avatar}
                            alt={testimonial.client_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="text-white" size={28} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-lg">{testimonial.client_name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.client_role}</p>
                        <div className="flex gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              size={16}
                              className={
                                index < testimonial.rating
                                  ? 'text-[#F4B400] fill-[#F4B400]'
                                  : 'text-gray-600'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{testimonial.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>
    </>
  );
}
