
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import SongCard from '../components/SongCard';

const Home = () => {
    const [trendingSongs, setTrendingSongs] = useState([]);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const { data } = await api.get('/songs/trending');
                setTrendingSongs(data);
            } catch (error) {
                console.error("Failed to fetch trending songs", error);
            }
        };
        fetchTrending();
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px' }}>Browse</h1>

            <section>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', color: '#fc3c44' }}>Trending Now</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '24px'
                }}>
                    {trendingSongs.map((song) => (
                        <SongCard key={song.id} song={song} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
