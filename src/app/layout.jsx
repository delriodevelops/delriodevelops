import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'iamdelrio | Full Stack Developer',
  description: 'Portfolio with AI Assitant. Keeping up to the future, learning every day. Excited about the future of technology and its possibilities. Real-world experience in the professional field, adding value through personal projects. Committed to continuous growth and the creation of impactful solutions.',
  openGraph: {
    title: 'iamdelrio | Full Stack Developer',
    description: 'Portfolio with AI Assitant. Keeping up to the future, learning every day. Excited about the future of technology and its possibilities. Real-world experience in the professional field, adding value through personal projects. Committed to continuous growth and the creation of impactful solutions.',
    url: 'https://www.iamdelrio.com',
    siteName: 'iamdelrio',
    type: 'website',
    images: [
      {
        url: '/portfolio_preview.png',
        width: 1920,
        height: 1440,
        alt: 'Og Image Alt',
      },
    ],
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-[#0f0f0f]'}>{children}</body>
    </html>
  )
}
