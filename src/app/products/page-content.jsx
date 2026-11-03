'use client';

import GridbreakArchive from '../../components/gridbreak-archive';

// Fallback products just in case
const fallbackProducts = [
	{
		id: 1,
		name: 'Fainancial',
		description: 'AI Financial Analysis',
		image: '/fainancial/1.png',
		href: 'https://fainancial.app/',
		tags: ['AI', 'Finance', 'SaaS'],
		type: 'Product',
	},
];

export default function ProductsPage() {
	return <GridbreakArchive kind="product" fallback={fallbackProducts} />;
}
