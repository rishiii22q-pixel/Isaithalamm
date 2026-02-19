import React, { useRef, useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp } from 'react-icons/fa';
import ReactPlayer from 'react-player';

const Player = () => {
    const { currentSong, isPlaying, togglePlay, volume, setVolume, setIsPlaying } = usePlayer();
    const [performed, setPerformed] = useState(0); // 0 to 1
    const [duration, setDuration] = useState(0);
    const playerRef = useRef(null);

    // Reset state when song changes
    useEffect(() => {
        setPerformed(0);
    }, [currentSong]);

    if (!currentSong) return null;

    const handleProgress = (state) => {
        if (!state.seeking) {
            setPerformed(state.played);
        }
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handleSeekChange = (e) => {
        setPerformed(parseFloat(e.target.value));
    };

    const handleSeekMouseUp = (e) => {
        playerRef.current.seekTo(parseFloat(e.target.value));
    };

    const formatTime = (seconds) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '90px',
            backgroundColor: 'rgba(28, 28, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            justifyContent: 'space-between',
            zIndex: 1000,
            color: '#fff'
        }}>
            {/* Hidden Player */}
            <div style={{ display: 'none' }}>
                <ReactPlayer
                    ref={playerRef}
                    url={currentSong.url}
                    playing={isPlaying}
                    volume={volume}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onEnded={() => setIsPlaying(false)} // TODO: Handle auto-next
                />
            </div>

            {/* Song Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '30%', minWidth: '200px' }}>
                <img
                    src={currentSong.image}
                    alt={currentSong.title}
                    style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}
                />
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentSong.title}
                    </div>
                    <div style={{ color: '#b3b3b3', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentSong.artist}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', fontSize: '20px', transition: 'color 0.2s' }} className="hover-white">
                        <FaStepBackward />
                    </button>

                    <button
                        onClick={togglePlay}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#fff',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#000',
                            transition: 'transform 0.1s'
                        }}
                    >
                        {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} style={{ marginLeft: '2px' }} />}
                    </button>

                    <button style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', fontSize: '20px', transition: 'color 0.2s' }} className="hover-white">
                        <FaStepForward />
                    </button>
                </div>

                {/* Scrubber */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '500px' }}>
                    <span style={{ fontSize: '11px', color: '#b3b3b3', minWidth: '40px', textAlign: 'right' }}>
                        {formatTime(duration * performed)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.001"
                        value={performed}
                        onChange={handleSeekChange}
                        onMouseUp={handleSeekMouseUp}
                        style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: `linear-gradient(to right, #fff ${performed * 100}%, #4d4d4d ${performed * 100}%)`,
                            appearance: 'none',
                            cursor: 'pointer'
                        }}
                    />
                    <span style={{ fontSize: '11px', color: '#b3b3b3', minWidth: '40px' }}>
                        {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Volume */}
            <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', minWidth: '150px' }}>
                <FaVolumeUp color="#b3b3b3" size={16} />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{
                        width: '100px',
                        height: '4px',
                        borderRadius: '2px',
                        background: `linear-gradient(to right, #fff ${volume * 100}%, #4d4d4d ${volume * 100}%)`,
                        appearance: 'none',
                        cursor: 'pointer'
                    }}
                />
            </div>

            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 12px;
                    width: 12px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                    visibility: hidden; 
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                div:hover input[type=range]::-webkit-slider-thumb {
                    visibility: visible;
                    opacity: 1;
                }
                .hover-white:hover {
                    color: #fff !important;
                }
            `}</style>
        </div>
    );
};

export default Player;
