import React from 'react'
import '../styles/Login.css';

const Login = ({ onLogin }) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    // Fonction pour gérer la redirection OAuth
    const handleOAuthLogin = (provider) => {
        window.location.href = `${apiUrl}/auth/${provider}`;
    };

    return (
        <main className="login-container">
            <section className="login-card">
                <h1>🔍 Recherche d'Images</h1>
                <p className="login-subtitle">Connectez-vous pour rechercher des images</p>

                <article className='oauth-buttons'>
                    <button
                        className="oauth-btn google-btn"
                        onClick={() => handleOAuthLogin('google')}
                    >
                        <span className="oauth-icon">🔴</span>
                        Continuer avec Google
                    </button>

                    <button
                        className="oauth-btn facebook-btn"
                        onClick={() => handleOAuthLogin('facebook')}
                    >
                        <span className="oauth-icon">🔵</span>
                        Continuer avec Facebook
                    </button>

                    <button
                        className="oauth-btn github-btn"
                        onClick={() => handleOAuthLogin('github')}
                    >
                        <span className="oauth-icon">⚫</span>
                        Continuer avec GitHub
                    </button>
                </article>
            </section>
        </main>
    )
}

export default Login
