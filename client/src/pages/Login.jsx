import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            alert('Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/');
        } catch (error) {
            console.error('Full login error:', error);
            const message = error.response?.data?.message || 'Google Login Failed. Please try again.';
            alert(message);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1c1c1e 0%, #000 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient Background Elements */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(252,60,68,0.15) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '360px', textAlign: 'center', zIndex: 1, position: 'relative' }}
            >
                <div style={{ marginBottom: '32px' }}>
                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <span style={{ color: '#fc3c44' }}></span> Isaithalam
                    </motion.h1>
                    <p style={{ color: '#ababab' }}>Sign in to start listening</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="email"
                        placeholder="Apple ID (Email)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(28, 28, 30, 0.8)',
                            border: '1px solid #333',
                            color: '#fff',
                            fontSize: '16px',
                            outline: 'none',
                            backdropFilter: 'blur(10px)'
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(28, 28, 30, 0.8)',
                            border: '1px solid #333',
                            color: '#fff',
                            fontSize: '16px',
                            outline: 'none',
                            backdropFilter: 'blur(10px)'
                        }}
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        style={{
                            padding: '16px',
                            borderRadius: '12px',
                            backgroundColor: '#fc3c44',
                            border: 'none',
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginTop: '8px',
                            boxShadow: '0 4px 12px rgba(252, 60, 68, 0.3)'
                        }}
                    >
                        Sign In
                    </motion.button>
                </form>

                <div style={{ margin: '32px 0', borderTop: '1px solid #333', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#141414', padding: '0 12px', color: '#ababab', fontSize: '12px', borderRadius: '4px' }}>OR</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Login Failed')}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        width="360"
                        logo_alignment="center"
                    />
                </div>

                <p style={{ marginTop: '32px', color: '#ababab', fontSize: '14px' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#fc3c44', textDecoration: 'none', fontWeight: '500' }}>Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
