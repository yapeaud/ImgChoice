import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import axios from 'axios'
import './App.css'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Navbar from './components/Navbar.jsx' 
import TopSearchesBanner from './components/TopSearchesBanner.jsx'

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${apiUrl}/auth/user`);
      if (response.data.authenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${apiUrl}/auth/logout`);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <article className="loading-container">
        <div className="spinner"></div>
      </article>
    );
  }

  return (
    <Router>
      <main className='App'>
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
            <Route 
            path="/login" 
            element={!user ? <Login onLogin={checkAuth} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
    </Router>
  )
}

export default App
