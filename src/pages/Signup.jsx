import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ShieldCheck, UserCheck, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Signup = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: Success
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [generatedUser, setGeneratedUser] = useState(null);
    
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email.endsWith('@klh.edu.in')) {
            setError('Please use a valid university email (@klh.edu.in)');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        // Simulation: Any 4-6 digit code works
        if (code.length < 4) {
            setError('Please enter the verification code');
            return;
        }
        const newUser = signup(email);
        setGeneratedUser(newUser);
        setStep(3);
    };

    return (
        <div className="section-padding" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="modular-card" style={{ width: '100%', maxWidth: '500px' }}>
                
                <AnimatePresence mode='wait'>
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--primary)', border: '1px solid var(--fg)', marginBottom: '1.5rem' }}>
                                    <UserPlus size={32} color="white" />
                                </div>
                                <h1 style={{ fontSize: '2rem', textTransform: 'uppercase' }}>Initialize Registration</h1>
                                <p style={{ color: 'var(--muted-fg)', fontWeight: '600', marginTop: '0.5rem' }}>Step 1: Identity Verification</p>
                            </div>

                            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>University Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-fg)' }} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="2310030XXX@klh.edu.in"
                                            style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', border: '1px solid var(--border-strong)', outline: 'none', fontWeight: 'bold' }}
                                        />
                                    </div>
                                    {error && <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>{error}</p>}
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                    Request Access Code <ArrowRight size={18} />
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--fg)', border: '1px solid var(--fg)', marginBottom: '1.5rem' }}>
                                    <ShieldCheck size={32} color="white" />
                                </div>
                                <h1 style={{ fontSize: '2rem', textTransform: 'uppercase' }}>Security Verification</h1>
                                <p style={{ color: 'var(--muted-fg)', fontWeight: '600', marginTop: '0.5rem' }}>We've sent a code to {email}</p>
                            </div>

                            <form onSubmit={handleCodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Access Code</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                        placeholder="••••••"
                                        style={{ width: '100%', padding: '1rem', border: '1px solid var(--border-strong)', outline: 'none', fontWeight: 'bold', textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' }}
                                    />
                                </div>
                                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                    Verify & Initialize <ArrowRight size={18} />
                                </button>
                                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--muted-fg)', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>
                                    BACK TO EMAIL
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{ display: 'inline-flex', padding: '1.5rem', background: 'var(--primary)', border: '1px solid var(--fg)', marginBottom: '2rem' }}>
                                <Sparkles size={48} color="white" />
                            </div>
                            <h1 style={{ fontSize: '2rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Identity Assigned</h1>
                            <div style={{ background: 'var(--muted)', border: '1px dashed var(--border-strong)', padding: '2rem', marginBottom: '2.5rem' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--muted-fg)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Your Campus Alias</p>
                                <h2 style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>{generatedUser?.name}</h2>
                            </div>
                            <p style={{ color: 'var(--muted-fg)', fontWeight: '500', marginBottom: '2.5rem' }}>
                                Your account is now active. You can now access all university events and communities.
                            </p>
                            <button onClick={() => navigate('/community')} className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                Enter Community Hub <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {step !== 3 && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ fontWeight: '600', color: 'var(--muted-fg)', fontSize: '0.9rem' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Log in</Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Signup;