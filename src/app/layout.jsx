import { Inter, Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Gridbreak display face: variable width (62–125) drives the condensed/expanded contrast
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
  variable: '--font-archivo',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600'],
  variable: '--font-jetbrains',
});

export const metadata = {
  metadataBase: new URL('https://www.iamdelrio.com'),
  title: 'Christian Del Río | Engineer & Builder',
  description:
    'Full Stack Engineer & Product Builder. Crafting monumental digital experiences with AI and modern web tech. Specializing in SaaS, interactive design, and innovative solutions. Based in Madrid.',
  keywords: [
    'Full Stack Developer',
    'Software Engineer',
    'Indie Hacker',
    'AI Engineer',
    'React',
    'Next.js',
    'Creative Developer',
    'Madrid',
    'Portfolio',
    'SaaS',
  ],
  authors: [{ name: 'Christian Del Río', url: 'https://www.iamdelrio.com' }],
  creator: 'Christian Del Río',
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
    creator: '@iamdelrio',
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

  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import GlobalEffects from '../components/GlobalEffects';
import RouteCurtain from '../components/route-curtain';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <GlobalEffects />
        {children}
        <RouteCurtain />
      </body>
    </html>
  );
}
