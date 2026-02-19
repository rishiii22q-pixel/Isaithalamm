import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSearch, FaMusic, FaHeart } from 'react-icons/fa';

const BottomNav = () => {
    const navItems = [
        { name: 'Home', path: '/', icon: <FaHome size={20} /> },
        { name: 'Search', path: '/search', icon: <FaSearch size={20} /> },
        { name: 'Library', path: '/library', icon: <FaMusic size={20} /> },
        { name: 'Liked', path: '/liked', icon: <FaHeart size={20} /> },
    ];

    return (
        <div className="bottom-nav" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            backgroundColor: 'rgba(28, 28, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 900,
            paddingBottom: 'safe-area-inset-bottom'
        }}>
            {navItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#fc3c44' : '#888',
                        textDecoration: 'none',
                        fontSize: '10px',
                        gap: '4px',
                        width: '100%',
                        height: '100%'
                    })}
                >
                    {item.icon}
                    <span>{item.name}</span>
                </NavLink>
            ))}
            <style>{`
                .bottom-nav {
                    display: none;
                }
                @media (max-width: 768px) {
                    .bottom-nav {
                        display: flex;
                    }
                }
            `}</style>
        </div>
    );
};

export default BottomNav;
