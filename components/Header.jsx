import React from 'react'
import Link from 'next/link'
const Header = () => {
  return (
    <header className="text-gray-400 bg-gray-900 body-font">
        <div className="  container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <nav className="fixedNav md:ml-auto flex flex-wrap items-center text-base justify-center [&>a]:cursor-pointer">
                <Link href='/#about'>
                    <a className="mr-5 hover:text-white">About</a>
                </Link>
                <Link href='/projects'>
                    <a className="mr-5 hover:text-white">Projects</a>
                </Link>
                
                {/*
                <Link href='/blog'>
                    <a className="mr-5 hover:text-white">Blog</a>
                </Link>
                */}
            </nav>
            <button className="inline-flex items-center bg-blue-700 border-0 py-1 px-3 focus:outline-none hover:bg-blue-400 rounded text-white mt-4 md:mt-0">
                <Link href="#contact">
                    <a>Contact</a>
                </Link>
            </button>
        </div>
    </header>
  )
}

export default Header