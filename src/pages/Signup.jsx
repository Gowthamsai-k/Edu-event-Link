import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, UserPlus, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        mail: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.mail.endsWith('@klh.edu.in')) {
            setError('Please use a valid university email (@klh.edu.in)');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await signup(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/community');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-padding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="modular-card" style={{ width: '100%', maxWidth: '500px' }}>

                <AnimatePresence mode='wait'>
                    {!success ? (
                        <motion.div
                            key="signup-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--primary)', border: '1px solid var(--fg)', marginBottom: '1.5rem' }}>
                                    <UserPlus size={32} color="white" />
                                </div>
                                <h1 style={{ fontSize: '2rem', textTransform: 'uppercase' }}>Create Account</h1>
                                <p style={{ color: 'var(--muted-fg)', fontWeight: '600', marginTop: '0.5rem' }}>Join the university community</p>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-fg)' }} />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', border: '1px solid var(--border-strong)', outline: 'none', fontWeight: 'bold' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>University Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-fg)' }} />
                                        <input
                                            type="email"
                                            name="mail"
                                            required
                                            value={formData.mail}
                                            onChange={handleChange}
                                            placeholder="2310030XXX@klh.edu.in"
                                            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', border: '1px solid var(--border-strong)', outline: 'none', fontWeight: 'bold' }}
                                        />
                                    </div>
                                    {error && error.includes('email') && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>{error}</p>}
                                </div>

                                <div>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-fg)' }} />
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', border: '1px solid var(--border-strong)', outline: 'none', fontWeight: 'bold' }}
                                        />
                                    </div>
                                </div>

                                {error && !error.includes('email') && (
                                    <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', fontSize: '0.85rem', fontWeight: '700' }}>
                                        {error}
                                    </div>
                                )}

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', position: 'relative' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>CREATE ACCOUNT <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>

                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <p style={{ fontWeight: '600', color: 'var(--muted-fg)', fontSize: '0.9rem' }}>
                                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Log in</Link>
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--primary)', border: '1px solid var(--fg)', marginBottom: '2rem' }}>
                                <Sparkles size={48} color="white" />
                            </div>
                            <h1 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Registration Complete</h1>
                            <p style={{ color: 'var(--muted-fg)', fontWeight: '600', marginBottom: '2rem' }}>
                                Welcome to EduEventLink! Redirecting you to the hub...
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Signup;