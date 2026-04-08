import React, { useState } from 'react';
import { X, Send, BookOpen, AlertCircle, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlogEditor = ({ onClose, onSuccess, authFetch }) => {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authFetch('/api/create_blog', {
                method: 'POST',
                body: JSON.stringify({
                    subject,
                    body
                })
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            } else {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to publish blog');
            }
        } catch (err) {
            console.error('Blog creation error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '85vh' }}>
            {/* Header */}
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-strong)' }}>
                        <BookOpen size={20} color="#716eef" />
                    </div>
                    <div>
                        <h3 style={{ textTransform: 'uppercase', fontWeight: '800', lineHeight: 1 }}>Publish / Blog</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontWeight: 'bold', marginTop: '0.25rem' }}>Draft your insights for the campus library.</p>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-fg)' }}>
                    <X size={24} />
                </button>
            </div>

            {/* Editor Body */}
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                <AnimatePresence mode='wait'>
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '4rem 0' }}
                        >
                            <div style={{ width: '80px', height: '80px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', border: '2px solid var(--fg)' }}>
                                <Check size={40} strokeWidth={3} />
                            </div>
                            <h2 style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Blog Published</h2>
                            <p style={{ fontWeight: 'bold', color: 'var(--muted-fg)' }}>Your contribution has been added to the sector database.</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="editor-form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                                    1. Subject / Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter a compelling title..."
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        border: '1px solid var(--border-strong)',
                                        outline: 'none',
                                        fontWeight: '700',
                                        fontSize: '1.1rem',
                                        background: 'var(--muted)'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                                    2. Content / Body
                                </label>
                                <textarea
                                    required
                                    rows={10}
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Share your thoughts, research, or experiences..."
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        border: '1px solid var(--border-strong)',
                                        outline: 'none',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        resize: 'none',
                                        background: 'var(--muted)',
                                        minHeight: '300px',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            {error && (
                                <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn btn-outline"
                                    style={{ flex: 1 }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-style702"
                                    style={{ flex: 2, padding: '1rem' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>Publish to Hub <Send size={18} /></>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BlogEditor;
