'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Rocket, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { getAllProjects } from '../../lib/services/projects';

// Fallback products just in case
const fallbackProducts = [
	{
		id: 1,
		number: '01',
		name: 'Fainancial',
		description: 'AI Financial Analysis',
		images: ['/fainancial/1.png'],
		href: 'https://fainancial.app/',
		tags: ['AI', 'Finance', 'SaaS'],
		type: 'Product',
	},
];

export default function ProductsPage() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const listRef = useRef(null);
	const revealRef = useRef(null);

	// Fetch filtered products from Firebase
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const firebaseProjects = await getAllProjects();
				if (firebaseProjects.length > 0) {
					const formattedProducts = firebaseProjects.map((project, index) => ({
						id: project.id,
						number: String(index + 1).padStart(2, '0'),
						name: project.name || project.title,
						description: project.description,
						images: project.image ? [project.image] : [],
						href: project.href || project.liveUrl,
						tags: project.tags || [],
						wip: project.wip,
						category: project.type || project.category || (project.tags && project.tags.includes('Product') ? 'Product' : 'Project'),
					})).filter(p => p.category.toUpperCase() === 'PRODUCT'); // Show only Products

					setProducts(formattedProducts);
				} else {
					setProducts(fallbackProducts);
				}
			} catch (error) {
				console.error('Error fetching products:', error);
				setProducts(fallbackProducts);
			}
			setIsLoading(false);
		};

		fetchProducts();
	}, []);

	// Animation logic
	useEffect(() => {
		if (isLoading) return;

		const items = document.querySelectorAll('.project-item');
		const reveal = revealRef.current;
		const revealImg = reveal?.querySelector('img');

		if (!reveal || !items.length) return;

		const moveReveal = (e) => {
			gsap.to(reveal, {
				x: e.clientX,
				y: e.clientY,
				duration: 0.1,
				ease: 'power2.out'
			});
		};

		window.addEventListener('mousemove', moveReveal);

		items.forEach((item) => {
			item.addEventListener('mouseenter', () => {
				const img = item.getAttribute('data-img');
				if (revealImg && img) revealImg.src = img;

				gsap.to(reveal, {
					opacity: 1,
					scale: 1,
					duration: 0.3,
					ease: 'power2.out'
				});
			});

			item.addEventListener('mouseleave', () => {
				gsap.to(reveal, {
					opacity: 0,
					scale: 0.8,
					duration: 0.3,
					ease: 'power2.out'
				});
			});
		});

		return () => {
			window.removeEventListener('mousemove', moveReveal);
		};
	}, [products, isLoading]);

	return (
		<div style={{ minHeight: '100vh', background: 'var(--color-bg)', overflowX: 'hidden' }}>
			{/* Reveal Image Container - Fixed Global */}
			<div
				ref={revealRef}
				className="project-image-reveal"
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '400px',
					height: '250px',
					pointerEvents: 'none',
					opacity: 0,
					zIndex: 20,
					transform: 'translate(-50%, -50%) scale(0.8)',
					borderRadius: '8px',
					overflow: 'hidden',
				}}
			>
				<div className="reveal-inner" style={{ width: '100%', height: '100%' }}>
					<img
						src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
						alt="Project Preview"
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				</div>
			</div>

			{/* Header */}
			<header style={{ padding: '15vh 0 5vh' }}>
				<div className="container">
					<Link
						href="/"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: '1rem',
							color: '#888',
							textDecoration: 'none',
							fontSize: '0.9rem',
							letterSpacing: '0.05em',
							marginBottom: '4rem',
							textTransform: 'uppercase',
							transition: 'color 0.3s ease',
						}}
						onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
						onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
					>
						<ArrowLeft size={16} />
						Back home
					</Link>

					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '4rem' }}>
						<div>
							<span className="section-label" style={{ marginBottom: '1rem', display: 'block' }}>Shipped Products</span>
							<h1 className="title-monumental" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.9, marginBottom: '2rem' }}>
								Products
							</h1>
							<p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '500px', lineHeight: 1.6 }}>
								Complete products that solve real problems.
								Built with care, designed to deliver value.
							</p>
						</div>

						{/* Toggle */}
						<div style={{
							display: 'flex',
							background: 'rgba(255,255,255,0.05)',
							border: '1px solid rgba(255,255,255,0.1)',
							borderRadius: '100px',
							padding: '0.5rem',
						}}>
							<Link
								href="/products"
								style={{
									padding: '0.8rem 2rem',
									borderRadius: '100px',
									fontSize: '0.9rem',
									fontWeight: '600',
									textTransform: 'uppercase',
									letterSpacing: '0.05em',
									background: 'var(--color-accent)',
									color: '#000',
									textDecoration: 'none',
								}}
							>
								Products
							</Link>
							<Link
								href="/projects"
								style={{
									padding: '0.8rem 2rem',
									borderRadius: '100px',
									fontSize: '0.9rem',
									fontWeight: '600',
									textTransform: 'uppercase',
									letterSpacing: '0.05em',
									color: '#888',
									textDecoration: 'none',
									transition: 'all 0.3s ease',
								}}
								onMouseEnter={(e) => e.target.style.color = '#fff'}
								onMouseLeave={(e) => e.target.style.color = '#888'}
							>
								Projects
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Products List - Monumental Style */}
			<section className="container" style={{ paddingBottom: '15vh' }}>
				<div ref={listRef} className="projects-list">
					{products.map((product) => (
						<Link
							key={product.id}
							href={`/projects/${product.id}`}
							className="project-item"
							data-img={product.images[0]}
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: '4rem 0',
								borderTop: '1px solid rgba(255,255,255,0.1)',
								textDecoration: 'none',
								position: 'relative',
							}}
						>
							<div>
								<h3 className="project-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
									{product.name}
									{product.wip && <sup style={{ fontSize: '0.8rem', color: '#facc15', marginLeft: '1rem', letterSpacing: '0.1em' }}>WIP</sup>}
								</h3>
								<div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', color: '#666', fontFamily: 'monospace', textTransform: 'uppercase' }}>
									{product.tags.map((tag, i) => (
										<span key={i}>{i > 0 && ' / '}{tag}</span>
									))}
								</div>
							</div>
							<div style={{ textAlign: 'right', display: 'none', md: 'block' }} className="project-meta-right">
								<span style={{ fontSize: '1.2rem', color: '#444' }}>{product.number}</span>
							</div>
							<ArrowUpRight className="project-arrow" size={32} color="var(--color-accent)" style={{ opacity: 0.5 }} />
						</Link>
					))}
					<div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
				</div>
			</section>

		</div>
	);
}
