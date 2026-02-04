'use client';

import { useState, useEffect, useRef } from 'react';
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
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import { getAllPosts, createPost, updatePost, deletePost } from '../../lib/services/blog';
import { getAllProjects, createProject, updateProject, deleteProject } from '../../lib/services/projects';
import { uploadImage } from '../../lib/services/storage';
import MarkdownEditor from '../../components/MarkdownEditor';

const tabs = [
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'projects', label: 'Projects', icon: Folder },
];

const blogTags = ['Indie Hacking', 'AI', 'Tools', 'Personal', 'Tutorial', 'Product'];
const projectTypes = ['Product', 'Side Project', 'Experiment'];

export default function AdminDashboard() {
    const { user, loading: authLoading, isAuthorized, signIn, signOut } = useAuth();
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
        image: '/meshmind/1.png',
    });

    // Project form
    const [projectForm, setProjectForm] = useState({
        name: '',
        description: '',
        image: '/cityswipe.png',
        images: [], // Gallery images
        href: '',
        tags: [],
        type: 'Product',
        featured: false,
        order: 0,
    });

    const containerRef = useRef(null);

    // Fetch data on mount
    useEffect(() => {
        if (isAuthorized) {
            fetchData();
        }
    }, [isAuthorized]);

    // Animation
    useEffect(() => {
        if (!authLoading && isAuthorized && containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );
        }
    }, [authLoading, isAuthorized, isEditing]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [postsData, projectsData] = await Promise.all([
                getAllPosts(),
                getAllProjects(),
            ]);
            setPosts(postsData);
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setIsLoading(false);
    };

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

            await fetchData();
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

            await fetchData();
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
            image: '/meshmind/1.png',
        });
        setProjectForm({
            name: '',
            description: '',
            image: '/cityswipe.png',
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
                await fetchData();
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
                await fetchData();
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
        '/meshmind/1.png',
        '/meshmind/2.png',
        '/meshmind/3.png',
        '/fainancial/1.png',
        '/fainancial/2.png',
        '/cityswipe.png',
        '/baitme/1.png',
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

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
                    <p className="text-gray-500 font-mono uppercase tracking-widest text-sm">Initializing System...</p>
                </div>
            </div>
        );
    }

    // Login screen
    if (!user || !isAuthorized) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="noise-overlay" />
                <div className="container text-center" style={{ maxWidth: '500px' }}>
                    <h1 className="title-monumental" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                        <span className="stroke">Admin</span>
                        <span className="filled">Control</span>
                    </h1>

                    <p className="text-gray-500 mb-8 font-mono text-sm uppercase tracking-widest">
                        Authentication Required
                    </p>

                    <button
                        onClick={handleSignIn}
                        className="magnetic-btn inline-flex items-center gap-3 mx-auto"
                        style={{
                            background: 'white',
                            color: 'black',
                            border: 'none',
                            padding: '1rem 2.5rem',
                            fontWeight: '600',
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>

                    {authError && (
                        <p className="mt-6 text-red-500 font-mono text-sm">{authError}</p>
                    )}

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-white transition-colors mt-12 text-sm font-mono uppercase tracking-widest"
                    >
                        <ArrowLeft size={14} />
                        Back to site
                    </Link>
                </div>
            </div>
        );
    }

    // Main dashboard
    return (
        <div className="min-h-screen bg-black text-white relative">
            <div className="noise-overlay" />

            <div className="container mx-auto px-6 py-12" ref={containerRef}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase tracking-widest text-xs mb-8"
                        >
                            <ArrowLeft size={14} />
                            Back to site
                        </Link>
                        <h1 className="title-monumental" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
                            <span className="filled">Content</span>
                            <span className="stroke">Control</span>
                        </h1>
                        <p className="text-gray-500 mt-4 font-mono text-sm">
                            Welcome back, {user.displayName || user.email}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isEditing && (
                            <button
                                className="magnetic-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                <Plus size={18} style={{ marginRight: '0.5rem' }} />
                                New {activeTab === 'blog' ? 'Post' : 'Project'}
                            </button>
                        )}
                        <button
                            onClick={signOut}
                            className="p-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
                            title="Sign out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                {!isEditing && (
                    <div className="flex gap-2 mb-12 p-1 bg-white/5 rounded-xl w-fit border border-white/10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-[var(--color-accent)] text-black'
                                    : 'text-gray-500 hover:text-white'
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
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold uppercase tracking-wider">
                                {currentItem ? 'Edit' : 'Create'} {activeTab === 'blog' ? 'Post' : 'Project'}
                            </h2>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Blog Form */}
                        {activeTab === 'blog' && (
                            <form onSubmit={handleBlogSubmit} className="max-w-4xl mx-auto space-y-8">
                                <div className="group">
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-white/20 py-4 text-3xl font-bold focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-white/10"
                                        placeholder="ENTER TITLE..."
                                        value={blogForm.title}
                                        onChange={handleBlogTitleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Slug</label>
                                        <input
                                            type="text"
                                            className="w-full bg-transparent border-b border-white/20 py-2 font-mono text-base focus:border-[var(--color-accent)] focus:outline-none transition-colors text-gray-400"
                                            value={blogForm.slug}
                                            onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Category</label>
                                        <select
                                            className="w-full bg-black/50 border-b border-white/20 py-2 font-mono text-base focus:border-[var(--color-accent)] focus:outline-none transition-colors text-white appearance-none cursor-pointer"
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
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Cover Image</label>

                                    {/* Image Preview */}
                                    {blogForm.image && (
                                        <div className="mb-4 relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-white/10">
                                            <img
                                                src={blogForm.image}
                                                alt="Cover preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <div className="flex gap-4 items-center mb-4">
                                        <label className="magnetic-btn cursor-pointer inline-flex items-center gap-2 border-white/20">
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
                                        <span className="text-gray-500 text-sm">or select existing:</span>
                                    </div>

                                    {/* Image Select */}
                                    <select
                                        className="w-full bg-black/50 border-b border-white/20 py-2 font-mono text-base focus:border-[var(--color-accent)] focus:outline-none transition-colors text-white appearance-none cursor-pointer"
                                        value={blogForm.image}
                                        onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                                    >
                                        {images.map((img) => (
                                            <option key={img} value={img}>{img.startsWith('http') ? '📷 Uploaded Image' : img}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Excerpt</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-white/20 py-3 text-lg focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-white/10"
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
                                        className="magnetic-btn bg-[var(--color-accent)] !text-black border-none hover:bg-white disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={18} className="animate-spin mr-2" />
                                        ) : (
                                            <Save size={18} className="mr-2" />
                                        )}
                                        {currentItem ? 'Update' : 'Publish'}
                                    </button>
                                    <button type="button" className="magnetic-btn border-white/20" onClick={resetForm}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Project Form */}
                        {activeTab === 'projects' && (
                            <form onSubmit={handleProjectSubmit} className="max-w-4xl mx-auto space-y-8">
                                <div className="group">
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Project Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-white/20 py-4 text-3xl font-bold focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-white/10"
                                        placeholder="ENTER NAME..."
                                        value={projectForm.name}
                                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Type</label>
                                        <select
                                            className="w-full bg-black/50 border-b border-white/20 py-2 font-mono text-base focus:border-[var(--color-accent)] focus:outline-none transition-colors text-white appearance-none cursor-pointer"
                                            value={projectForm.type}
                                            onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                                        >
                                            {projectTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Order</label>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-b border-white/20 py-2 font-mono text-base focus:border-[var(--color-accent)] focus:outline-none transition-colors text-white"
                                            value={projectForm.order}
                                            onChange={(e) => setProjectForm({ ...projectForm, order: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Live URL</label>
                                    <input
                                        type="url"
                                        className="w-full bg-transparent border-b border-white/20 py-3 text-lg focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-white/10"
                                        placeholder="https://..."
                                        value={projectForm.href}
                                        onChange={(e) => setProjectForm({ ...projectForm, href: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Description</label>
                                    <textarea
                                        className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl p-6 font-mono text-base leading-relaxed focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-white/10 resize-y"
                                        placeholder="Describe your project..."
                                        value={projectForm.description}
                                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Cover Image</label>

                                    {/* Image Preview */}
                                    {projectForm.image && (
                                        <div className="mb-4 relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-white/10">
                                            <img
                                                src={projectForm.image}
                                                alt="Cover preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <div className="flex gap-4 items-center mb-4">
                                        <label className="magnetic-btn cursor-pointer inline-flex items-center gap-2 border-white/20">
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
                                        <span className="text-gray-500 text-sm">or select existing:</span>
                                    </div>

                                    {/* Image Select */}
                                    <select
                                        className="w-full bg-black/50 border-b border-white/20 py-2 font-mono text-base focus:border-[var(--color-accent)] focus:outline-none transition-colors text-white appearance-none cursor-pointer"
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
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                                        Gallery Images <span className="text-gray-600">({projectForm.images.length} images)</span>
                                    </label>

                                    {/* Gallery Preview Grid */}
                                    {projectForm.images.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            {projectForm.images.map((img, index) => (
                                                <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
                                                    <img
                                                        src={img}
                                                        alt={`Gallery ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    <div className="absolute bottom-2 left-2 text-xs font-mono bg-black/60 px-2 py-1 rounded">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload Multiple Images */}
                                    <label className="magnetic-btn cursor-pointer inline-flex items-center gap-2 border-white/20">
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
                                    <p className="text-xs text-gray-600 mt-2 font-mono">
                                        You can select multiple images at once. Max 5MB each.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-b border-white/20 py-3 text-base focus:border-[var(--color-accent)] focus:outline-none transition-colors placeholder-white/10"
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
                                            className="w-5 h-5 accent-[var(--color-accent)]"
                                        />
                                        <span className="text-sm uppercase tracking-widest text-gray-400">Featured Project</span>
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="magnetic-btn bg-[var(--color-accent)] !text-black border-none hover:bg-white disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={18} className="animate-spin mr-2" />
                                        ) : (
                                            <Save size={18} className="mr-2" />
                                        )}
                                        {currentItem ? 'Update' : 'Save'}
                                    </button>
                                    <button type="button" className="magnetic-btn border-white/20" onClick={resetForm}>
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
                                <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)] mx-auto mb-4" />
                                <p className="text-gray-500 font-mono">Loading...</p>
                            </div>
                        ) : (
                            <>
                                {/* Blog Posts List */}
                                {activeTab === 'blog' && (
                                    <>
                                        <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-600 mb-8 border-b border-white/10 pb-2">
                                            <span>Blog Posts</span>
                                            <div className="h-px flex-1 bg-white/10"></div>
                                            <span>Total: {posts.length}</span>
                                        </div>

                                        {posts.length > 0 ? (
                                            posts.map((post) => (
                                                <div
                                                    key={post.id}
                                                    className="project-item group !py-8 !border-white/10 cursor-pointer"
                                                    onClick={() => editPost(post)}
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                                        <div>
                                                            <h3 className="project-title !text-2xl md:!text-4xl group-hover:text-[var(--color-accent)] transition-colors">
                                                                {post.title}
                                                            </h3>
                                                            <div className="flex gap-4 mt-2 font-mono text-xs text-gray-500">
                                                                <span className="text-[var(--color-accent)]">{post.tag}</span>
                                                                <span>/</span>
                                                                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</span>
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
                                            <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                                                <p className="text-gray-500 mb-6 font-mono">No blog posts yet. Create your first one.</p>
                                                <button className="magnetic-btn" onClick={() => setIsEditing(true)}>
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
                                        <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-600 mb-8 border-b border-white/10 pb-2">
                                            <span>Projects</span>
                                            <div className="h-px flex-1 bg-white/10"></div>
                                            <span>Total: {projects.length}</span>
                                        </div>

                                        {projects.length > 0 ? (
                                            projects.map((project) => (
                                                <div
                                                    key={project.id}
                                                    className="project-item group !py-8 !border-white/10 cursor-pointer"
                                                    onClick={() => editProject(project)}
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="project-title !text-2xl md:!text-4xl group-hover:text-[var(--color-accent)] transition-colors">
                                                                    {project.name}
                                                                </h3>
                                                                {project.featured && (
                                                                    <span className="px-2 py-1 text-xs font-mono uppercase bg-[var(--color-accent)] text-black rounded">
                                                                        Featured
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-4 mt-2 font-mono text-xs text-gray-500">
                                                                <span className="text-[var(--color-accent)]">{project.type || 'Project'}</span>
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
                                                                    className="p-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    title="Visit"
                                                                >
                                                                    <ExternalLink size={18} />
                                                                </a>
                                                            )}
                                                            <button
                                                                className="p-3 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
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
                                            <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl">
                                                <p className="text-gray-500 mb-6 font-mono">No projects yet. Add your first one.</p>
                                                <button className="magnetic-btn" onClick={() => setIsEditing(true)}>
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
                <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10 py-4">
                    <div className="container mx-auto px-6 flex justify-between items-center">
                        <div className="flex gap-8 font-mono text-sm">
                            <div>
                                <span className="text-gray-500">Posts</span>
                                <span className="text-[var(--color-accent)] ml-2">{posts.length}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Projects</span>
                                <span className="text-[var(--color-accent)] ml-2">{projects.length}</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                            Firebase Connected
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
