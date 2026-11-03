'use client';
/* eslint-disable @next/next/no-img-element --
   Deliberate raw <img>: these are imperatively-swapped hover previews, admin
   upload previews backed by blob: URLs, and the print-oriented CV. next/image
   adds nothing here, especially with images.unoptimized set for Workers. */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    Eye,
    Save,
    X,
    LayoutGrid,
    FileText,
    Folder,
    LogOut,
    Loader2,
    ExternalLink,
    Upload,
    Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllPosts, createPost, updatePost, deletePost } from '../../lib/services/blog';
import { getAllProjects, createProject, updateProject, deleteProject } from '../../lib/services/projects';
import { uploadImage } from '../../lib/services/storage';
import MarkdownEditor from '../../components/MarkdownEditor';
import AuthGate from '../../components/admin/AuthGate';

const tabs = [
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'projects', label: 'Projects', icon: Folder },
];

const blogTags = ['Indie Hacking', 'AI', 'Tools', 'Personal', 'Tutorial', 'Product'];
const projectTypes = ['Product', 'Side Project', 'Experiment'];

export default function AdminDashboard() {
    const { user, loading: authLoading, isAuthorized, isConfigured, signIn, signOut } = useAuth();
    const [activeTab, setActiveTab] = useState('blog');
    const [posts, setPosts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [authError, setAuthError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    // Blog form
    const [blogForm, setBlogForm] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        tag: 'Indie Hacking',
        image: '/meshmind/1.webp',
    });

    // Project form
    const [projectForm, setProjectForm] = useState({
        name: '',
        description: '',
        image: '/cityswipe.webp',
        images: [], // Gallery images
        href: '',
        tags: [],
        type: 'Product',
        featured: false,
        order: 0,
    });

    const containerRef = useRef(null);

    /** Load posts and projects. Never sets state synchronously, so it is safe
     *  to call straight from an effect body. */
    const loadData = useCallback(async () => {
        try {
            const [postsData, projectsData] = await Promise.all([
                getAllPosts(),
                getAllProjects(),
            ]);
            setPosts(postsData);
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /** Reload after a mutation, showing the spinner while it runs. */
    const refetch = useCallback(() => {
        setIsLoading(true);
        return loadData();
    }, [loadData]);

    // Fetch data on mount
    useEffect(() => {
        if (isAuthorized) {
            void loadData();
        }
    }, [isAuthorized, loadData]);

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleBlogTitleChange = (e) => {
        const title = e.target.value;
        setBlogForm({
            ...blogForm,
            title,
            slug: generateSlug(title),
        });
    };

    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const postData = {
                ...blogForm,
                readTime: `${Math.ceil(blogForm.content.split(' ').length / 200)} min read`,
            };

            if (currentItem) {
                await updatePost(currentItem.id, postData);
            } else {
                await createPost(postData);
            }

            await refetch();
            resetForm();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Error saving post. Please try again.');
        }

        setIsSaving(false);
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (currentItem) {
                await updateProject(currentItem.id, projectForm);
            } else {
                await createProject(projectForm);
            }

            await refetch();
            resetForm();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Error saving project. Please try again.');
        }

        setIsSaving(false);
    };

    const resetForm = () => {
        setBlogForm({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            tag: 'Indie Hacking',
            image: '/meshmind/1.webp',
        });
        setProjectForm({
            name: '',
            description: '',
            image: '/cityswipe.webp',
            images: [],
            href: '',
            tags: [],
            type: 'Product',
            featured: false,
            order: 0,
        });
        setCurrentItem(null);
        setIsEditing(false);
    };

    const editPost = (post) => {
        setBlogForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            tag: post.tag,
            image: post.image,
        });
        setCurrentItem(post);
        setActiveTab('blog');
        setIsEditing(true);
    };

    const editProject = (project) => {
        setProjectForm({
            name: project.name,
            description: project.description,
            image: project.image,
            images: project.images || [],
            href: project.href,
            tags: project.tags || [],
            type: project.type || 'Product',
            featured: project.featured || false,
            order: project.order || 0,
        });
        setCurrentItem(project);
        setActiveTab('projects');
        setIsEditing(true);
    };

    const handleDeletePost = async (id, e) => {
        e?.stopPropagation();
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                await refetch();
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Error deleting post. Please try again.');
            }
        }
    };

    const handleDeleteProject = async (id, e) => {
        e?.stopPropagation();
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                await refetch();
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Error deleting project. Please try again.');
            }
        }
    };

    const handleSignIn = async () => {
        try {
            setAuthError('');
            await signIn();
        } catch (error) {
            if (error.message === 'Unauthorized email') {
                setAuthError('Access denied. This email is not authorized.');
            } else {
                setAuthError('Sign in failed. Please try again.');
            }
        }
    };

    const defaultImages = [
        '/meshmind/1.webp',
        '/meshmind/2.webp',
        '/meshmind/3.webp',
        '/fainancial/1.webp',
        '/fainancial/2.webp',
        '/cityswipe.webp',
        '/baitme/1.webp',
    ];

    // Combine default images with uploaded ones
    const images = [...uploadedImages, ...defaultImages];

    // Handle image upload
    const handleImageUpload = async (e, formType) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        setIsUploading(true);
        try {
            const folder = formType === 'blog' ? 'blog-covers' : 'project-covers';
            const url = await uploadImage(file, folder);

            // Add to uploaded images
            setUploadedImages(prev => [url, ...prev]);

            // Set as current image
            if (formType === 'blog') {
                setBlogForm(prev => ({ ...prev, image: url }));
            } else {
                setProjectForm(prev => ({ ...prev, image: url }));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        }
        setIsUploading(false);
    };

    // Handle multiple image upload for project gallery
    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate all files
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                alert('Please select only image files');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Each image must be less than 5MB');
                return;
            }
        }

        setIsUploading(true);
        try {
            const uploadPromises = files.map(file => uploadImage(file, 'project-gallery'));
            const urls = await Promise.all(uploadPromises);

            // Add all to project images
            setProjectForm(prev => ({
                ...prev,
                images: [...prev.images, ...urls]
            }));
        } catch (error) {
            console.error('Error uploading gallery images:', error);
            alert('Failed to upload some images. Please try again.');
        }
        setIsUploading(false);
    };

    // Remove image from gallery
    const removeGalleryImage = (index) => {
        setProjectForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    if (authLoading || !user || !isAuthorized) {
        return (
            <AuthGate
                loading={authLoading}
                authError={authError}
                isConfigured={isConfigured}
                onSignIn={handleSignIn}
            />
        );
    }

    // Main dashboard
    return (
        <div className="ed-root ed-admin-shell relative">

            <div className="container mx-auto px-6 py-12" ref={containerRef}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div>
                        <Link
                            href="/"
                            className="ed-article-back ed-mono"
                        >
                            <ArrowLeft size={14} />
                            Back to site
                        </Link>
                        <h1 className="ed-admin-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                            Content<br />Control
                        </h1>
                        <p className="ed-mono mt-4">
                            Welcome back, {user.displayName || user.email}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isEditing && (
                            <button
                                className="ed-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                <Plus size={18} style={{ marginRight: '0.5rem' }} />
                                New {activeTab === 'blog' ? 'Post' : 'Project'}
                            </button>
                        )}
                        <button
                            onClick={signOut}
                            className="ed-icon-btn"
                            title="Sign out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                {!isEditing && (
                    <div className="ed-tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'ed-tab is-active'
                                    : 'ed-tab'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content */}
                {isEditing ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="ed-admin-panel-head">
                            <h2 className="text-2xl font-bold uppercase tracking-wider">
                                {currentItem ? 'Edit' : 'Create'} {activeTab === 'blog' ? 'Post' : 'Project'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="ed-icon-plain"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Blog Form */}
                        {activeTab === 'blog' && (
                            <form onSubmit={handleBlogSubmit} className="max-w-4xl mx-auto space-y-8">
                                <div className="group">
                                    <label className="ed-label">Title</label>
                                    <input
                                        type="text"
                                        className="ed-input ed-input--title"
                                        placeholder="ENTER TITLE..."
                                        value={blogForm.title}
                                        onChange={handleBlogTitleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="ed-label">Slug</label>
                                        <input
                                            type="text"
                                            className="ed-input ed-input--mono"
                                            value={blogForm.slug}
                                            onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="ed-label">Category</label>
                                        <select
                                            className="ed-select"
                                            value={blogForm.tag}
                                            onChange={(e) => setBlogForm({ ...blogForm, tag: e.target.value })}
                                        >
                                            {blogTags.map((tag) => (
                                                <option key={tag} value={tag}>{tag}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="ed-label">Cover Image</label>

                                    {/* Image Preview */}
                                    {blogForm.image && (
                                        <div className="ed-thumb mb-4 relative w-full max-w-md aspect-video overflow-hidden">
                                            <img
                                                src={blogForm.image}
                                                alt="Cover preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <div className="flex gap-4 items-center mb-4">
                                        <label className="ed-btn cursor-pointer">
                                            {isUploading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Upload size={16} />
                                            )}
                                            Upload New
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e, 'blog')}
                                                disabled={isUploading}
                                            />
                                        </label>
                                        <span className="ed-mono">or select existing:</span>
                                    </div>

                                    {/* Image Select */}
                                    <select
                                        className="ed-select"
                                        value={blogForm.image}
                                        onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                                    >
                                        {images.map((img) => (
                                            <option key={img} value={img}>{img.startsWith('http') ? '📷 Uploaded Image' : img}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="ed-label">Excerpt</label>
                                    <input
                                        type="text"
                                        className="ed-input"
                                        placeholder="Brief description..."
                                        value={blogForm.excerpt}
                                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <MarkdownEditor
                                        value={blogForm.content}
                                        onChange={(content) => setBlogForm({ ...blogForm, content })}
                                        placeholder="# Write your masterpiece..."
                                        minHeight="500px"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="ed-btn ed-btn--solid"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={18} className="animate-spin mr-2" />
                                        ) : (
                                            <Save size={18} className="mr-2" />
                                        )}
                                        {currentItem ? 'Update' : 'Publish'}
                                    </button>
                                    <button type="button" className="ed-btn" onClick={resetForm}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Project Form */}
                        {activeTab === 'projects' && (
                            <form onSubmit={handleProjectSubmit} className="max-w-4xl mx-auto space-y-8">
                                <div className="group">
                                    <label className="ed-label">Project Name</label>
                                    <input
                                        type="text"
                                        className="ed-input ed-input--title"
                                        placeholder="ENTER NAME..."
                                        value={projectForm.name}
                                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="ed-label">Type</label>
                                        <select
                                            className="ed-select"
                                            value={projectForm.type}
                                            onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                                        >
                                            {projectTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="ed-label">Order</label>
                                        <input
                                            type="number"
                                            className="ed-input ed-input--mono"
                                            value={projectForm.order}
                                            onChange={(e) => setProjectForm({ ...projectForm, order: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="ed-label">Live URL</label>
                                    <input
                                        type="url"
                                        className="ed-input"
                                        placeholder="https://..."
                                        value={projectForm.href}
                                        onChange={(e) => setProjectForm({ ...projectForm, href: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="ed-label">Description</label>
                                    <textarea
                                        className="ed-textarea"
                                        placeholder="Describe your project..."
                                        value={projectForm.description}
                                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="ed-label">Cover Image</label>

                                    {/* Image Preview */}
                                    {projectForm.image && (
                                        <div className="ed-thumb mb-4 relative w-full max-w-md aspect-video overflow-hidden">
                                            <img
                                                src={projectForm.image}
                                                alt="Cover preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <div className="flex gap-4 items-center mb-4">
                                        <label className="ed-btn cursor-pointer">
                                            {isUploading ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Upload size={16} />
                                            )}
                                            Upload New
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e, 'project')}
                                                disabled={isUploading}
                                            />
                                        </label>
                                        <span className="ed-mono">or select existing:</span>
                                    </div>

                                    {/* Image Select */}
                                    <select
                                        className="ed-select"
                                        value={projectForm.image}
                                        onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                                    >
                                        {images.map((img) => (
                                            <option key={img} value={img}>{img.startsWith('http') ? '📷 Uploaded Image' : img}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Gallery Images */}
                                <div>
                                    <label className="ed-label">
                                        Gallery Images <span className="ed-mono">({projectForm.images.length} images)</span>
                                    </label>

                                    {/* Gallery Preview Grid */}
                                    {projectForm.images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            {projectForm.images.map((img, index) => (
                                                <div key={index} className="ed-thumb relative group aspect-video overflow-hidden">
                                                    <img
                                                        src={img}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="ed-thumb-remove absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    <div className="ed-thumb-tag ed-mono absolute bottom-2 left-2">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload Multiple Images */}
                                    <label className="ed-btn cursor-pointer">
                                        {isUploading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <Upload size={16} />
                                        )}
                                        Add Gallery Images
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleGalleryUpload}
                                            disabled={isUploading}
                                        />
                                    </label>
                                    <p className="ed-mono mt-2">
                                        You can select multiple images at once. Max 5MB each.
                                    </p>
                                </div>

                                <div>
                                    <label className="ed-label">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        className="ed-input"
                                        placeholder="AI, SaaS, Web..."
                                        value={projectForm.tags.join(', ')}
                                        onChange={(e) => setProjectForm({
                                            ...projectForm,
                                            tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                                        })}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={projectForm.featured}
                                            onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                                            className="w-5 h-5 ed-checkbox"
                                        />
                                        <span className="ed-mono">Featured Project</span>
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="ed-btn ed-btn--solid"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={18} className="animate-spin mr-2" />
                                        ) : (
                                            <Save size={18} className="mr-2" />
                                        )}
                                        {currentItem ? 'Update' : 'Save'}
                                    </button>
                                    <button type="button" className="ed-btn" onClick={resetForm}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    /* Content Lists */
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="text-center py-24">
                                <Loader2 className="w-8 h-8 animate-spin ed-spin mx-auto mb-4" />
                                <p className="ed-mono">Loading...</p>
                            </div>
                        ) : (
                            <>
                                {/* Blog Posts List */}
                                {activeTab === 'blog' && (
                                    <>
                                        <div className="ed-mono ed-admin-subhead">
                                            <span>Blog Posts</span>
                                            <div className="ed-hairline flex-1"></div>
                                            <span>Total: {posts.length}</span>
                                        </div>

                                        {posts.length > 0 ? (
                                            posts.map((post) => (
                                                <div
                                                    key={post.id}
                                                    className="ed-admin-row group cursor-pointer"
                                                    onClick={() => editPost(post)}
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                                        <div>
                                                            <h3 className="ed-admin-row-title">
                                                                {post.title}
                                                            </h3>
                                                            <div className="ed-mono flex gap-4 mt-2">
                                                                <span className="ed-mono--signal">{post.tag}</span>
                                                                <span>/</span>
                                                                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link
                                                                href={`/blog/${post.slug}`}
                                                                className="ed-icon-btn"
                                                                onClick={(e) => e.stopPropagation()}
                                                                title="View"
                                                            >
                                                                <Eye size={18} />
                                                            </Link>
                                                            <button
                                                                className="ed-icon-btn ed-icon-btn--danger"
                                                                onClick={(e) => handleDeletePost(post.id, e)}
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="ed-empty ed-mono">
                                                <p className="ed-mono mb-6">No blog posts yet. Create your first one.</p>
                                                <button className="ed-btn" onClick={() => setIsEditing(true)}>
                                                    <Plus size={18} className="mr-2" />
                                                    Create Post
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Projects List */}
                                {activeTab === 'projects' && (
                                    <>
                                        <div className="ed-mono ed-admin-subhead">
                                            <span>Projects</span>
                                            <div className="ed-hairline flex-1"></div>
                                            <span>Total: {projects.length}</span>
                                        </div>

                                        {projects.length > 0 ? (
                                            projects.map((project) => (
                                                <div
                                                    key={project.id}
                                                    className="ed-admin-row group cursor-pointer"
                                                    onClick={() => editProject(project)}
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="ed-admin-row-title">
                                                                    {project.name}
                                                                </h3>
                                                                {project.featured && (
                                                                    <span className="ed-pill">
                                                                        Featured
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="ed-mono flex gap-4 mt-2">
                                                                <span className="ed-mono--signal">{project.type || 'Project'}</span>
                                                                {project.tags?.length > 0 && (
                                                                    <>
                                                                        <span>/</span>
                                                                        <span>{project.tags.join(', ')}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {project.href && (
                                                                <a
                                                                    href={project.href}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="ed-icon-btn"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    title="Visit"
                                                                >
                                                                    <ExternalLink size={18} />
                                                                </a>
                                                            )}
                                                            <button
                                                                className="ed-icon-btn ed-icon-btn--danger"
                                                                onClick={(e) => handleDeleteProject(project.id, e)}
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="ed-empty ed-mono">
                                                <p className="ed-mono mb-6">No projects yet. Add your first one.</p>
                                                <button className="ed-btn" onClick={() => setIsEditing(true)}>
                                                    <Plus size={18} className="mr-2" />
                                                    Add Project
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Stats Footer */}
            {!isEditing && !isLoading && (
                <div className="ed-admin-statusbar">
                    <div className="container mx-auto px-6 flex justify-between items-center">
                        <div className="flex gap-8 font-mono text-sm">
                            <div>
                                <span className="ed-mono">Posts</span>
                                <span className="ed-mono--signal ml-2">{posts.length}</span>
                            </div>
                            <div>
                                <span className="ed-mono">Projects</span>
                                <span className="ed-mono--signal ml-2">{projects.length}</span>
                            </div>
                        </div>
                        <div className="ed-mono">
                            Firebase Connected
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
