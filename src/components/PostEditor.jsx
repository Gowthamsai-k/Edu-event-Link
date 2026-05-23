import React, { useState } from 'react';
import { X, Send, Image, Upload, AlertCircle, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PostEditor = ({ onClose, onSuccess, authFetch }) => {
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setError("Please select an image to share");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await authFetch('/api/create_post', {
                method: 'POST',
                body: JSON.stringify({
                    image,
                    description
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
                throw new Error(data.detail || 'Failed to share post');
            }
        } catch (err) {
            console.error('Post creation error:', err);
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
                        <Image size={20} color="#716eef" />
                    </div>
                    <div>
                        <h3 style={{ textTransform: 'uppercase', fontWeight: '800', lineHeight: 1 }}>Share / Post</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontWeight: 'bold', marginTop: '0.25rem' }}>Create a public update for the campus global feed.</p>
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
                            <h2 style={{ textTransform: 'uppercase', marginBottom: '1rem' }}>Post Shared</h2>
                            <p style={{ fontWeight: 'bold', color: 'var(--muted-fg)' }}>Your public post is now broadcasting on the global campus feed.</p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="post-form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '320px' }}>
                                {/* Left Side: Image Selector */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.05em' }}>
                                        1. Post Media
                                    </label>
                                    
                                    {image ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '280px', border: '1px solid var(--border-strong)', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button 
                                                type="button" 
                                                onClick={() => setImage(null)} 
                                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#ef4444'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            style={{
                                                flex: 1,
                                                minHeight: '280px',
                                                border: dragging ? '2px dashed var(--primary)' : '2px dashed var(--border-strong)',
                                                background: dragging ? 'rgba(113, 110, 239, 0.05)' : 'var(--muted)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '2rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                textAlign: 'center',
                                                position: 'relative'
                                            }}
                                            onClick={() => document.getElementById('image-upload-input').click()}
                                        >
                                            <input 
                                                type="file" 
                                                id="image-upload-input" 
                                                accept="image/*" 
                                                onChange={handleFileChange} 
                                                style={{ display: 'none' }} 
                                            />
                                            <Upload size={36} color={dragging ? 'var(--primary)' : 'var(--muted-fg)'} style={{ marginBottom: '1rem' }} />
                                            <p style={{ fontWeight: '800', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Drag & Drop Image</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontWeight: 'bold' }}>or click to browse local storage (Max 5MB)</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Description */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.05em' }}>
                                        2. Caption / Description
                                    </label>
                                    <textarea
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Write an engaging caption for your campus feed..."
                                        style={{
                                            flex: 1,
                                            width: '100%',
                                            padding: '1.25rem',
                                            border: '1px solid var(--border-strong)',
                                            outline: 'none',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            resize: 'none',
                                            background: 'var(--muted)',
                                            fontFamily: 'inherit',
                                            minHeight: '240px'
                                        }}
                                    />
                                </div>
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
                                    disabled={loading || !image}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>Share Post <Send size={18} /></>
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

export default PostEditor;