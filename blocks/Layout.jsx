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
        </Head>
        <Header/>
            {children}
        <Contact/>
        <Footer/>
    </>
  )
}

export default Layout