import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SongCard from '../components/SongCard';
import { FaSearch, FaTimes, FaPlus } from 'react-icons/fa';

const Search = () => {
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Add to Playlist Modal State
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    useEffect(() => {
        // Load trending initially
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/songs/trending');
            setSongs(data);
        } catch (error) {
            console.error('Error fetching trending:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.get(`/songs/search?q=${encodeURIComponent(query)}`);
            setSongs(data);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const openAddToPlaylist = async (song) => {
        setSelectedSong(song);
        setShowPlaylistModal(true);
        // Fetch playlists
        try {
            const { data } = await api.get('/playlists');
            setPlaylists(data);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        }
    };

    const addToPlaylist = async (playlistId) => {
        if (!selectedSong) return;
        try {
            await api.post(`/playlists/${playlistId}/songs`, {
                songId: selectedSong.id,
                title: selectedSong.title,
                artist: selectedSong.artist,
                image: selectedSong.image,
                duration: selectedSong.durationSec,
                url: selectedSong.url
            });
            setShowPlaylistModal(false);
            alert('Added to playlist!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add song');
        }
    };

    const createAndAdd = async () => {
        if (!newPlaylistName.trim()) return;
        try {
            // Create
            const { data: playlist } = await api.post('/playlists', { name: newPlaylistName, isPublic: false });
            // Add
            addToPlaylist(playlist._id);
            setNewPlaylistName('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ position: 'sticky', top: '0', zIndex: 10, backgroundColor: '#000', padding: '16px 0' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#1c1c1e',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    border: '1px solid #333'
                }}>
                    <FaSearch color="#ababab" />
                    <input
                        type="text"
                        placeholder="Artists, Songs, Lyrics and more"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#fff',
                            marginLeft: '12px',
                            fontSize: '16px',
                            outline: 'none'
                        }}
                    />
                    {query && (
                        <FaTimes
                            color="#ababab"
                            style={{ cursor: 'pointer' }}
                            onClick={() => { setQuery(''); fetchTrending(); }}
                        />
                    )}
                </div>
            </form>

            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '16px 0 24px', color: '#fff' }}>
                {query ? 'Top Results' : 'Trending Now'}
            </h2>

            {loading ? (
                <div style={{ color: '#ababab' }}>Searching...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '24px'
                }}>
                    {songs.map((song) => (
                        <SongCard
                            key={song.id}
                            song={song}
                            onAdd={() => openAddToPlaylist(song)}
                        />
                    ))}
                </div>
            )}

            {/* Add to Playlist Modal */}
            {showPlaylistModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(5px)'
                }} onClick={() => setShowPlaylistModal(false)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#1c1c1e',
                            padding: '32px',
                            borderRadius: '16px',
                            width: '400px',
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            color: '#fff'
                        }}
                    >
                        <h3 style={{ margin: '0 0 24px 0' }}>Add to Playlist</h3>

                        <div style={{ overflowY: 'auto', flex: 1, marginBottom: '24px' }}>
                            {playlists.map(playlist => (
                                <div
                                    key={playlist._id}
                                    onClick={() => addToPlaylist(playlist._id)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        marginBottom: '8px',
                                        backgroundColor: '#2c2c2e' // slightly lighter
                                    }}
                                >
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaPlus size={12} />
                                    </div>
                                    <span>{playlist.name}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid #333', paddingTop: '16px' }}>
                            <p style={{ fontSize: '12px', color: '#ababab', marginBottom: '8px' }}>Or create new playlist</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="New Playlist Name"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: '#2c2c2e',
                                        border: '1px solid #333',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <button
                                    onClick={createAndAdd}
                                    style={{
                                        padding: '10px 16px',
                                        backgroundColor: '#fc3c44',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
