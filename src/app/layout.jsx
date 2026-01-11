import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Christian Del Río | Full Stack Developer & AI Enthusiast',
  description:
    'Full Stack Developer crafting innovative digital solutions. Specializing in AI-powered applications, modern web development, and creating delightful user experiences. Based in Madrid, Spain.',
  keywords: [
    'Full Stack Developer',
    'Web Developer',
    'AI Developer',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'Madrid',
    'Portfolio',
  ],
  authors: [{ name: 'Christian Del Río', url: 'https://www.iamdelrio.com' }],
  creator: 'Christian Del Río',
  openGraph: {
    title: 'Christian Del Río | Full Stack Developer & AI Enthusiast',
    description:
      'Full Stack Developer crafting innovative digital solutions. Specializing in AI-powered applications, modern web development, and creating delightful user experiences.',
    url: 'https://www.iamdelrio.com',
    siteName: 'iamdelrio',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/portfolio_preview.png',
        width: 1920,
        height: 1080,
        alt: 'Christian Del Río - Full Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christian Del Río | Full Stack Developer & AI Enthusiast',
    description:
      'Full Stack Developer crafting innovative digital solutions. Specializing in AI-powered applications and modern web development.',
    images: ['/portfolio_preview.png'],
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <GlobalEffects />
        {children}
      </body>
    </html>
  );
}
