'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, Save, X } from 'lucide-react';

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

    const deletePost = (id) => {
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

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div className="admin-container">
                {/* Header */}
                <div className="admin-header">
                    <div>
                        <Link
                            href="/"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)',
                                color: 'var(--color-text-muted)',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                marginBottom: 'var(--space-md)',
                            }}
                        >
                            <ArrowLeft size={16} />
                            Back home
                        </Link>
                        <h1 className="admin-title">Blog Admin</h1>
                    </div>

                    {!isEditing && (
                        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                            <Plus size={18} />
                            New Post
                        </button>
                    )}
                </div>

                {/* Editor */}
                {isEditing && (
                    <div
                        style={{
                            background: 'var(--color-bg-card)',
                            borderRadius: '24px',
                            padding: 'var(--space-2xl)',
                            border: '1px solid var(--color-border)',
                            marginBottom: 'var(--space-3xl)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 'var(--space-xl)',
                            }}
                        >
                            <h2 style={{ fontSize: '1.5rem' }}>{currentPost ? 'Edit Post' : 'New Post'}</h2>
                            <button
                                onClick={resetForm}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-muted)',
                                    cursor: 'pointer',
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form className="editor-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="editor-input title"
                                    placeholder="Post title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>

                            <div className="editor-row">
                                <div className="form-group">
                                    <label className="form-label">Slug</label>
                                    <input
                                        type="text"
                                        className="editor-input"
                                        placeholder="post-slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tag</label>
                                    <select
                                        className="editor-input"
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                    >
                                        {tags.map((tag) => (
                                            <option key={tag} value={tag}>
                                                {tag}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Cover Image</label>
                                <select
                                    className="editor-input"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                >
                                    {images.map((img) => (
                                        <option key={img} value={img}>
                                            {img}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Excerpt</label>
                                <input
                                    type="text"
                                    className="editor-input"
                                    placeholder="Brief description of the post"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Content (Markdown)</label>
                                <textarea
                                    className="editor-input editor-textarea"
                                    placeholder="Write your post content here...

## Use Markdown

- Lists work
- Like this

**Bold** and regular text supported."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} />
                                    {currentPost ? 'Update Post' : 'Publish Post'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Posts List */}
                <div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xl)' }}>
                        {posts.length} Post{posts.length !== 1 ? 's' : ''}
                    </h2>

                    {posts.length > 0 ? (
                        <div className="posts-list">
                            {posts.map((post) => (
                                <div key={post.id} className="post-list-item">
                                    <div className="post-list-info">
                                        <h3 className="post-list-title">{post.title}</h3>
                                        <div className="post-list-meta">
                                            <span
                                                style={{
                                                    color: 'var(--color-accent)',
                                                    fontWeight: '600',
                                                    marginRight: 'var(--space-md)',
                                                }}
                                            >
                                                {post.tag}
                                            </span>
                                            <span>{new Date(post.date).toLocaleDateString()}</span>
                                            {post.readTime && <span> · {post.readTime}</span>}
                                        </div>
                                    </div>

                                    <div className="post-list-actions">
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="btn btn-icon btn-secondary"
                                            title="Preview"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <button
                                            className="btn btn-icon btn-secondary"
                                            onClick={() => editPost(post)}
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            className="btn btn-icon btn-secondary"
                                            onClick={() => deletePost(post.id)}
                                            title="Delete"
                                            style={{ color: '#ff6b6b' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: 'var(--space-4xl)',
                                background: 'var(--color-bg-card)',
                                borderRadius: '16px',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
                                No posts yet. Create your first post!
                            </p>
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                <Plus size={18} />
                                Create Post
                            </button>
                        </div>
                    )}
                </div>

                {/* Help */}
                <div
                    style={{
                        marginTop: 'var(--space-4xl)',
                        padding: 'var(--space-xl)',
                        background: 'var(--color-accent-muted)',
                        borderRadius: '16px',
                        border: '1px solid rgba(200, 255, 0, 0.2)',
                    }}
                >
                    <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)' }}>
                        💡 Tips
                    </h3>
                    <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', paddingLeft: 'var(--space-lg)' }}>
                        <li>Posts are stored in your browser&apos;s localStorage</li>
                        <li>Use Markdown syntax: ## for headers, **bold**, - for lists</li>
                        <li>For production, connect to a database like Supabase or Firebase</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
