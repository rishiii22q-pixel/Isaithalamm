import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SongCard from '../components/SongCard';
import { FaHeart } from 'react-icons/fa';

const LikedSongs = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLikedSongs();
    }, []);

    const fetchLikedSongs = async () => {
        try {
            // Since we updated User model to store liked songs, we can just fetch user data
            // Or if we had a dedicated endpoint. Let's assume we fetch user profile which includes likedSongs
            const { data } = await api.get('/auth/me');
            if (data.likedSongs) {
                // Map to match SongCard expectation (id vs songId)
                const formattedSongs = data.likedSongs.map(s => ({
                    id: s.songId,
                    title: s.title,
                    artist: s.artist,
                    image: s.image,
                    url: s.url,
                    duration: s.duration,
                    durationSec: s.duration // Assuming duration was stored as seconds
                })).reverse(); // Show newest first
                setSongs(formattedSongs);
            }
        } catch (error) {
            console.error('Error fetching liked songs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ color: '#fff', padding: '24px' }}>Loading...</div>;

    return (
        <div style={{ color: '#fff', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div style={{
                    width: '232px',
                    height: '232px',
                    background: 'linear-gradient(135deg, #450af5, #c4efd9)',
                    boxShadow: '0 4px 60px rgba(0,0,0,0.5)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <FaHeart size={80} color="#fff" />
                </div>

                <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Playlist</span>
                    <h1 style={{ fontSize: '96px', fontWeight: '900', margin: '0.08em 0 0.12em', lineHeight: '1' }}>
                        Liked Songs
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ababab', fontSize: '14px' }}>
                        <span style={{ color: '#fff', fontWeight: '700' }}>You</span>
                        <span>•</span>
                        <span>{songs.length} songs</span>
                    </div>
                </div>
            </div>

            {songs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', color: '#ababab' }}>
                    <h2>No liked songs yet</h2>
                    <p>Tap the heart icon on any song to add it here.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '24px'
                }}>
                    {songs.map((song) => (
                        <SongCard key={song.id} song={song} />
                    ))}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    h1 { font-size: 48px !important; }
                    .header-img { width: 150px !important; height: 150px !important; }
                }
            `}</style>
        </div>
    );
};

export default LikedSongs;
