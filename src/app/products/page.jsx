'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowUpRight, ExternalLink, Rocket } from 'lucide-react';

const products = [
	{
		id: 1,
		number: '01',
		name: 'Fainancial',
		description: 'Transform complex earnings calls into actionable insights instantly. AI-powered financial analysis.',
		images: ['/fainancial/1.png', '/fainancial/2.png', '/fainancial/3.png', '/fainancial/4.png', '/fainancial/5.png'],
		href: 'https://fainancial.app/',
		tags: ['AI', 'Finance', 'SaaS'],
		wip: true,
		featured: true,
	},
	{
		id: 2,
		number: '02',
		name: 'MeshMind',
		description: 'Create custom chains of thought. Visual AI reasoning builder for complex problem solving.',
		images: ['/meshmind/1.png', '/meshmind/2.png', '/meshmind/3.png', '/meshmind/4.png'],
		href: 'https://meshmind.vercel.app/',
		tags: ['AI', 'Productivity', 'Tool'],
		featured: true,
	},
	{
		id: 3,
		number: '03',
		name: 'Baitme',
		description: 'A/B test your YouTube thumbnails and titles. Get more clicks with data-driven decisions.',
		images: ['/baitme/1.png'],
		href: 'https://baitme.iamdelrio.com/',
		tags: ['Creator Tools', 'Analytics'],
	},
	{
		id: 4,
		number: '04',
		name: 'Escudo Leal JPT',
		description: 'Professional landing page for a security company. Clean, modern, and conversion-focused.',
		images: ['/escudolealjpt/1.png'],
		href: 'https://www.escudolealjpt.com',
		tags: ['Landing Page', 'Client Work'],
	},
];

function ProductCard({ product }) {
	const [currentImage, setCurrentImage] = useState(0);
	const [isHovered, setIsHovered] = useState(false);

	return (
		<a
			href={product.href}
			target="_blank"
			rel="noopener noreferrer"
			className={`project-card ${product.featured ? 'featured' : ''}`}
			style={{ opacity: 1, transform: 'none' }}
			onMouseEnter={() => {
				setIsHovered(true);
				if (product.images.length > 1) {
					const interval = setInterval(() => {
						setCurrentImage((prev) => (prev + 1) % product.images.length);
					}, 800);
					// Store interval ID for cleanup
					window[`product-${product.id}`] = interval;
				}
			}}
			onMouseLeave={() => {
				setIsHovered(false);
				setCurrentImage(0);
				if (window[`product-${product.id}`]) {
					clearInterval(window[`product-${product.id}`]);
				}
			}}
		>
			<div className="project-card-image" style={{ position: 'relative' }}>
				<Image
					src={product.images[currentImage]}
					alt={product.name}
					width={1200}
					height={600}
					quality={85}
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>

				{/* WIP Badge */}
				{product.wip && (
					<div
						style={{
							position: 'absolute',
							top: 'var(--space-md)',
							right: 'var(--space-md)',
							padding: 'var(--space-xs) var(--space-md)',
							background: '#facc15',
							color: '#000',
							fontSize: '0.75rem',
							fontWeight: '700',
							borderRadius: '100px',
							textTransform: 'uppercase',
							letterSpacing: '0.05em',
							display: 'flex',
							alignItems: 'center',
							gap: 'var(--space-xs)',
						}}
					>
						<Rocket size={12} />
						Building
					</div>
				)}

				{/* Image indicators */}
				{product.images.length > 1 && (
					<div
						style={{
							position: 'absolute',
							bottom: 'var(--space-md)',
							left: '50%',
							transform: 'translateX(-50%)',
							display: 'flex',
							gap: 'var(--space-xs)',
						}}
					>
						{product.images.map((_, i) => (
							<div
								key={i}
								style={{
									width: '6px',
									height: '6px',
									borderRadius: '50%',
									background: i === currentImage ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)',
									transition: 'all 0.3s var(--ease-out-expo)',
								}}
							/>
						))}
					</div>
				)}
			</div>

			<div className="project-card-content">
				<div className="project-card-number">{product.number}</div>
				<h3 className="project-card-title">{product.name}</h3>
				<p className="project-card-description">{product.description}</p>
				<div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
					{product.tags.map((tag) => (
						<span
							key={tag}
							style={{
								padding: 'var(--space-xs) var(--space-sm)',
								background: 'var(--color-accent-muted)',
								color: 'var(--color-accent)',
								fontSize: '0.75rem',
								fontWeight: '600',
								borderRadius: '100px',
								textTransform: 'uppercase',
								letterSpacing: '0.05em',
							}}
						>
							{tag}
						</span>
					))}
				</div>
			</div>
		</a>
	);
}

export default function ProductsPage() {
	return (
		<div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
			{/* Header */}
			<header style={{ padding: 'var(--space-6xl) 0 var(--space-3xl)' }}>
				<div className="container">
					<Link
						href="/"
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 'var(--space-sm)',
							color: 'var(--color-text-muted)',
							textDecoration: 'none',
							fontSize: '0.875rem',
							marginBottom: 'var(--space-xl)',
							transition: 'color 0.3s var(--ease-out-expo)',
						}}
						onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
						onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
					>
						<ArrowLeft size={16} />
						Back home
					</Link>

					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-xl)' }}>
						<div>
							<span className="section-label">Shipped Products</span>
							<h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 'var(--space-md)' }}>
								Products
							</h1>
							<p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', maxWidth: '500px' }}>
								Complete products that solve real problems.
								Built with care, designed to deliver value.
							</p>
						</div>

						{/* Toggle */}
						<div style={{
							display: 'flex',
							background: 'var(--color-bg-card)',
							border: '1px solid var(--color-border)',
							borderRadius: '100px',
							padding: 'var(--space-xs)',
						}}>
							<Link
								href="/products"
								style={{
									padding: 'var(--space-sm) var(--space-lg)',
									borderRadius: '100px',
									fontSize: '0.875rem',
									fontWeight: '500',
									background: 'var(--color-accent)',
									color: 'var(--color-bg)',
									textDecoration: 'none',
								}}
							>
								Products
							</Link>
							<Link
								href="/projects"
								style={{
									padding: 'var(--space-sm) var(--space-lg)',
									borderRadius: '100px',
									fontSize: '0.875rem',
									fontWeight: '500',
									color: 'var(--color-text-muted)',
									textDecoration: 'none',
									transition: 'all 0.3s var(--ease-out-expo)',
								}}
							>
								Projects
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Products Grid */}
			<section className="container" style={{ paddingBottom: 'var(--space-6xl)' }}>
				<div className="projects-grid">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</section>

			{/* Stats */}
			<section style={{
				padding: 'var(--space-4xl) 0',
				borderTop: '1px solid var(--color-border)',
				borderBottom: '1px solid var(--color-border)',
				background: 'var(--color-bg-elevated)',
			}}>
				<div className="container">
					<div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4xl)', flexWrap: 'wrap', textAlign: 'center' }}>
						<div>
							<div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: 'var(--color-text-primary)' }}>
								4<span style={{ color: 'var(--color-accent)' }}>+</span>
							</div>
							<div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
								Products
							</div>
						</div>
						<div>
							<div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: 'var(--color-text-primary)' }}>
								2<span style={{ color: 'var(--color-accent)' }}>+</span>
							</div>
							<div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
								In Development
							</div>
						</div>
						<div>
							<div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: 'var(--color-text-primary)' }}>
								🚀
							</div>
							<div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
								Shipping Fast
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section style={{ padding: 'var(--space-4xl) 0' }}>
				<div className="container" style={{ textAlign: 'center' }}>
					<h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 'var(--space-md)' }}>
						Have a product idea?
					</h2>
					<p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '500px', margin: '0 auto var(--space-xl)' }}>
						Let&apos;s collaborate and bring it to life together.
					</p>
					<Link href="/#contact" className="btn btn-primary">
						Get in touch
						<ArrowUpRight size={18} />
					</Link>
				</div>
			</section>
		</div>
	);
}
