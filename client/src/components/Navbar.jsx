import React from 'react'
import '../styles/Navbar.css'

// Composant de la barre de navigation
const Navbar = ({ user, onLogout }) => {
    return (
        <nav className='navbar'>
            <main className='navbar-container'>
                <article className='navbar-brand'>
                    <h1>🔍 Recherche d'Images</h1>
                </article>
                <section className='navbar-user'>
                    <article className='user-info'>
                        {/* {user.avatar && (
                            <img src={user.avatar} alt={user.name} className="user-avatar" />
                        )} */}
                        {/* <span>{user.name}</span>
                        <span className='user-provider'>({user.provider})</span> */}
                        <button className='logout-btn' onClick={onLogout}>Déconnexion</button>
                    </article>
                </section>
            </main>
        </nav>
    )
}

export default Navbar
