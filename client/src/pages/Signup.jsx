
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (error) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            alert(message);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/');
        } catch (error) {
            console.error('Google signup error:', error);
            const message = error.response?.data?.message || 'Google Signup Failed. Please try again.';
            alert(message);
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff'
        }}>
            <div style={{ width: '360px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ color: '#fc3c44' }}></span> Isaithalam
                </h1>
                <p style={{ color: '#ababab', marginBottom: '32px' }}>Create your account</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#1c1c1e', border: '1px solid #333', color: '#fff', fontSize: '16px' }}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#1c1c1e', border: '1px solid #333', color: '#fff', fontSize: '16px' }}
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#1c1c1e', border: '1px solid #333', color: '#fff', fontSize: '16px' }}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ padding: '16px', borderRadius: '8px', backgroundColor: '#1c1c1e', border: '1px solid #333', color: '#fff', fontSize: '16px' }}
                    />
                    <button
                        type="submit"
                        style={{ padding: '14px', borderRadius: '8px', backgroundColor: '#fc3c44', border: 'none', color: '#fff', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}
                    >
                        Create Account
                    </button>
                </form>

                <div style={{ margin: '24px 0', borderTop: '1px solid #333', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#000', padding: '0 8px', color: '#ababab', fontSize: '12px' }}>OR</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Signup Failed')}
                        theme="filled_black"
                        shape="circle"
                        text="signup_with"
                    />
                </div>

                <p style={{ marginTop: '24px', color: '#ababab' }}>
                    Already have an account? <Link to="/login" style={{ color: '#fc3c44', textDecoration: 'none' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
