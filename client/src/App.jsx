import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PlaylistDetails from './pages/PlaylistDetails';
import LikedSongs from './pages/LikedSongs';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="library" element={<Library />} />
        <Route path="playlist/:id" element={<PlaylistDetails />} />
        <Route path="liked" element={<LikedSongs />} />

        {/* Placeholders */}
        <Route path="albums" element={<Library />} />
        <Route path="artists" element={<Search />} />
        <Route path="downloads" element={<Library />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </AuthProvider>
  );
};

export default App;
