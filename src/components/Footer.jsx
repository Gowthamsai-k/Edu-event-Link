import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            background: 'white',
            borderTop: '1px solid var(--border-strong)',
            padding: '5rem 0 3rem 0',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '4rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand Section */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                            EduEvent<span style={{ color: 'var(--primary)' }}>Link</span>
                        </h2>
                        <p style={{ color: 'var(--muted-fg)', fontWeight: '500', maxWidth: '300px', lineHeight: '1.6' }}>
                            The minimal platform for discovering events and joining student communities at the university.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Navigation</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <Link to="/" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--muted-fg)' }}>Home</Link>
                            <Link to="/events" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--muted-fg)' }}>Events</Link>
                            <Link to="/community" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--muted-fg)' }}>Community</Link>
                        </div>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Connect</h4>
                        <div style={{ display: 'flex', gap: '1.25rem' }}>
                            <a href="#" style={{ color: 'var(--fg)' }}><Twitter size={20} /></a>
                            <a href="#" style={{ color: 'var(--fg)' }}><Instagram size={20} /></a>
                            <a href="#" style={{ color: 'var(--fg)' }}><Github size={20} /></a>
                            <a href="#" style={{ color: 'var(--fg)' }}><Mail size={20} /></a>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted-fg)', fontWeight: '700' }}>
                        &copy; {new Date().getFullYear()} EDUEVENTLINK. ALL RIGHTS RESERVED.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <a href="#" style={{ fontSize: '0.8rem', color: 'var(--muted-fg)', fontWeight: '700' }}>PRIVACY</a>
                        <a href="#" style={{ fontSize: '0.8rem', color: 'var(--muted-fg)', fontWeight: '700' }}>TERMS</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;