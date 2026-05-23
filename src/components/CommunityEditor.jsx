import React, { useState } from 'react';
import { X, Users, Send, ShieldAlert, Loader2, Check, ShieldCheck, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommunityEditor = ({ onClose, onSuccess, authFetch }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [privacy, setPrivacy] = useState('public'); // 'public' or 'private'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Please specify a community name");
            return;
        }
        if (!description.trim()) {
            setError("Please write a short description");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await authFetch('/api/create_community', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                    privacy: privacy
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
                throw new Error(data.detail || 'Failed to start community');
            }
        } catch (err) {
            console.error('Community creation error:', err);
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
                        <Users size={20} color="var(--primary)" />
                    </div>
                    <div>
                        <h3 style={{ textTransform: 'uppercase', fontWeight: '800', lineHeight: 1 }}>Start Community</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontWeight: 'bold', marginTop: '0.25rem' }}>Initialize a new hub on the event link platform.</p>
                    </div>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-fg)' }}>
                    <X size={24} />
                </button>
            </div>

            {/* Form body */}
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
                            <h2 style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Community Initialized</h2>
                            <p style={{ fontWeight: 'bold', color: 'var(--muted-fg)' }}>Your interactive community is active and broadcasting to the sector.</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="community-form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                        >
                            {/* Community Name */}
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                    Community Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="E.g., KLH AI Club"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '1px solid var(--border-strong)',
                                        outline: 'none',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        background: 'var(--muted)',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                                    Description / Purpose
                                </label>
                                <textarea
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly state the community rules, focus areas, and activities..."
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '1px solid var(--border-strong)',
                                        outline: 'none',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        resize: 'none',
                                        background: 'var(--muted)',
                                        fontFamily: 'inherit',
                                        minHeight: '100px'
                                    }}
                                />
                            </div>

                            {/* Privacy Options */}
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                                    Privacy Settings
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    {/* Public Option */}
                                    <div
                                        onClick={() => setPrivacy('public')}
                                        style={{
                                            border: privacy === 'public' ? '2px solid var(--primary)' : '1px solid var(--border-strong)',
                                            background: privacy === 'public' ? 'rgba(0, 168, 107, 0.04)' : 'transparent',
                                            padding: '1.25rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.85rem', color: privacy === 'public' ? 'var(--primary)' : 'var(--fg)' }}>
                                            <Globe size={18} /> Public Hub
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontWeight: 'bold', lineHeight: '1.4' }}>
                                            Open sector broadcast. Anyone can join or leave the community instantly.
                                        </p>
                                    </div>

                                    {/* Private Option */}
                                    <div
                                        onClick={() => setPrivacy('private')}
                                        style={{
                                            border: privacy === 'private' ? '2px solid var(--primary)' : '1px solid var(--border-strong)',
                                            background: privacy === 'private' ? 'rgba(0, 168, 107, 0.04)' : 'transparent',
                                            padding: '1.25rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.85rem', color: privacy === 'private' ? 'var(--primary)' : 'var(--fg)' }}>
                                            <ShieldCheck size={18} /> Private Hub
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontWeight: 'bold', lineHeight: '1.4' }}>
                                            Protected sector. Requires join approval by the community creator.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div style={{ padding: '1rem', background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    <ShieldAlert size={18} />
                                    {error}
                                </div>
                            )}

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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
                                    className="btn btn-primary"
                                    style={{ flex: 2, padding: '1rem' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>Create Hub <Send size={16} style={{ marginLeft: '0.5rem' }} /></>
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

export default CommunityEditor;
