import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/community';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({ mail, password });
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-padding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="modular-card"
                style={{ width: '100%', maxWidth: '450px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--primary)', border: '1px solid var(--fg)', marginBottom: '1.5rem' }}>
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', textTransform: 'uppercase' }}>Login</h1>
                    <p style={{ color: 'var(--muted-fg)', fontWeight: '600', marginTop: '0.5rem' }}>Welcome back to the campus network.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>University Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-fg)' }} />
                            <input
                                type="email"
                                required
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                                placeholder="2310030XXX@klh.edu.in"
                                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', border: '1px solid var(--border-strong)', outline: 'none', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-fg)' }} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', border: '1px solid var(--border-strong)', outline: 'none', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '700' }}>
                            {error}
                        </div>
                    )}

                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', position: 'relative' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>INITIALIZE LOGIN <ArrowRight size={18} /></>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontWeight: '600', color: 'var(--muted-fg)', fontSize: '0.9rem' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Sign up</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
