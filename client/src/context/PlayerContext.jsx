
import { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [volume, setVolume] = useState(0.8);

    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const addToQueue = (song) => setQueue([...queue, song]);

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                queue,
                volume,
                playSong,
                togglePlay,
                addToQueue,
                setVolume,
                setIsPlaying,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};
