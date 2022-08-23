import React from 'react'
import {FiGithub,FiExternalLink} from 'react-icons/fi'
const ProjectCard = ({project}) => {
    const {title,info,web,repo,icon}=project
  return (
    <div className="p-4 lg:w-1/2 flex md:w-full">
        <div className="flex border-2 rounded-lg border-gray-800 p-8 sm:flex-row flex-col">
          <div className="w-16 h-16 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-gray-800 text-blue-400 flex-shrink-0">
            {icon}
          </div>
          <div className="flex-grow">
            <h2 className="text-white text-lg title-font font-medium mb-3">{title}</h2>
            <p className="leading-relaxed text-base">{info}</p>
            <a href={web} target='_blank' rel='noreferrer noopener' className="mt-3 mr-4 text-blue-400 inline-flex items-center">
              <FiExternalLink fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24"/>
            </a>
            {!!repo && 
                <a href={repo} target='_blank' rel='noreferrer noopener' className="mt-3 text-blue-400 inline-flex items-center">
                    <FiGithub fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24"/>
                </a>
            }
          </div>
        </div>
      </div>
  )
}

export default ProjectCard