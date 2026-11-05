'use client';

import GridbreakArchive from '../../components/gridbreak-archive';

// `projects` comes from the server (page.jsx); each one opens its case study
export default function ProjectsPageContent({ projects = [] }) {
  const items = projects.map((project) => ({
    id: project.id,
    name: project.name || project.title,
    image: project.image,
    tags: project.tags || [],
    date: project.date,
    createdAt: project.createdAt,
    wip: project.wip,
    concept: project.concept,
    external: false,
  }));

  return <GridbreakArchive kind="project" items={items} />;
}
