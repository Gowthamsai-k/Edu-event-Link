import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, ShieldCheck, Zap, Plus, Search, Heart, Share2, BookOpen, Clock, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BlogEditor from '../components/BlogEditor';

const Community = () => {
    const { user, authFetch } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('feed');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedItems, setFeedItems] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [createType, setCreateType] = useState(null); // 'post', 'blog', 'community'

    // Fetch dynamic data from the backend
    const fetchCommunityData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch Feed Items
            const feedRes = await authFetch('/api/posts');
            if (feedRes.ok) {
                const feedData = await feedRes.json();
                setFeedItems(feedData);
            }

            // Fetch Blogs
            const blogsRes = await authFetch('/api/blogs');
            if (blogsRes.ok) {
                const blogsData = await blogsRes.json();
                setBlogs(blogsData);
            }
        } catch (err) {
            console.error('Error fetching community data:', err);
            setError('Failed to sync with the campus network.');
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        fetchCommunityData();
    }, [fetchCommunityData]);

    return (
        <div className="section-padding" style={{ background: 'white', minHeight: '100vh' }}>
            <div className="container">

                {/* Header Area */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', borderBottom: '2px solid var(--fg)', paddingBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3.5rem', textTransform: 'uppercase' }}>Community / <span style={{ color: 'var(--primary)' }}>Hub</span></h1>
                        <p style={{ color: 'var(--muted-fg)', fontWeight: 'bold', marginTop: '0.5rem' }}>Welcome back, <span style={{ color: 'var(--fg)' }}>{user?.name}</span></p>
                    </div>
                    <button
                        onClick={() => setShowCreatePopup(true)}
                        className="btn-style702"
                    >
                        Create <Plus size={18} />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid var(--border)' }}>
                    {['feed', 'blogs', 'my-groups'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '1rem 0',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                color: activeTab === tab ? 'var(--fg)' : 'var(--muted-fg)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '4rem' }}>
                    {/* Main Content Area */}
                    <main>
                        {loading && (
                            <div style={{ padding: '4rem', textAlign: 'center' }}>
                                <div className="animate-spin" style={{ display: 'inline-block' }}><Plus size={40} color="var(--primary)" /></div>
                                <p style={{ fontWeight: '800', textTransform: 'uppercase', marginTop: '1rem' }}>Synchronizing...</p>
                            </div>
                        )}

                        {error && (
                            <div style={{ padding: '2rem', background: '#fee2e2', border: '1px solid #ef4444', color: '#b91c1c', fontWeight: 'bold', marginBottom: '2rem' }}>
                                {error}
                            </div>
                        )}

                        {!loading && !error && activeTab === 'feed' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {feedItems.map(post => (
                                    <div key={post.id} className="modular-card" style={{ padding: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{ fontWeight: '800', color: 'var(--primary)' }}>@{post.user}</span>
                                            <span style={{ color: 'var(--muted-fg)', fontSize: '0.8rem', fontWeight: 'bold' }}>{post.time}</span>
                                        </div>
                                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{post.content}</p>
                                        <div style={{ display: 'flex', gap: '2rem', color: 'var(--muted-fg)' }}>
                                            <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                                                <Heart size={18} /> {post.likes}
                                            </button>
                                            <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                                                <MessageSquare size={18} /> {post.comments}
                                            </button>
                                            <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: 'auto' }}>
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {feedItems.length === 0 && (
                                    <div style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--border)' }}>
                                        <MessageSquare size={40} color="var(--muted-fg)" style={{ marginBottom: '1rem' }} />
                                        <p style={{ fontWeight: '800', color: 'var(--muted-fg)' }}>No activity found in the current sector.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!loading && !error && activeTab === 'blogs' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {blogs.map((blog, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                                        <div style={{ background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-strong)' }}>
                                            <BookOpen size={40} color="var(--primary)" strokeWidth={1} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{blog.title}</h3>
                                            <p style={{ color: 'var(--muted-fg)', fontWeight: '600', marginBottom: '1rem' }}>{blog.excerpt}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase' }}>
                                                <span style={{ color: 'var(--primary)' }}>By {blog.author}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {blog.readTime}</span>
                                                <span>{blog.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {blogs.length === 0 && (
                                    <div style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--border)' }}>
                                        <BookOpen size={40} color="var(--muted-fg)" style={{ marginBottom: '1rem' }} />
                                        <p style={{ fontWeight: '800', color: 'var(--muted-fg)' }}>Library database is currently empty.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    {/* Sidebar Area */}
                    <aside>
                        <div style={{ border: '1px solid var(--border-strong)', padding: '2rem', marginBottom: '2rem' }}>
                            <h4 style={{ textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Trending Communities</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {['KLH AI Club', 'Drama Society', 'Chess Masters', 'GDSC KLH'].map(group => (
                                    <div key={group} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '700', fontSize: '0.9rem' }}>
                                        <div style={{ width: '32px', height: '32px', background: 'var(--muted)', border: '1px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Zap size={14} color="var(--primary)" />
                                        </div>
                                        {group}
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '2rem', fontSize: '0.75rem' }}>View All Groups</button>
                        </div>

                        <div style={{ background: 'var(--fg)', color: 'white', padding: '2rem' }}>
                            <h4 style={{ textTransform: 'uppercase', marginBottom: '1rem', size: '0.9rem' }}>Pro Tip:</h4>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                                Use your random alias to post questions or feedback anonymously to the campus administration!
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Creation Selection Popup */}
            <AnimatePresence>
                {showCreatePopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}
                        onClick={() => {
                            setShowCreatePopup(false);
                            setCreateType(null);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="modular-card"
                            style={{ maxWidth: createType === 'blog' ? '800px' : '600px', width: '90%', padding: '0', overflow: 'hidden', border: 'none' }}
                        >
                            <AnimatePresence mode="wait">
                                {createType === 'blog' ? (
                                    <motion.div
                                        key="blog-editor"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <BlogEditor
                                            onClose={() => {
                                                setShowCreatePopup(false);
                                                setCreateType(null);
                                            }}
                                            onSuccess={() => fetchCommunityData()}
                                            authFetch={authFetch}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="type-selector"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 style={{ textTransform: 'uppercase', fontWeight: '800' }}>Command / Create</h3>
                                            <button onClick={() => setShowCreatePopup(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-fg)' }}>
                                                <X size={24} />
                                            </button>
                                        </div>

                                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {[
                                                { id: 'post', title: 'New Post', desc: 'Share an update or question.', icon: <MessageSquare size={24} />, color: 'var(--fg)' },
                                                { id: 'community', title: 'Start Community', desc: 'Initialize new interactive hub.', icon: <Users size={24} />, color: 'var(--primary)' },
                                                { id: 'blog', title: 'Draft Blog', desc: 'Publish insights to library.', icon: <BookOpen size={24} />, color: '#716eef' }
                                            ].map((opt, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => setCreateType(opt.id)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        padding: '1.5rem',
                                                        border: '1px solid var(--border)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = opt.color}
                                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                                                >
                                                    <div style={{ width: '48px', height: '48px', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.5rem' }}>
                                                        {React.cloneElement(opt.icon, { color: opt.color })}
                                                    </div>
                                                    <div>
                                                        <h4 style={{ textTransform: 'uppercase', fontSize: '1rem', fontWeight: '800' }}>{opt.title}</h4>
                                                        <p style={{ fontSize: '0.85rem', color: 'var(--muted-fg)', fontWeight: '600' }}>{opt.desc}</p>
                                                    </div>
                                                    <ArrowRight size={20} style={{ marginLeft: 'auto', color: 'var(--muted-fg)' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Community;
