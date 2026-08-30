import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';
import './editorial.css';
import Analytics from '../components/Analytics';

const edDisplay = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz', 'wdth'],
  variable: '--ed-font-display',
});

const edSans = Geist({ subsets: ['latin'], display: 'swap', variable: '--ed-font-sans' });
const edMono = Geist_Mono({ subsets: ['latin'], display: 'swap', variable: '--ed-font-mono' });
const edSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--ed-font-serif',
});

const fontVars = [edDisplay.variable, edMono.variable, edSans.variable, edSerif.variable].join(' ');

export const metadata = {
  metadataBase: new URL('https://www.iamdelrio.com'),
  title: {
    default: 'Christian Del Río | Engineer & Builder',
    template: '%s',
  },
  description:
    'Full Stack Engineer & Product Builder. Crafting monumental digital experiences with AI and modern web tech. Specializing in SaaS, interactive design, and innovative solutions. Based in Málaga.',
  keywords: [
    'Full Stack Developer',
    'Software Engineer',
    'Indie Hacker',
    'AI Engineer',
    'React',
    'Next.js',
    'Creative Developer',
    'Málaga',
    'Portfolio',
    'SaaS',
  ],
  authors: [{ name: 'Christian Del Río', url: 'https://www.iamdelrio.com' }],
  creator: 'Christian Del Río',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Christian Del Río | Engineer & Builder',
    description:
      'Full Stack Engineer & Product Builder. Crafting monumental digital experiences with AI and modern web tech.',
    url: 'https://www.iamdelrio.com',
    siteName: 'Christian Del Río',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christian Del Río | Engineer & Builder',
    description:
      'Full Stack Engineer & Product Builder. Crafting monumental digital experiences with AI and modern web tech.',
    creator: '@chrissdelrio',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // NOTE: add `verification: { google: '<code>' }` here once Search Console
  // hands you a real token. It previously shipped the literal placeholder
  // string 'your-google-verification-code'.
};

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  // maximumScale used to be 5; leaving it unset lets users zoom without limit.
};

export default function RootLayout({ children }) {
  return (
    // The `no-js` class and its inline unsetter are gone with the GSAP reveals:
    // nothing on the site is hidden until JavaScript runs any more.
    <html lang="en" className={fontVars}>
      <body>
        <a href="#main" className="ed-skip">
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
