import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{ 
            background: 'white', 
            borderBottom: '1px solid var(--border-strong)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div className="container" style={{ 
                height: '80px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
            }}>
                {/* Logo */}
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                    EduEvent<span style={{ color: 'var(--primary)' }}>Link</span>
                </Link>

                {/* Desktop Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }} className="nav-desktop">
                    <Link to="/" style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem' }}>Home</Link>
                    <Link to="/events" style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem' }}>Events</Link>
                    <Link to="/community" style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '0.85rem' }}>Community</Link>
                    
                    <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                                <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {user.name.charAt(0)}
                                </div>
                                <span>{user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem' }}>Login</Link>
                            <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem' }}>Sign Up</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle (Simplified) */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }} 
                    className="nav-mobile-toggle"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            
            <style>
                {`
                    @media (max-width: 768px) {
                        .nav-desktop { display: none !important; }
                        .nav-mobile-toggle { display: block !important; }
                    }
                `}
            </style>
        </nav>
    );
};

export default Navbar;