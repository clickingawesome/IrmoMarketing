import React, { useEffect, useState } from 'react';
import { Music, Play, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

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

export default function MusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);

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

  const getThumbnailUrl = (track: MusicTrack) => {
    if (track.thumbnail_url) return track.thumbnail_url;
    return `https://img.youtube.com/vi/${track.youtube_id}/maxresdefault.jpg`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading tracks...</div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Music & DJ Mixes - DJ Big Dill"
        description="Check out the latest DJ mixes and music productions by DJ Big Dill. Watch videos and listen to tracks on YouTube."
        keywords="DJ Big Dill, DJ mixes, music production, YouTube DJ, electronic music"
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Music className="w-12 h-12 text-red-500" />
              <h1 className="text-5xl font-bold text-white">Music & Mixes</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Latest DJ sets, remixes, and music productions
            </p>
          </div>

          {tracks.length === 0 ? (
            <div className="text-center py-20">
              <Music className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No tracks available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedTrack(track)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={getThumbnailUrl(track)}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white" fill="white" />
                      </div>
                    </div>
                    {track.is_featured && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {track.title}
                    </h3>
                    {track.description && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {track.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedTrack && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTrack(null)}
          >
            <div
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedTrack(null)}
                className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedTrack.youtube_id}?autoplay=1`}
                  title={selectedTrack.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4 text-white">
                <h2 className="text-2xl font-bold mb-2">{selectedTrack.title}</h2>
                {selectedTrack.description && (
                  <p className="text-gray-300">{selectedTrack.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
