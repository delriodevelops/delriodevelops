import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Head from 'next/head'
import Contact from './Contact'

const Layout = ({children}) => {
  return (
    <>
        <Head>
            <title>Del Rio</title>
            <link rel="icon" type="image/x-icon" href="favicon.ico"/>
            <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet"/>
            <title>Del Rio — Full Stack Developer</title>
            
            <meta name="title" content="Del Rio — Full Stack Developer"/>
            <meta name="description" content="Freelance Full Stack Developer Christian del Rio Rodriguez. Proficent in Next.JS. Open to work. Madrid, Spain. Contact within just 2 hours."/>

            <meta property="og:type" content="website"/>
            <meta property="og:url" content="https://www.iamdelrio.com"/>
            <meta property="og:title" content="Del Rio — Full Stack Developer"/>
            <meta property="og:description" content="Freelance Full Stack Developer Christian del Rio Rodriguez. Proficent in Next.JS. Open to work. Madrid, Spain. Contact within just 2 hours."/>
            <meta property="og:image" content="https://i.imgur.com/WeE5ZK2.png"/>

            <meta property="twitter:card" content="summary_large_image"/>
            <meta property="twitter:url" content="https://www.iamdelrio.com"/>
            <meta property="twitter:title" content="Del Rio — Full Stack Developer"/>
            <meta property="twitter:description" content="Freelance Full Stack Developer Christian del Rio Rodriguez. Proficent in Next.JS. Open to work. Madrid, Spain. Contact within just 2 hours."/>
            <meta property="twitter:image" content="https://i.imgur.com/WeE5ZK2.png"/>
        </Head>
        <Header/>
            {children}
        <Contact/>
        <Footer/>
    </>
  )
}

export default Layout