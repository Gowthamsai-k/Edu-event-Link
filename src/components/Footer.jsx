import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Mail, ExternalLink, Sparkles } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'var(--bg)',
            borderTop: '1px solid var(--border-strong)',
            marginTop: 'auto'
        }}>
            <div className="container" style={{ padding: '5rem 2rem 3rem' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    {/* Brand Section */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0.5rem',
                                border: '1px solid var(--fg)'
                            }}>
                                <Sparkles size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                EduEvent<span style={{ color: 'var(--primary)' }}>Link</span>
                            </h2>
                        </div>
                        <p style={{ color: 'var(--muted-fg)', maxWidth: '400px', fontWeight: '500', lineHeight: '1.6' }}>
                            The central hub for university life. Discover exclusive events,
                            join vibrant communities, and build lasting connections within your campus.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <a href="#" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'var(--muted)' }}><Github size={20} /></a>
                            <a href="#" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'var(--muted)' }}><Twitter size={20} /></a>
                            <a href="#" style={{ padding: '0.5rem', border: '1px solid var(--border)', background: 'var(--muted)' }}><Instagram size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>Explore</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li><Link to="/" style={{ color: 'var(--muted-fg)', fontWeight: '600' }}>Home</Link></li>
                            <li><Link to="/events" style={{ color: 'var(--muted-fg)', fontWeight: '600' }}>Campus Events</Link></li>
                            <li><Link to="/community" style={{ color: 'var(--muted-fg)', fontWeight: '600' }}>Communities</Link></li>
                            <li><Link to="/signup" style={{ color: 'var(--muted-fg)', fontWeight: '600' }}>Join Platform</Link></li>
                        </ul>
                    </div>


                </div>

                {/* Bottom Bar */}
                <div style={{
                    paddingTop: '3rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1.5rem'
                }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted-fg)', fontWeight: '600' }}>
                        © {currentYear} EDUEVENTLINK UNIVERSITY PORTAL. ALL RIGHTS RESERVED.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)' }}>Designed for Students</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--fg)' }}>v1.0.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
