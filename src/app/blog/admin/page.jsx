'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, Save, X, Lock } from 'lucide-react';
import gsap from 'gsap';

// In a real app, this would be stored in a database
// For now, we use localStorage for persistence
const getStoredPosts = () => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('blog_posts');
    return stored ? JSON.parse(stored) : [];
};

const savePosts = (posts) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('blog_posts', JSON.stringify(posts));
    }
};

export default function BlogAdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [authError, setAuthError] = useState('');
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tag: 'Indie Hacking',
        image: '/meshmind/1.png',
    });

    useEffect(() => {
        setPosts(getStoredPosts());
    }, []);

    // Animation for entrance
    const containerRef = useRef(null);
    useEffect(() => {
        if (isAuthenticated && containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }
    }, [isAuthenticated, isEditing]);

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const now = new Date().toISOString().split('T')[0];
        const newPost = {
            ...formData,
            id: currentPost?.id || Date.now().toString(),
            date: currentPost?.date || now,
            updatedAt: now,
            readTime: `${Math.ceil(formData.content.split(' ').length / 200)} min read`,
        };

        let updatedPosts;
        if (currentPost) {
            updatedPosts = posts.map((p) => (p.id === currentPost.id ? newPost : p));
        } else {
            updatedPosts = [newPost, ...posts];
        }

        setPosts(updatedPosts);
        savePosts(updatedPosts);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            tag: 'Indie Hacking',
            image: '/meshmind/1.png',
        });
        setCurrentPost(null);
        setIsEditing(false);
    };

    const editPost = (post) => {
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            tag: post.tag,
            image: post.image,
        });
        setCurrentPost(post);
        setIsEditing(true);
    };

    const deletePost = (id, e) => {
        e?.stopPropagation();
        if (confirm('Are you sure you want to delete this post?')) {
            const updatedPosts = posts.filter((p) => p.id !== id);
            setPosts(updatedPosts);
            savePosts(updatedPosts);
        }
    };

    const tags = ['Indie Hacking', 'AI', 'Tools', 'Personal', 'Tutorial', 'Product'];
    const images = [
        '/meshmind/1.png',
        '/meshmind/2.png',
        '/meshmind/3.png',
        '/fainancial/1.png',
        '/fainancial/2.png',
        '/cityswipe.png',
        '/baitme/1.png',
    ];

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple password check - in production use real auth
        if (passwordInput === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '  _')) {
            setIsAuthenticated(true);
        } else {
            setAuthError('Incorrect password');
            setPasswordInput('');
        }
    };

    // LOGIN SCREEN
    if (!isAuthenticated) {
        return (
            <div className="section" style={{ alignItems: 'center', textAlign: 'center' }}>
                <div className="noise-overlay" />
                <div className="container" style={{ maxWidth: '500px' }}>
                    <h1 className="title-monumental" style={{ fontSize: '4rem', marginBottom: '2rem' }}>
                        <span className="stroke">Admin</span>
                        <span className="filled">Access</span>
                    </h1>

                    <form onSubmit={handleLogin} style={{ position: 'relative' }}>
                        <div style={{ position: 'relative', marginBottom: '3rem' }}>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="PASSWORD"
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '2px solid rgba(255,255,255,0.2)',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    fontFamily: 'var(--font-mono)',
                                    outline: 'none',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                            />
                        </div>

                        {authError && <p style={{ color: '#ff6b6b', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>{authError}</p>}

                        <button type="submit" className="magnetic-btn">
                            Unlock System
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // DASHBOARD
    return (
        <div className="min-h-screen bg-black text-white relative">
            <div className="noise-overlay" />

            <div className="container mx-auto px-6 py-12" ref={containerRef}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase tracking-widest text-xs mb-8"
                        >
                            <ArrowLeft size={14} />
                            Back to visualizer
                        </Link>
                        <h1 className="title-monumental" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>
                            <span className="filled">Content</span>
                            <span className="stroke">Control</span>
                        </h1>
                    </div>

                    {!isEditing && (
                        <button
                            className="magnetic-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            <Plus size={18} style={{ marginRight: '0.5rem' }} />
                            Create Entry
                        </button>
                    )}
                </div>

                {/* Editor */}
                {isEditing ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold uppercase tracking-wider">
                                {currentPost ? 'Edit Protocol' : 'New Entry'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                            <div className="group">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-b border-white/20 py-4 text-3xl font-bold focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-white/10"
                                    placeholder="ENTER TITLE..."
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-white/20 py-2 font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors text-gray-400"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Category</label>
                                    <select
                                        className="w-full bg-black/50 border-b border-white/20 py-2 font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors text-white appearance-none"
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                    >
                                        {tags.map((tag) => (
                                            <option key={tag} value={tag}>{tag}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Cover Image</label>
                                <select
                                    className="w-full bg-black/50 border-b border-white/20 py-2 font-mono text-sm focus:border-[var(--color-accent)] focus:outline-none transition-colors text-white appearance-none"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                >
                                    {images.map((img) => (
                                        <option key={img} value={img}>{img}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Excerpt</label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-b border-white/20 py-3 text-lg focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-white/10"
                                    placeholder="Brief description..."
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-4">Content (Markdown)</label>
                                <textarea
                                    className="w-full min-h-[400px] bg-white/5 border border-white/10 rounded-xl p-6 font-mono text-sm leading-relaxed focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-white/10 resize-y"
                                    placeholder="# Write your masterpiece..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                                <div className="mt-2 text-xs text-gray-500 font-mono">
                                    Supports: ## Headers, **Bold**, - Lists, ![Alt](url) Images
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="magnetic-btn bg-[var(--color-accent)] !text-black border-none hover:bg-white">
                                    <Save size={18} className="mr-2" />
                                    {currentPost ? 'Update System' : 'Deploy Entry'}
                                </button>
                                <button type="button" className="magnetic-btn border-white/20" onClick={resetForm}>
                                    Abort
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Post List */
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-600 mb-8 border-b border-white/10 pb-2">
                            <span>Index</span>
                            <div className="h-px flex-1 bg-white/10"></div>
                            <span>Total entries: {posts.length}</span>
                        </div>

                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="project-item group !py-8 !border-white/10"
                                    onClick={() => editPost(post)}
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                        <div>
                                            <h3 className="project-title !text-3xl md:!text-5xl group-hover:text-[var(--color-accent)] transition-colors">
                                                {post.title}
                                            </h3>
                                            <div className="flex gap-4 mt-2 font-mono text-xs text-gray-500">
                                                <span className="text-[var(--color-accent)]">{post.tag}</span>
                                                <span>/</span>
                                                <span>{new Date(post.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="p-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <button
                                                className="p-3 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                onClick={(e) => deletePost(post.id, e)}
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-gray-500 mb-6 font-mono">System empty. Initialize first entry.</p>
                                <button className="magnetic-btn" onClick={() => setIsEditing(true)}>
                                    <Plus size={18} className="mr-2" />
                                    Initialize
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
