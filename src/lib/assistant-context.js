import { getPosts } from './services/firestore-rest';
import { getAllProjects } from './all-projects';
import { buildSystemPrompt } from './assistant-prompt';

/**
 * The assistant's system prompt with what the site shows right now: every
 * project and post (Firestore reads are cached by firestore-rest for 5 minutes).
 */
export async function loadSystemPrompt() {
  const [projects, posts] = await Promise.all([getAllProjects(), getPosts().catch(() => [])]);
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' });
  return buildSystemPrompt({ projects, posts, today });
}
