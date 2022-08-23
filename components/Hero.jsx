import React from 'react'
import Link from 'next/link'
const Hero = () => {
  return (
<section className="text-white bg-gray-900">
  <div className="max-w-screen-xl px-4 py-32 mx-auto lg:h-screen lg:items-center lg:flex">
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-3xl font-extrabold text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
          Full Stack Developer
        <span className="sm:block">
        Christian del Rio Rodriguez
        </span>
      </h1>

      <p className="max-w-xl mx-auto mt-4 sm:leading-relaxed sm:text-xl">
          <span className='hoverSpan'>Proficent in Next.JS</span>
          <span className='hoverSpan'>and open to work remote and/or presential.</span>
        <br/>
        <span className='hoverSpan'>Based in Madrid, Spain.</span>
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Link href="#contact" >
          <a className="block w-full px-12 py-3 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded sm:w-auto active:text-opacity-75 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring" >
            Contact
          </a>
        </Link>

        <Link href="#about">
          <a className="block w-full px-12 py-3 text-sm font-medium text-white border border-gray-600 rounded sm:w-auto hover:bg-gray-500 active:bg-gray-500 focus:outline-none focus:ring" >
            About
          </a>
        </Link>
      </div>
    </div>
  </div>
</section>

  )
}

export default Hero