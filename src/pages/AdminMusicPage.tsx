import React, { useEffect, useState } from 'react';
import { Music, Plus, Trash2, Star, ArrowUp, ArrowDown, Save, X, Upload, Disc } from 'lucide-react';
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

interface MusicAlbum {
  id: string;
  title: string;
  cover_image_url: string;
  spotify_url: string;
  apple_music_url: string;
  youtube_music_url: string;
  display_order: number;
}

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [albums, setAlbums] = useState<MusicAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);
  const [formData, setFormData] = useState({
    youtube_url: '',
    title: '',
    description: '',
    is_featured: false,
  });
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<MusicAlbum | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tracks' | 'albums'>('tracks');

  useEffect(() => {
    fetchTracks();
    fetchAlbums();
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

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('music_albums')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlbums(data || []);
    } catch (error) {
      console.error('Error fetching albums:', error);
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

  const handleAlbumCoverUpload = async (file: File, albumId?: string) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('album-covers')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('album-covers')
        .getPublicUrl(fileName);

      if (albumId && editingAlbum) {
        const { error: updateError } = await supabase
          .from('music_albums')
          .update({ cover_image_url: publicUrl })
          .eq('id', albumId);

        if (updateError) throw updateError;

        setEditingAlbum({ ...editingAlbum, cover_image_url: publicUrl });
      }

      return publicUrl;
    } catch (error) {
      console.error('Error uploading cover:', error);
      alert('Failed to upload album cover');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const albumData = {
      title: formData.get('title') as string,
      spotify_url: formData.get('spotify_url') as string || '',
      apple_music_url: formData.get('apple_music_url') as string || '',
      youtube_music_url: formData.get('youtube_music_url') as string || '',
      cover_image_url: editingAlbum?.cover_image_url || '',
    };

    try {
      if (editingAlbum?.id) {
        const { error } = await supabase
          .from('music_albums')
          .update(albumData)
          .eq('id', editingAlbum.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('music_albums')
          .insert([albumData]);
        if (error) throw error;
      }

      await fetchAlbums();
      setShowAlbumForm(false);
      setEditingAlbum(null);
    } catch (error) {
      console.error('Error saving album:', error);
      alert('Failed to save album');
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album?')) return;

    try {
      const { error } = await supabase
        .from('music_albums')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAlbums();
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Failed to delete album');
    }
  };

  const openAddAlbum = () => {
    setEditingAlbum({
      id: '',
      title: '',
      cover_image_url: '',
      spotify_url: '',
      apple_music_url: '',
      youtube_music_url: '',
      display_order: 0,
    });
    setShowAlbumForm(true);
  };

  const openEditAlbum = (album: MusicAlbum) => {
    setEditingAlbum(album);
    setShowAlbumForm(true);
  };

  const handleAlbumReorder = async (albumId: string, direction: 'up' | 'down') => {
    const index = albums.findIndex((a) => a.id === albumId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === albums.length - 1)
    )
      return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const reorderedAlbums = [...albums];
    const [movedAlbum] = reorderedAlbums.splice(index, 1);
    reorderedAlbums.splice(newIndex, 0, movedAlbum);

    const updates = reorderedAlbums.map((album, idx) => ({
      id: album.id,
      display_order: idx,
    }));

    try {
      for (const update of updates) {
        await supabase
          .from('music_albums')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
      fetchAlbums();
    } catch (error) {
      console.error('Error reordering albums:', error);
    }
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
            <h1 className="text-3xl font-bold text-white">Manage Music</h1>
          </div>
        </div>

        <div className="flex gap-1 mb-8 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tracks' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Tracks ({tracks.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'albums' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <Disc className="w-4 h-4" />
              Albums ({albums.length})
            </span>
          </button>
        </div>

        {activeTab === 'tracks' && (
          <>
            <div className="flex justify-end mb-6">
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
          </>
        )}

        {activeTab === 'albums' && (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={openAddAlbum}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Album
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
              {albums.length === 0 ? (
                <div className="text-center py-12">
                  <Disc className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No albums yet. Add your first album!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {albums.map((album, index) => (
                    <div key={album.id} className="p-4 hover:bg-gray-750 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                          {album.cover_image_url ? (
                            <img
                              src={album.cover_image_url}
                              alt={album.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Disc className="w-8 h-8 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">{album.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            {album.spotify_url && <span className="text-xs text-green-500">Spotify</span>}
                            {album.apple_music_url && <span className="text-xs text-pink-500">Apple Music</span>}
                            {album.youtube_music_url && <span className="text-xs text-red-500">YouTube Music</span>}
                            {!album.spotify_url && !album.apple_music_url && !album.youtube_music_url && (
                              <span className="text-xs text-gray-500">No streaming links</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleAlbumReorder(album.id, 'up')}
                            disabled={index === 0}
                            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move up"
                          >
                            <ArrowUp className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAlbumReorder(album.id, 'down')}
                            disabled={index === albums.length - 1}
                            className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Move down"
                          >
                            <ArrowDown className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openEditAlbum(album)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAlbum(album.id)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showAlbumForm && editingAlbum && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAlbumForm(false);
            setEditingAlbum(null);
          }}
        >
          <div
            className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingAlbum.id ? 'Edit Album' : 'Add Album'}
              </h2>
              <button
                onClick={() => {
                  setShowAlbumForm(false);
                  setEditingAlbum(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Album Cover
                </label>
                <div className="flex items-start gap-4">
                  <div className="w-48 h-48 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {editingAlbum.cover_image_url ? (
                      <img
                        src={editingAlbum.cover_image_url}
                        alt="Album cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleAlbumCoverUpload(file, editingAlbum.id || undefined);
                          if (url) {
                            setEditingAlbum({ ...editingAlbum, cover_image_url: url });
                          }
                        }
                      }}
                      className="hidden"
                      id="cover-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="cover-upload"
                      className={`flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload className="w-5 h-5" />
                      {uploading ? 'Uploading...' : 'Upload Cover'}
                    </label>
                    <p className="text-gray-400 text-sm mt-2">
                      Square images work best (e.g., 1000x1000px)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Album Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingAlbum.title}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter album title"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Spotify URL
                </label>
                <input
                  type="url"
                  name="spotify_url"
                  defaultValue={editingAlbum.spotify_url}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://open.spotify.com/album/..."
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Apple Music URL
                </label>
                <input
                  type="url"
                  name="apple_music_url"
                  defaultValue={editingAlbum.apple_music_url}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://music.apple.com/album/..."
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  YouTube Music URL
                </label>
                <input
                  type="url"
                  name="youtube_music_url"
                  defaultValue={editingAlbum.youtube_music_url}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://music.youtube.com/playlist/..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {editingAlbum.id ? 'Update Album' : 'Add Album'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAlbumForm(false);
                    setEditingAlbum(null);
                  }}
                  className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
