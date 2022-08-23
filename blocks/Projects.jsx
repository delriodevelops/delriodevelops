import React from 'react'
import ProjectCard from '../components/ProjectCard'
import projects from '../pages/projects'
import {TiWeatherPartlySunny} from 'react-icons/ti'
import {BsNewspaper}from 'react-icons/bs'
import {FaDog,FaPalette} from 'react-icons/fa'
import {SiNextdotjs}from 'react-icons/si'
import Link from 'next/link'



const Projects = () => {
    const projects= [
        {
            title:'CLYME',
            info: 'A PWA that gives you the weather (actual or in future days) based on your current location or a City, State of your choice, It contains temperature, humidity, wind rainfall, air quality, UV Index and many more...',
            icon: <TiWeatherPartlySunny/>,
            repo: 'https://github.com/delriodevelops/clyme',
            web: 'https://clyme.vercel.app/'
        },
        {
            title: 'DR.NEWS',
            info: 'Simple but complete PWA where you can read the latests news, search for concrete articles, or by more than 30 categories. All these content provided by The New York Times API.',
            icon: <BsNewspaper/>,
            repo:'https://github.com/delriodevelops/drnews',
            web:'https://drnews.vercel.app/'
        },
        {
            title:'MyDogFood',
            info: 'Have you ever asked yourself "Can I order a pizza for my dog? Is it toxic for him?" we wont question the way you feed your dog, but we can provide you some information. This page tells you every detail of some food and how it will affect your dog.',
            icon: <FaDog/>,
            repo: 'https://github.com/delriodevelops/mydogfood',
            web: 'https://delriodevelops.github.io/mydogfood/'
        },
        {
            title: ' Color Picker',
            info:'This color picker has simple tools like generate random colors, hex code and copy to clipboard just by pressing on the color. This project was part of a BBVA hackaton challenge.',
            icon:<FaPalette/>,
            repo:'https://github.com/delriodevelops/colorpicker',
            web:'https://delriodevelops.github.io/colorpicker/'
        },
        {
            title: 'itslachowski.com',
            info: "Make-up artist/lifestyle TikTok and Instagram influencer lachowski_tutorials' webpage; where you can send messages to contact her to book various services. This webpage has fast performance and has been made with tailwind.",  
            icon:<SiNextdotjs/>,
            web: 'https://itslachowski.com/'
        }
    ]
    
  return (
<section className="text-gray-400 bg-gray-900 body-font pb-24">
  <div className="container px-5 py-24 mx-auto flex flex-wrap">
    <div className="flex flex-wrap -m-4">
    {projects.map(project=>
        <ProjectCard key={project.title} project={project}/>
    )}
    </div>
  </div>
    <Link href="#contact">
      <a >
        <button className="flex mx-auto mt-20 text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg items-center gap-2">Get in touch!</button>
      </a>
    </Link>
</section>
  )
}

export default Projects