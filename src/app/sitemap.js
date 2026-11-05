import { getPosts } from '../lib/services/firestore-rest';
import { getAllProjects } from '../lib/all-projects';

const BASE_URL = 'https://www.iamdelrio.com';

export const revalidate = 3600;

export default async function sitemap() {
  const staticRoutes = ['', '/blog', '/projects', '/products'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Every case page the archive links to: Firestore's projects plus the ones that live only in
  // this repo (the films' fallback entries and the concept sites)
  const [posts, projects] = await Promise.all([getPosts(), getAllProjects()]);

  const postRoutes = posts
    .filter((post) => post.slug)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const projectRoutes = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.id}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
