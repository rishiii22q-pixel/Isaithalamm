import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPlus, FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../services/api';

const SongCard = ({ song, onAdd }) => {
    const { playSong } = usePlayer();
    const [liked, setLiked] = useState(false); // Optimistic UI for now

    // Handle play click
    const handlePlay = (e) => {
        e.stopPropagation();
        playSong(song);
    };

    // Handle add click
    const handleAdd = (e) => {
        e.stopPropagation();
        if (onAdd) onAdd(song);
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        setLiked(!liked);
        try {
            if (!liked) {
                await api.post('/auth/like', {
                    songId: song.id,
                    title: song.title,
                    artist: song.artist,
                    image: song.image,
                    url: song.url,
                    duration: song.durationSec || 0
                });
            } else {
                await api.delete(`/auth/like/${song.id}`);
            }
        } catch (error) {
            console.error('Error liking song:', error);
            setLiked(liked); // Revert
        }
    };

    return (
        <div
            onClick={handlePlay}
            style={{
                cursor: 'pointer',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#1c1c1e',
                transition: 'background-color 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                width: '100%',
                boxSizing: 'border-box'
            }}
            className="song-card"
        >
            <div style={{ position: 'relative', width: '100%', paddingTop: '100%' }}>
                <img
                    src={song.image}
                    alt={song.title}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                        objectFit: 'cover'
                    }}
                />

                {/* Play Button Overlay */}
                <div
                    onClick={handlePlay}
                    style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        backgroundColor: '#fc3c44',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        zIndex: 2
                    }}
                    className="play-btn"
                >
                    <FaPlay color="#fff" size={14} style={{ marginLeft: '2px' }} />
                </div>
            </div>

            <div>
                <h3 style={{
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {song.title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <p style={{
                        color: '#ababab',
                        fontSize: '12px',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1
                    }}>
                        {song.artist}
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handleLike}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: liked ? '#fc3c44' : '#ababab',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            className="action-btn"
                            title={liked ? "Unlike" : "Like"}
                        >
                            {liked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                        </button>

                        {onAdd && (
                            <button
                                onClick={handleAdd}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#ababab',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                className="action-btn"
                                title="Add to Playlist"
                            >
                                <FaPlus size={12} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .song-card:hover {
                    background-color: #2c2c2e;
                }
                .song-card:hover .play-btn {
                    opacity: 1;
                }
                .action-btn:hover {
                    color: #fc3c44 !important;
                    background-color: rgba(252, 60, 68, 0.1) !important;
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
};

export default SongCard;
