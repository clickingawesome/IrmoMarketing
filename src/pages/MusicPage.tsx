import { useEffect, useState } from 'react';
import { Music, Play, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import Header from '../components/Header';
import { buildMusicPageSchema } from '../lib/structuredData';

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

export default function MusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [albums, setAlbums] = useState<MusicAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);

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
        canonical="https://irmomarketing.com/music"
        structuredData={buildMusicPageSchema()}
      />
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-32 pb-20">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
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

          {albums.length > 0 && (
            <div className="border-t border-gray-700 pt-16">
              <h2 className="text-4xl font-bold text-white mb-12">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {albums.map((album) => (
                  <div key={album.id} className="group relative">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      {album.cover_image_url ? (
                        <img
                          src={album.cover_image_url}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-16 h-16 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-semibold mt-3 text-center line-clamp-2">
                      {album.title}
                    </h3>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      {album.spotify_url && (
                        <a
                          href={album.spotify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:text-green-400 transition-colors"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </a>
                      )}
                      {album.apple_music_url && (
                        <a
                          href={album.apple_music_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:text-pink-400 transition-colors"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.475 3.208c-.192.448-.292.925-.363 1.408-.056.392-.088.787-.1 1.18-.006.168-.01.337-.01.505v11.393c0 .164.004.328.01.49.013.394.044.786.1 1.175.071.484.173.96.362 1.407.564 1.328 1.53 2.25 2.865 2.78.703.278 1.447.358 2.193.4.152.01.303.017.455.027h12.01c.044-.003.087-.01.128-.013.525-.015 1.046-.057 1.562-.15.673-.12 1.303-.35 1.877-.724 1.12-.732 1.864-1.733 2.18-3.043.174-.72.24-1.45.24-2.19V6.124zM5.988.968h12.026c.036.003.072.01.107.012.428.014.852.05 1.27.127.558.1 1.043.293 1.457.624.67.535 1.062 1.24 1.228 2.073.1.502.13 1.01.13 1.52V17.675c0 .51-.03 1.017-.13 1.52-.165.833-.558 1.537-1.228 2.072-.414.332-.9.525-1.457.625-.418.078-.842.113-1.27.127-.035.004-.072.01-.107.013H5.988c-.035-.003-.072-.01-.106-.013-.428-.014-.852-.05-1.27-.127-.558-.1-1.043-.293-1.457-.624-.67-.535-1.062-1.24-1.228-2.073-.1-.502-.13-1.01-.13-1.52V6.323c0-.51.03-1.017.13-1.52.166-.833.558-1.537 1.228-2.072.414-.332.9-.525 1.457-.625.418-.078.842-.113 1.27-.127.035-.004.072-.01.106-.013z"/>
                            <path d="M18.093 11.388c-.04.003-.083.008-.124.013-1.46.13-2.647.915-3.374 2.18-.52.905-.738 1.888-.653 2.937.04.502.135 1.005.318 1.47.323.817.843 1.49 1.553 2.004.476.345 1.004.593 1.58.736.39.096.784.143 1.185.157.04.003.083.008.124.013v-9.51z"/>
                          </svg>
                        </a>
                      )}
                      {album.youtube_music_url && (
                        <a
                          href={album.youtube_music_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
                  src={`https://www.youtube-nocookie.com/embed/${selectedTrack.youtube_id}?autoplay=1&rel=0`}
                  title={selectedTrack.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </div>
              <div className="mt-4 text-white">
                <h2 className="text-2xl font-bold mb-2">{selectedTrack.title}</h2>
                {selectedTrack.description && (
                  <p className="text-gray-300">{selectedTrack.description}</p>
                )}
                <a
                  href={`https://www.youtube.com/watch?v=${selectedTrack.youtube_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-red-500 hover:text-red-400 underline"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
