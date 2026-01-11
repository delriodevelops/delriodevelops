# Christian Del Río - Scroll-Driven Portfolio

A modern, minimal, scroll-narrative portfolio website built with Next.js, GSAP, and Lenis smooth scroll. The design follows a dark-themed aesthetic with lime-green accents, featuring 6 distinct sections that tell a visual professional story.

![Portfolio Preview](/public/portfolio_preview.png)

## ✨ Features

### Scroll-Driven Narrative (6 Sections)
1. **Hero/Intro** - Full-screen viewport with animated name, role, and CTAs
2. **About ("Who I Am")** - Styled narrative with scroll-triggered animations
3. **Skills/Tech Stack** - Icon grid with hover effects and category grouping
4. **Featured Projects** - Card layout with modals for detailed project info
5. **Professional Experience** - Animated vertical timeline
6. **Contact + CTA** - Contact form with social links and CV download

### Design System
- **Color Palette**: Minimal dark theme (#0a0a0a) with lime-green accent (#d4ff00)
- **Typography**: Inter font with clear hierarchy
- **Layout**: Grid-based, spacious, mobile-first responsive design

### Animations & Interactions
- Smooth 60fps scroll with Lenis
- GSAP ScrollTrigger for reveal animations
- Micro-interactions (hover states, button effects)
- CSS transforms for GPU-accelerated performance
- Respects `prefers-reduced-motion` for accessibility

### Performance Optimizations
- Next.js Image optimization with lazy loading
- Minimal DOM complexity
- CSS-based animations (GPU accelerated)
- Compressed and optimized assets

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Styling | CSS3 + Tailwind CSS |
| Animations | GSAP + ScrollTrigger |
| Smooth Scroll | Lenis (formerly @studio-freight/lenis) |
| Icons | Lucide React |
| Font | Inter (Google Fonts) |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/delriodevelops/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Design system + custom CSS
│   ├── layout.jsx       # Root layout with metadata
│   ├── page.jsx         # Main scroll-driven portfolio page
│   ├── products/        # Products showcase page
│   ├── projects/        # Projects showcase page
│   └── cv/              # CV download routes
├── components/
│   ├── chat.jsx         # AI chatbot component
│   └── product-card.jsx # Product card with image carousel
public/
├── me.png               # Profile photo
├── *.png                # Project screenshots
└── CV_*.pdf             # Downloadable CVs
```

## 🎨 Design Decisions

### Why Dark Theme?
- Reduces eye strain for developers/recruiters viewing portfolios
- Creates dramatic contrast for accent colors
- Aligns with modern tech industry aesthetics
- Feels premium and professional

### Why Lenis for Smooth Scroll?
- Lightweight alternative to Locomotive Scroll
- Better performance with less overhead
- Native feel while maintaining smooth momentum
- Easy integration with GSAP ScrollTrigger

### Animation Philosophy
- **Entrance animations**: Fade + translate for professional feel
- **Staggered reveals**: Sequential timing for grouped elements
- **Subtle parallax**: Depth without distraction
- **Interactive micro-states**: Immediate feedback on hover/click

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build for Production
```bash
npm run build
npm run start
```

## ⚙️ Configuration

### Animation Timing
All animation timing functions use custom cubic-bezier curves defined in CSS:
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Scroll Trigger Settings
ScrollTrigger configurations in `page.jsx`:
- `start: 'top 70%'` - Trigger when element is 70% from top
- `toggleActions: 'play none none reverse'` - Play on enter, reverse on leave

### Lenis Smooth Scroll
```javascript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});
```

## 📱 Responsive Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| Mobile | < 768px | Single column, simplified animations |
| Tablet | 768px - 968px | Two column layouts |
| Desktop | > 968px | Full experience with all animations |

## ♿ Accessibility

- **Keyboard navigation**: All interactive elements are focusable
- **Screen reader support**: Semantic HTML + ARIA labels
- **Reduced motion**: Respects `prefers-reduced-motion` media query
- **Color contrast**: WCAG 2.1 AA compliant
- **Touch targets**: Minimum 44x44px on mobile

## 🔧 Customization

### Changing Accent Color
Update the CSS custom property in `globals.css`:
```css
:root {
  --color-accent: #d4ff00; /* Change this value */
  --color-accent-hover: #e5ff40;
  --color-accent-muted: rgba(212, 255, 0, 0.1);
}
```

### Adding New Projects
Edit the `projectsData` array in `page.jsx`:
```javascript
{
  id: 5,
  title: 'New Project',
  description: 'Project description',
  image: '/path/to/image.png',
  tags: ['Tag1', 'Tag2'],
  techStack: ['React', 'Node.js'],
  role: 'Developer',
  responsibilities: ['Task 1', 'Task 2'],
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/...',
}
```

### Adding Experience Entries
Edit the `experienceData` array in `page.jsx`:
```javascript
{
  id: 4,
  company: 'Company Name',
  role: 'Job Title',
  period: '2023 - Present',
  description: 'Brief role description',
  responsibilities: ['Responsibility 1', 'Responsibility 2'],
}
```

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!

## 🤝 Connect

- **Website**: [iamdelrio.com](https://www.iamdelrio.com)
- **LinkedIn**: [/in/iamdelrio](https://www.linkedin.com/in/iamdelrio)
- **GitHub**: [/delriodevelops](https://github.com/delriodevelops)
- **YouTube**: [@iamdelrio](https://www.youtube.com/@iamdelrio)

---

Built with 💛 and lots of ☕