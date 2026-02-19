import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaTrash, FaClock } from 'react-icons/fa';

const PlaylistDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playSong } = usePlayer();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlaylist();
    }, [id]);

    const fetchPlaylist = async () => {
        try {
            const { data } = await api.get(`/playlists/${id}`);
            setPlaylist(data);
        } catch (error) {
            console.error('Error fetching playlist:', error);
            // navigate('/library');
        } finally {
            setLoading(false);
        }
    };

    const removeSong = async (songId) => {
        if (!window.confirm('Remove this song from playlist?')) return;
        try {
            await api.delete(`/playlists/${id}/songs/${songId}`);
            fetchPlaylist();
        } catch (error) {
            console.error('Error removing song:', error);
        }
    };

    const playPlaylist = () => {
        if (playlist && playlist.songs.length > 0) {
            playSong(playlist.songs[0]);
            // TODO: Queue implementation
        }
    };

    if (loading) return <div style={{ color: '#fff', padding: '24px' }}>Loading...</div>;
    if (!playlist) return <div style={{ color: '#fff', padding: '24px' }}>Playlist not found</div>;

    return (
        <div style={{ paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div style={{
                    width: '232px',
                    height: '232px',
                    backgroundColor: '#333',
                    boxShadow: '0 4px 60px rgba(0,0,0,0.5)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {playlist.songs?.[0]?.image ? (
                        <img src={playlist.songs[0].image} alt={playlist.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '64px' }}>♫</span>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Playlist</span>
                    <h1 style={{ fontSize: '96px', fontWeight: '900', margin: '0.08em 0 0.12em', lineHeight: '1' }}>
                        {playlist.name}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ababab', fontSize: '14px' }}>
                        <span style={{ color: '#fff', fontWeight: '700' }}>User</span>
                        <span>•</span>
                        <span>{playlist.songs.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '32px' }}>
                <button
                    onClick={playPlaylist}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: '#fc3c44',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.1s',
                        color: '#fff'
                    }}
                >
                    <FaPlay size={24} style={{ marginLeft: '4px' }} />
                </button>
            </div>

            {/* Songs List */}
            <div>
                <div style={{ display: 'grid', gridTemplateColumns: '16px 4fr 3fr 2fr 1fr', padding: '0 16px', borderBottom: '1px solid #333', color: '#ababab', fontSize: '12px', textTransform: 'uppercase', height: '36px', alignItems: 'center' }}>
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <span>Date Added</span>
                    <span style={{ textAlign: 'right' }}><FaClock /></span>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column' }}>
                    {playlist.songs.map((song, index) => (
                        <div
                            key={song.songId}
                            className="playlist-row"
                            onClick={() => playSong(song)}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '16px 4fr 3fr 2fr 1fr',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                alignItems: 'center',
                                color: '#ababab',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#2a2a2a';
                                e.currentTarget.querySelector('.row-num').style.opacity = '0';
                                e.currentTarget.querySelector('.row-play').style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.querySelector('.row-num').style.opacity = '1';
                                e.currentTarget.querySelector('.row-play').style.opacity = '0';
                            }}
                        >
                            <div style={{ position: 'relative', height: '16px', display: 'flex', alignItems: 'center' }}>
                                <span className="row-num" style={{ position: 'absolute', transition: 'opacity 0.2s' }}>{index + 1}</span>
                                <FaPlay className="row-play" size={10} color="#fff" style={{ position: 'absolute', opacity: 0, transition: 'opacity 0.2s' }} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <img src={song.image} alt={song.title} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                                    <div style={{ fontSize: '14px' }}>{song.artist}</div>
                                </div>
                            </div>

                            <div>{song.album || 'Single'}</div>
                            <div>Now</div>

                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
                                <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeSong(song.songId); }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#ababab',
                                        cursor: 'pointer',
                                        opacity: 0,
                                        transition: 'opacity 0.2s'
                                    }}
                                    className="delete-btn"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .playlist-row:hover .delete-btn {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default PlaylistDetails;
