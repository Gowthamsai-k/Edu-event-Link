import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, ShieldCheck, Zap, Plus, Search, Heart, Share2, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Community = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('feed');
    const [isCreating, setIsCreating] = useState(false);

    const feedItems = [
        { id: 1, user: 'StudentHub', content: 'Anyone joining the AI Workshop tomorrow? Let\'s form a study group!', likes: 12, comments: 4, time: '2h ago' },
        { id: 2, user: 'MusicSociety', content: 'Auditions for the Spring Band are open now! Link in bio.', likes: 45, comments: 18, time: '5h ago' },
        { id: 3, user: 'TechWizard', content: 'Just finished a tutorial on React transitions. Check it out on my blog below.', likes: 23, comments: 2, time: '1d ago' },
    ];

    const blogs = [
        { title: 'Modern React Architecture', author: 'CodeNinja #4210', readTime: '8 min', excerpt: 'How to structure your frontend for scale and maintainability...', date: 'Feb 24' },
        { title: 'Campus Survival Guide', author: 'LibraryHermit #1102', readTime: '5 min', excerpt: 'Finding the best spots to study and the cheapest coffee...', date: 'Feb 22' },
    ];

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
                        onClick={() => setIsCreating(true)}
                        className="btn btn-primary"
                    >
                        Create Community <Plus size={18} />
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
                        {activeTab === 'feed' && (
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
                            </div>
                        )}

                        {activeTab === 'blogs' && (
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

            {/* Create Community Modal Mockup */}
            {isCreating && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="modular-card" style={{ maxWidth: '500px', width: '100%', padding: '3rem' }}>
                        <h2 style={{ textTransform: 'uppercase', marginBottom: '2rem' }}>Initialize New Group</h2>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Community Name</label>
                            <input type="text" placeholder="e.g. KLH Photography" style={{ width: '100%', padding: '0.85rem', border: '1px solid var(--border-strong)', outline: 'none' }} />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Description</label>
                            <textarea rows={4} placeholder="Describe the purpose of this group..." style={{ width: '100%', padding: '0.85rem', border: '1px solid var(--border-strong)', outline: 'none', resize: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setIsCreating(false)} className="btn btn-primary" style={{ flex: 1 }}>Launch</button>
                            <button onClick={() => setIsCreating(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
