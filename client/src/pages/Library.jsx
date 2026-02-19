import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus, FaMusic, FaPlay } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Library = () => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            const { data } = await api.get('/playlists');
            setPlaylists(data);
        } catch (error) {
            console.error('Error fetching playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    const createPlaylist = async (e) => {
        e.preventDefault();
        try {
            await api.post('/playlists', { name: newPlaylistName, isPublic: false });
            setNewPlaylistName('');
            setShowModal(false);
            fetchPlaylists();
        } catch (error) {
            console.error('Error creating playlist:', error);
        }
    };

    if (loading) return <div style={{ color: '#fff' }}>Loading Library...</div>;

    return (
        <div style={{ color: '#fff', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Your Library</h1>
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        backgroundColor: '#fc3c44',
                        color: '#fff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '24px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'transform 0.2s'
                    }}
                >
                    <FaPlus /> New Playlist
                </button>
            </div>

            {/* Playlists Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '24px'
            }}>
                {/* Create New Card (Visual shortcut) */}
                <div
                    onClick={() => setShowModal(true)}
                    style={{
                        backgroundColor: '#1c1c1e',
                        borderRadius: '12px',
                        padding: '24px',
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '1px dashed #333',
                        transition: 'background-color 0.2s',
                        color: '#ababab'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2c2c2e'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1c1c1e'; e.currentTarget.style.color = '#ababab'; }}
                >
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                    }}>
                        <FaPlus size={24} />
                    </div>
                    <span style={{ fontWeight: '600' }}>Create Playlist</span>
                </div>

                {playlists.map((playlist) => (
                    <div
                        key={playlist._id}
                        onClick={() => navigate(`/playlist/${playlist._id}`)}
                        style={{
                            backgroundColor: '#1c1c1e',
                            borderRadius: '12px',
                            padding: '16px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2c2c2e'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1c1c1e'}
                    >
                        <div style={{
                            width: '100%',
                            aspectRatio: '1',
                            backgroundColor: '#333',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {playlist.coverImage ? (
                                <img src={playlist.coverImage} alt={playlist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <FaMusic size={48} color="#555" />
                            )}

                            {/* Play Button Overlay */}
                            <div style={{
                                position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                backgroundColor: '#fc3c44',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                opacity: 0,
                                transition: 'opacity 0.2s'
                            }} className="hover-play-btn">
                                <FaPlay color="#fff" size={16} style={{ marginLeft: '2px' }} />
                            </div>
                        </div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {playlist.name}
                        </h3>
                        <p style={{ margin: 0, fontSize: '12px', color: '#ababab' }}>
                            {playlist.songs?.length || 0} Songs
                        </p>
                    </div>
                ))}
            </div>

            {/* Create Playlist Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(5px)'
                }} onClick={() => setShowModal(false)}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#1c1c1e',
                            padding: '32px',
                            borderRadius: '16px',
                            width: '400px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                        }}
                    >
                        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px' }}>Create Playlist</h2>
                        <form onSubmit={createPlaylist}>
                            <input
                                type="text"
                                placeholder="Playlist Name"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    backgroundColor: '#2c2c2e',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '16px',
                                    marginBottom: '24px',
                                    outline: 'none'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #333',
                                        color: '#fff',
                                        borderRadius: '24px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newPlaylistName.trim()}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#fc3c44',
                                        border: 'none',
                                        color: '#fff',
                                        borderRadius: '24px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        opacity: newPlaylistName.trim() ? 1 : 0.5
                                    }}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .hover-play-btn {
                    opacity: 0;
                }
                div:hover > div > .hover-play-btn {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

export default Library;
