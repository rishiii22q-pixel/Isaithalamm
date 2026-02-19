
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Player from './Player';
import BottomNav from './BottomNav';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#fff', overflow: 'hidden' }}>
            <Sidebar />

            <div className="main-content" style={{
                flex: 1,
                padding: isMobile ? '16px' : '24px',
                overflowY: 'auto',
                paddingBottom: isMobile ? '160px' : '100px', // Extra padding for bottom nav + player
                backgroundColor: '#000',
                width: '100%'
            }}>
                <Outlet />
            </div>

            {isMobile && <BottomNav />}
            <Player />

            <style>{`
                @media (max-width: 768px) {
                    .main-content {
                        padding: 16px;
                        padding-bottom: 160px !important; 
                    }
                }
            `}</style>
        </div>
    );
};

export default Layout;
