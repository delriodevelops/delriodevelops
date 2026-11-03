'use client';

import GridbreakArchive from '../../components/gridbreak-archive';

// Fallback static projects for when Firebase is not configured
const fallbackProjects = [
    {
        id: 1,
        name: 'CitySwipe',
        description: 'Swipe through cities to find your perfect place to live.',
        image: '/cityswipe.png',
        href: 'https://cityswipe.city',
        tags: ['AI', 'Mobile', 'Lifestyle'],
    },
    {
        id: 2,
        name: 'DR.NEWS',
        description: 'Stay informed with AI-curated news.',
        image: '/drnews.png',
        href: 'https://drnews.iamdelrio.com/',
        tags: ['AI', 'News', 'Web'],
    },
    {
        id: 3,
        name: 'My Dog Food',
        description: 'Smart feeding recommendations for your furry friend.',
        image: '/mydogfood.png',
        href: 'https://mydogfood.vercel.app/',
        tags: ['AI', 'Pets', 'Health'],
    },
    {
        id: 4,
        name: 'Clyme',
        description: "You can't control weather, but you can predict it with Clyme!",
        image: '/clyme.png',
        href: 'https://clyme.vercel.app/',
        tags: ['Utility', 'Weather', 'Web'],
    },
];

export default function ProjectsPage() {
    return <GridbreakArchive kind="project" fallback={fallbackProjects} />;
}
