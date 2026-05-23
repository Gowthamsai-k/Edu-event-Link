import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, ShieldCheck, Zap, Plus, Search, Heart, Share2, BookOpen, Clock, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BlogEditor from '../components/BlogEditor';
import PostEditor from '../components/PostEditor';
import CommunityEditor from '../components/CommunityEditor';


const Community = () => {
    const { user, authFetch } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('feed');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedItems, setFeedItems] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [pendingRequests, setPendingRequests] = useState({});
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [createType, setCreateType] = useState(null); // 'post', 'blog', 'community'
    const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
    const [comments, setComments] = useState({});
    const [commentsLoading, setCommentsLoading] = useState({});
    const [newCommentTexts, setNewCommentTexts] = useState({});

    const [expandedBlogs, setExpandedBlogs] = useState({});

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

            // Fetch Communities
            const commsRes = await authFetch('/api/communities');
            if (commsRes.ok) {
                const commsData = await commsRes.json();
                setCommunities(commsData);
                
                // Fetch pending requests for communities where current user is creator
                for (const c of commsData) {
                    if (c.is_creator && c.privacy === 'private') {
                        const pendRes = await authFetch(`/api/communities/${c.id}/pending`);
                        if (pendRes.ok) {
                            const pendData = await pendRes.json();
                            setPendingRequests(prev => ({ ...prev, [c.id]: pendData }));
                        }
                    }
                }
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

    const handleLikePost = async (postId) => {
        try {
            const response = await authFetch(`/api/posts/${postId}/like`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                setFeedItems(prev => prev.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            likes: data.likes,
                            liked_by_me: data.liked
                        };
                    }
                    return post;
                }));
            }
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleLikeBlog = async (blogId) => {
        try {
            const response = await authFetch(`/api/blogs/${blogId}/like`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                setBlogs(prev => prev.map(blog => {
                    if (blog.id === blogId) {
                        return {
                            ...blog,
                            likes: data.likes,
                            liked_by_me: data.liked
                        };
                    }
                    return blog;
                }));
            }
        } catch (err) {
            console.error('Error liking blog:', err);
        }
    };


    const handleJoinCommunity = async (communityId) => {
        try {
            const response = await authFetch(`/api/communities/${communityId}/join`, {
                method: 'POST'
            });
            if (response.ok) {
                const data = await response.json();
                // Update communities list
                setCommunities(prev => prev.map(c => {
                    if (c.id === communityId) {
                        return {
                            ...c,
                            membership_status: data.membership_status,
                            members_count: data.membership_status === 'approved' ? c.members_count + 1 : c.members_count
                        };
                    }
                    return c;
                }));
            }
        } catch (err) {
            console.error('Error joining community:', err);
        }
    };

    const handleLeaveCommunity = async (communityId) => {
        try {
            const response = await authFetch(`/api/communities/${communityId}/leave`, {
                method: 'POST'
            });
            if (response.ok) {
                // Update communities list
                setCommunities(prev => prev.map(c => {
                    if (c.id === communityId) {
                        return {
                            ...c,
                            membership_status: 'none',
                            members_count: c.membership_status === 'approved' ? c.members_count - 1 : c.members_count
                        };
                    }
                    return c;
                }));
            }
        } catch (err) {
            console.error('Error leaving community:', err);
        }
    };

    const handleApproveMember = async (communityId, targetUserId) => {
        try {
            const response = await authFetch(`/api/communities/${communityId}/approve?target_user_id=${targetUserId}`, {
                method: 'POST'
            });
            if (response.ok) {
                // Update pending requests list
                setPendingRequests(prev => ({
                    ...prev,
                    [communityId]: (prev[communityId] || []).filter(u => u.user_id !== targetUserId)
                }));
                // Update members count
                setCommunities(prev => prev.map(c => {
                    if (c.id === communityId) {
                        return {
                            ...c,
                            members_count: c.members_count + 1
                        };
                    }
                    return c;
                }));
            }
        } catch (err) {
            console.error('Error approving member:', err);
        }
    };

    const handleToggleComments = async (postId) => {
        if (openCommentsPostId === postId) {
            setOpenCommentsPostId(null);
            return;
        }
        
        setOpenCommentsPostId(postId);
        
        setCommentsLoading(prev => ({ ...prev, [postId]: true }));
        try {
            const response = await authFetch(`/api/posts/${postId}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(prev => ({ ...prev, [postId]: data }));
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setCommentsLoading(prev => ({ ...prev, [postId]: false }));
        }
    };

    const handleAddComment = async (postId) => {
        const text = newCommentTexts[postId]?.trim();
        if (!text) return;
        
        try {
            const response = await authFetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ msg: text })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                setComments(prev => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), data.comment]
                }));
                
                setNewCommentTexts(prev => ({ ...prev, [postId]: '' }));
                
                setFeedItems(prev => prev.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: post.comments + 1
                        };
                    }
                    return post;
                }));
            }
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

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
                                        {post.image && post.image !== 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' && (
                                            <div style={{ width: '100%', maxHeight: '450px', overflow: 'hidden', border: '1px solid var(--border-strong)', marginBottom: '1.5rem', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <img 
                                                    src={post.image} 
                                                    alt="Post Media" 
                                                    style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain', transition: 'transform 0.3s ease' }} 
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.00)'}
                                                />
                                            </div>
                                        )}
                                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{post.content}</p>
                                        <div style={{ display: 'flex', gap: '2rem', color: 'var(--muted-fg)' }}>
                                            <button 
                                                onClick={() => handleLikePost(post.id)}
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.5rem', 
                                                    cursor: 'pointer', 
                                                    fontWeight: 'bold',
                                                    color: post.liked_by_me ? '#ef4444' : 'var(--muted-fg)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <Heart 
                                                    size={18} 
                                                    fill={post.liked_by_me ? '#ef4444' : 'none'} 
                                                    color={post.liked_by_me ? '#ef4444' : 'currentColor'} 
                                                    style={{ transform: post.liked_by_me ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.2s ease' }}
                                                /> 
                                                {post.likes}
                                            </button>
                                            <button 
                                                onClick={() => handleToggleComments(post.id)}
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.5rem', 
                                                    cursor: 'pointer', 
                                                    fontWeight: 'bold',
                                                    color: openCommentsPostId === post.id ? 'var(--primary)' : 'var(--muted-fg)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <MessageSquare size={18} fill={openCommentsPostId === post.id ? 'rgba(0,143,93,0.1)' : 'none'} /> {post.comments}
                                            </button>
                                            <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginLeft: 'auto' }}>
                                                <Share2 size={18} />
                                            </button>
                                        </div>

                                        {/* Comments Section */}
                                        <AnimatePresence>
                                            {openCommentsPostId === post.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    style={{ 
                                                        overflow: 'hidden', 
                                                        borderTop: '1px solid var(--border)', 
                                                        marginTop: '1.5rem',
                                                        paddingTop: '1.5rem'
                                                    }}
                                                >
                                                    <h5 style={{ textTransform: 'uppercase', marginBottom: '1rem', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Comments</h5>
                                                    
                                                    {/* Comments List */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                                        {commentsLoading[post.id] ? (
                                                            <div style={{ padding: '1rem 0', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                                <Plus className="animate-spin" size={16} color="var(--primary)" />
                                                                <span style={{ fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase' }}>Retrieving transmission...</span>
                                                            </div>
                                                        ) : (comments[post.id] || []).length === 0 ? (
                                                            <p style={{ color: 'var(--muted-fg)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>No replies found in this sector.</p>
                                                        ) : (
                                                            (comments[post.id] || []).map(comment => (
                                                                <div key={comment.id} style={{ border: '1px solid var(--border)', padding: '1rem', background: 'var(--muted)' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                                        <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.8rem' }}>@{comment.user}</span>
                                                                        <span style={{ color: 'var(--muted-fg)', fontSize: '0.7rem', fontWeight: 'bold' }}>{comment.time}</span>
                                                                    </div>
                                                                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4', fontWeight: '600' }}>{comment.msg}</p>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>

                                                    {/* Comment Input Form */}
                                                    <form 
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            handleAddComment(post.id);
                                                        }}
                                                        style={{ display: 'flex', gap: '1rem' }}
                                                    >
                                                        <input 
                                                            type="text"
                                                            placeholder="Input message to the sector..."
                                                            value={newCommentTexts[post.id] || ''}
                                                            onChange={(e) => setNewCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                            style={{
                                                                flex: 1,
                                                                padding: '0.75rem 1rem',
                                                                border: '1px solid var(--border-strong)',
                                                                fontFamily: 'inherit',
                                                                fontSize: '0.85rem',
                                                                fontWeight: '700',
                                                                outline: 'none',
                                                                background: 'transparent'
                                                            }}
                                                        />
                                                        <button 
                                                            type="submit" 
                                                            className="btn btn-primary"
                                                            style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}
                                                        >
                                                            Reply
                                                        </button>
                                                    </form>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
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
                                {blogs.map((blog) => {
                                    const isExpanded = expandedBlogs[blog.id] || false;
                                    return (
                                        <div key={blog.id} className="modular-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {/* Header */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', background: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-strong)', fontWeight: '900', fontSize: '1.2rem', color: 'var(--primary)' }}>
                                                        {blog.author ? blog.author[0].toUpperCase() : 'A'}
                                                    </div>
                                                    <div>
                                                        <span style={{ display: 'block', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary)' }}>
                                                            {blog.author || 'Anonymous'}
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-fg)', fontWeight: '700' }}>
                                                            {blog.date}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--muted-fg)' }}>
                                                    <Clock size={14} /> {blog.readTime}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div>
                                                <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '1rem', lineHeight: '1.2', fontWeight: '900' }}>
                                                    {blog.title}
                                                </h3>
                                                <p style={{ 
                                                    color: 'var(--fg)', 
                                                    fontWeight: '600', 
                                                    fontSize: '1rem', 
                                                    lineHeight: '1.7', 
                                                    whiteSpace: 'pre-wrap' 
                                                }}>
                                                    {isExpanded ? blog.body : blog.excerpt}
                                                </p>
                                                {blog.body && blog.body.length > 150 && (
                                                    <button 
                                                        onClick={() => setExpandedBlogs(prev => ({ ...prev, [blog.id]: !isExpanded }))}
                                                        style={{ 
                                                            background: 'none', 
                                                            border: 'none', 
                                                            color: 'var(--primary)', 
                                                            fontWeight: '800', 
                                                            fontSize: '0.85rem', 
                                                            cursor: 'pointer', 
                                                            textTransform: 'uppercase', 
                                                            padding: '0', 
                                                            marginTop: '0.75rem', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '0.25rem' 
                                                        }}
                                                    >
                                                        {isExpanded ? 'Collapse Article' : 'Read Full Article'} <ArrowRight size={14} style={{ transform: isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                                <button 
                                                    onClick={() => handleLikeBlog(blog.id)}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '0.5rem', 
                                                        cursor: 'pointer', 
                                                        fontWeight: 'bold',
                                                        color: blog.liked_by_me ? '#ef4444' : 'var(--muted-fg)',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    <Heart 
                                                        size={18} 
                                                        fill={blog.liked_by_me ? '#ef4444' : 'none'} 
                                                        color={blog.liked_by_me ? '#ef4444' : 'currentColor'} 
                                                        style={{ transform: blog.liked_by_me ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.2s ease' }}
                                                    /> 
                                                    {blog.likes || 0}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {blogs.length === 0 && (
                                    <div style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--border)' }}>
                                        <BookOpen size={40} color="var(--muted-fg)" style={{ marginBottom: '1rem' }} />
                                        <p style={{ fontWeight: '800', color: 'var(--muted-fg)' }}>Library database is currently empty.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!loading && !error && activeTab === 'my-groups' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {/* Global Communities Directory */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <h3 style={{ textTransform: 'uppercase', fontWeight: '900', fontSize: '1.5rem', borderBottom: '2px solid var(--fg)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Users size={24} /> Campus Hubs Directory
                                    </h3>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                                        {communities.map((comm) => (
                                            <div key={comm.id} className="modular-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                                                {/* Card Header */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                            <h4 style={{ fontSize: '1.3rem', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>
                                                                {comm.name}
                                                            </h4>
                                                            <span style={{ 
                                                                fontSize: '0.7rem', 
                                                                fontWeight: '800', 
                                                                textTransform: 'uppercase', 
                                                                padding: '0.25rem 0.5rem', 
                                                                border: '1px solid var(--border-strong)',
                                                                background: comm.privacy === 'private' ? '#fee2e2' : '#e0f2fe',
                                                                color: comm.privacy === 'private' ? '#b91c1c' : '#0369a1'
                                                            }}>
                                                                {comm.privacy}
                                                            </span>
                                                        </div>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--muted-fg)', fontWeight: 'bold' }}>
                                                            Broadcast Creator: <span style={{ color: 'var(--fg)' }}>@{comm.creator_name}</span>
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Join / Leave Actions */}
                                                    <div>
                                                        {comm.is_creator ? (
                                                            <span style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '0.5rem 1rem' }}>
                                                                Creator
                                                            </span>
                                                        ) : comm.membership_status === 'approved' ? (
                                                            <button 
                                                                onClick={() => handleLeaveCommunity(comm.id)}
                                                                className="btn btn-outline"
                                                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderColor: '#ef4444', color: '#ef4444' }}
                                                            >
                                                                Leave Hub
                                                            </button>
                                                        ) : comm.membership_status === 'pending' ? (
                                                            <button 
                                                                onClick={() => handleLeaveCommunity(comm.id)}
                                                                className="btn btn-outline"
                                                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--muted-fg)' }}
                                                            >
                                                                Cancel Request
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleJoinCommunity(comm.id)}
                                                                className="btn btn-primary"
                                                                style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
                                                            >
                                                                Join Hub
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Description */}
                                                <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--fg)', lineHeight: '1.5', margin: 0 }}>
                                                    {comm.description}
                                                </p>
                                                
                                                {/* Info Bar */}
                                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--muted-fg)' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                        <Users size={16} /> {comm.members_count} approved member{comm.members_count !== 1 ? 's' : ''}
                                                    </span>
                                                    {comm.membership_status === 'pending' && (
                                                        <span style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                            <ShieldCheck size={16} /> Awaiting creator authorization
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {/* Creator-only Pending Approvals Panel */}
                                                {comm.is_creator && comm.privacy === 'private' && pendingRequests[comm.id] && pendingRequests[comm.id].length > 0 && (
                                                    <div style={{ marginTop: '1rem', border: '2px solid var(--fg)', background: 'var(--muted)', padding: '1.25rem' }}>
                                                        <h5 style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '0.05em', color: 'var(--fg)', borderBottom: '1px solid var(--border-strong)', paddingBottom: '0.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <ShieldCheck size={16} color="var(--primary)" /> Authorizations Pending ({pendingRequests[comm.id].length})
                                                        </h5>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                            {pendingRequests[comm.id].map((req) => (
                                                                <div key={req.user_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', border: '1px solid var(--border-strong)', padding: '0.75rem 1rem' }}>
                                                                    <div>
                                                                        <span style={{ fontWeight: '800', fontSize: '0.85rem', display: 'block' }}>@{req.name}</span>
                                                                        <span style={{ color: 'var(--muted-fg)', fontSize: '0.75rem', fontWeight: 'bold' }}>{req.email}</span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleApproveMember(comm.id, req.user_id)}
                                                                        className="btn btn-primary"
                                                                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                                                                    >
                                                                        Approve Member
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {communities.length === 0 && (
                                    <div style={{ padding: '4rem', textAlign: 'center', border: '1px dashed var(--border)' }}>
                                        <Users size={40} color="var(--muted-fg)" style={{ marginBottom: '1rem' }} />
                                        <p style={{ fontWeight: '800', color: 'var(--muted-fg)' }}>No active communities initialized in this sector.</p>
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
                            style={{ maxWidth: (createType === 'blog' || createType === 'post') ? '800px' : '600px', width: '90%', padding: '0', overflow: 'hidden', border: 'none' }}
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
                                ) : createType === 'post' ? (
                                    <motion.div
                                        key="post-editor"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <PostEditor
                                            onClose={() => {
                                                setShowCreatePopup(false);
                                                setCreateType(null);
                                            }}
                                            onSuccess={() => fetchCommunityData()}
                                            authFetch={authFetch}
                                        />
                                    </motion.div>
                                ) : createType === 'community' ? (
                                    <motion.div
                                        key="community-editor"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <CommunityEditor
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
