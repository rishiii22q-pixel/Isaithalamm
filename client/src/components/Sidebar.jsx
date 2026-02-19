import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaMusic, FaSignOutAlt, FaHeart, FaCompactDisc, FaMicrophone, FaDownload } from 'react-icons/fa';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Home', path: '/', icon: <FaHome /> },
        { name: 'Search', path: '/search', icon: <FaSearch /> },
        { name: 'Library', path: '/library', icon: <FaMusic /> },
        { name: 'Liked Songs', path: '/liked', icon: <FaHeart /> },
    ];

    const libraryItems = [
        { name: 'Albums', path: '/albums', icon: <FaCompactDisc /> },
        { name: 'Artists', path: '/artists', icon: <FaMicrophone /> },
        { name: 'Downloads', path: '/downloads', icon: <FaDownload /> },
    ];

    return (
        <div className="sidebar" style={{
            width: '240px',
            backgroundColor: '#1c1c1e',
            height: '100%',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #2c2c2e',
            flexShrink: 0
        }}>
            {/* Logo */}
            <NavLink to="/" style={{ textDecoration: 'none' }}>
                <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #fc3c44 0%, #f94c57 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                    }}>
                        <FaMusic size={16} />
                    </div>
                    <h1 style={{
                        color: '#fff',
                        fontSize: '20px',
                        fontWeight: '700',
                        background: 'linear-gradient(90deg, #fff, #b3b3b3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0
                    }}>
                        Isaithalam
                    </h1>
                </div>
            </NavLink>

            <nav style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <p style={{ color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '12px' }}>Menu</p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                <div>
                    <p style={{ color: '#888', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '12px' }}>Library</p>
                    {libraryItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#ababab',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginTop: 'auto'
                }}
            >
                <FaSignOutAlt /> Logout
            </button>

            <style>{`
                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    color: #ababab;
                    text-decoration: none;
                    font-weight: 500;
                    margin-bottom: 4px;
                    transition: all 0.2s;
                }
                .nav-item:hover {
                    color: #fff;
                    background-color: rgba(255, 255, 255, 0.05);
                }
                .nav-item.active {
                    color: #fc3c44;
                    background-color: rgba(252, 60, 68, 0.1);
                    font-weight: 600;
                }
                
                @media (max-width: 768px) {
                    .sidebar {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Sidebar;
