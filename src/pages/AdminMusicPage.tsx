import React, { useEffect, useState } from 'react';
import { Music, Plus, Trash2, Star, ArrowUp, ArrowDown, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminNav from '../components/AdminNav';

interface MusicTrack {
  id: string;
  youtube_url: string;
  youtube_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  is_featured: boolean;
  display_order: number;
}

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);
  const [formData, setFormData] = useState({
    youtube_url: '',
    title: '',
    description: '',
    is_featured: false,
  });

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const fetchYouTubeData = async (videoId: string) => {
    try {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      return { thumbnailUrl };
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      return { thumbnailUrl: '' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const youtubeId = extractYouTubeId(formData.youtube_url);
    if (!youtubeId) {
      alert('Invalid YouTube URL. Please enter a valid YouTube video URL or ID.');
      return;
    }

    const { thumbnailUrl } = await fetchYouTubeData(youtubeId);

    try {
      if (editingTrack) {
        const { error } = await supabase
          .from('music_tracks')
          .update({
            youtube_url: formData.youtube_url,
            youtube_id: youtubeId,
            title: formData.title,
            description: formData.description,
            thumbnail_url: thumbnailUrl,
            is_featured: formData.is_featured,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTrack.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('music_tracks').insert({
          youtube_url: formData.youtube_url,
          youtube_id: youtubeId,
          title: formData.title,
          description: formData.description,
          thumbnail_url: thumbnailUrl,
          is_featured: formData.is_featured,
          display_order: tracks.length,
        });

        if (error) throw error;
      }

      setFormData({ youtube_url: '', title: '', description: '', is_featured: false });
      setShowForm(false);
      setEditingTrack(null);
      fetchTracks();
    } catch (error) {
      console.error('Error saving track:', error);
      alert('Failed to save track. Please try again.');
    }
  };

  const handleEdit = (track: MusicTrack) => {
    setEditingTrack(track);
    setFormData({
      youtube_url: track.youtube_url,
      title: track.title,
      description: track.description,
      is_featured: track.is_featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this track?')) return;

    try {
      const { error } = await supabase.from('music_tracks').delete().eq('id', id);
      if (error) throw error;
      fetchTracks();
    } catch (error) {
      console.error('Error deleting track:', error);
      alert('Failed to delete track. Please try again.');
    }
  };

  const handleReorder = async (trackId: string, direction: 'up' | 'down') => {
    const index = tracks.findIndex((t) => t.id === trackId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === tracks.length - 1)
    )
      return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reorderedTracks = [...tracks];
    const [movedTrack] = reorderedTracks.splice(index, 1);
    reorderedTracks.splice(newIndex, 0, movedTrack);

    const updates = reorderedTracks.map((track, idx) => ({
      id: track.id,
      display_order: idx,
    }));

    try {
      for (const update of updates) {
        await supabase
          .from('music_tracks')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
      fetchTracks();
    } catch (error) {
      console.error('Error reordering tracks:', error);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingTrack(null);
    setFormData({ youtube_url: '', title: '', description: '', is_featured: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-white">Manage Music Tracks</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Track
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingTrack ? 'Edit Track' : 'Add New Track'}
              </h2>
              <button onClick={cancelForm} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  YouTube URL or Video ID *
                </label>
                <input
                  type="text"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or video ID"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Track title"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-300">
                  Mark as Featured
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingTrack ? 'Update Track' : 'Add Track'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {tracks.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No tracks yet. Add your first track!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {tracks.map((track, index) => (
                <div key={track.id} className="p-4 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start gap-4">
                    <img
                      src={track.thumbnail_url || `https://img.youtube.com/vi/${track.youtube_id}/default.jpg`}
                      alt={track.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white truncate">
                              {track.title}
                            </h3>
                            {track.is_featured && (
                              <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" />
                            )}
                          </div>
                          {track.description && (
                            <p className="text-sm text-gray-400 line-clamp-2">{track.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">Video ID: {track.youtube_id}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleReorder(track.id, 'up')}
                            disabled={index === 0}
                            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move up"
                          >
                            <ArrowUp className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReorder(track.id, 'down')}
                            disabled={index === tracks.length - 1}
                            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move down"
                          >
                            <ArrowDown className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(track)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(track.id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
