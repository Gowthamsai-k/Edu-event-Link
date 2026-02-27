import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar } from 'lucide-react';

const Hero = () => {
    return (
        <section className="section-padding" style={{ borderBottom: '1px solid var(--border-strong)', background: 'white' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', border: '1px solid var(--border-strong)', background: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                        >
                            <Sparkles size={14} color="var(--primary)" />
                            <span>Campus Hub v2.0</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '1.5rem', color: 'var(--fg)', textTransform: 'uppercase' }}
                        >
                            The Modern <span style={{ color: 'var(--primary)' }}>Campus</span> Experience
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{ fontSize: '1.1rem', color: 'var(--muted-fg)', maxWidth: '500px', marginBottom: '2.5rem', fontWeight: '500' }}
                        >
                            The minimal platform for discovers events, joining student communities, and staying updated with campus life.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ display: 'flex', gap: '1rem' }}
                        >
                            <button className="btn btn-primary">
                                Explore Events
                                <ArrowRight size={18} />
                            </button>
                            <button className="btn btn-outline">
                                Join Now
                            </button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            aspectRatio: '1 / 1',
                            border: '2px solid var(--border-strong)',
                            background: 'var(--muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, transparent 48%, var(--border) 49%, var(--border) 51%, transparent 52%)', backgroundSize: '40px 40px' }} />
                        <div style={{
                            zIndex: 1,
                            background: 'white',
                            border: '1px solid var(--border-strong)',
                            padding: '2rem',
                            boxShadow: '8px 8px 0px var(--primary)'
                        }}>
                            <Calendar size={80} color="var(--primary)" strokeWidth={1} />
                        </div>
                        {/* Visual Accents */}
                        <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '60px', height: '60px', background: 'var(--primary)', border: '1px solid var(--border-strong)' }} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
