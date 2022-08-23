import Image from 'next/image'
import pfp from '../assets/img/pfp.jpg'
import React from 'react'
import Link from 'next/link'
import { FiUser,FiMonitor,FiServer} from 'react-icons/fi'
import {BsCodeSlash} from 'react-icons/bs'

const About = () => {
  return (
<section id="about" className="text-gray-400 bg-gray-900 body-font">
  <div className="container px-5 py-24 mx-auto">
    <div className=" flex  items-center lg:w-3/5 text-left mx-auto border-b pb-10 mb-10 border-gray-800 sm:flex-row flex-col">
      <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full text-blue-400 bg-gray-800 flex-shrink-0">
        <FiUser fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="sm:w-16 sm:h-16 w-10 h-10" />
      </div>
      <div className="flex-grow mt-6 text-left sm:mt-0">
        <h2 className="text-white text-lg title-font font-medium mb-2">WHO AM I?</h2>
        <p className="leading-relaxed text-base">
          <span className='hoverSpan'>My interest in web development started when</span>
          <span className='hoverSpan'>I finished my exams</span>
          <span className='hoverSpan'>and from the very first Hello World!</span>
          <span className='hoverSpan'>I am fascinated with programming.</span>
        <br/>
          <span className='hoverSpan'>Since then,</span>
          <span className='hoverSpan'>I have wanted to make web development</span>
          <span className='hoverSpan'>a way of making a living.</span>
        </p>
      </div>
    </div>
    <div className="flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-gray-800 sm:flex-row flex-col">
      <div className="flex-grow mt-6 text-right sm:mt-0">
        <h2 className="text-white text-lg title-font font-medium mb-2">FRONTEND</h2>
        <p className="leading-relaxed text-base">
          <span className='hoverSpan'>I have been working on</span>
          <span className='hoverSpan'>some personal projects using</span>
          <span className='hoverSpan'>the most proficient technologies in the moment</span>
          <span className='hoverSpan'>such as</span>
          <span className='hoverSpan'>React,</span>
          <span className='hoverSpan'>Next,</span>
          <span className='hoverSpan'>JavaScript EM6+,</span>
          <span className='hoverSpan'>NodeJS,</span>
          <span className='hoverSpan'>CSS</span>
          <span className='hoverSpan'>or HTML.</span>
        </p>
      </div>
      <div className="sm:w-32 order-first sm:order-none sm:h-32 h-20 w-20 sm:ml-10 inline-flex items-center justify-center rounded-full text-blue-400 bg-gray-800 flex-shrink-0">
        <FiMonitor fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24"/>
      </div>
    </div>
    <div className=" flex  items-center lg:w-3/5 text-left mx-auto border-b pb-10 mb-10 border-gray-800 sm:flex-row flex-col">
      <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full text-blue-400 bg-gray-800 flex-shrink-0">
        <FiServer fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="sm:w-16 sm:h-16 w-10 h-10" viewBox="0 0 24 24"/>
      </div>
      <div className="flex-grow mt-6 text-left sm:mt-0">
        <h2 className="text-white text-lg title-font font-medium mb-2">BACKEND</h2>
        <p className="leading-relaxed text-base">
          <span className='hoverSpan'>At the same time,</span>
          <span className='hoverSpan'>I have been working</span>
          <span className='hoverSpan'>in the backend</span>
          <span className='hoverSpan'>with</span>
          <span className='hoverSpan'>Express,</span>
          <span className='hoverSpan'>MongoDB,</span>
          <span className='hoverSpan'>REST API creation,</span>
          <span className='hoverSpan'>mongoose,</span>
          <span className='hoverSpan'>BCrypt,</span>
          <span className='hoverSpan'>JSONWebToken,</span>
          <span className='hoverSpan'>etc...</span>
        </p>
      </div>
    </div>
    <Link href="/projects">
      <a >
        <button className="flex mx-auto mt-20 text-white bg-blue-600 border-0 py-2 px-8 focus:outline-none hover:bg-blue-500 rounded text-lg items-center gap-2">See my work</button>
      </a>
    </Link>
  </div>
</section>
  )
}

export default About