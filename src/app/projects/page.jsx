import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
const page = () => {
    const projects = [
        {
            name: "local-ai",
            info: "Chat with your models locally and totally private",
            img: "/local-ai.png",
            href: "https://local-ai-five.vercel.app/"
        },
        {
            name: "Baitme",
            info: 'Test your thumbnails and get the best one for your video!',
            img: '/baitme.png',
            href: 'https://baitme.iamdelrio.com/'
        },
        {
            name: "CitySwipe",
            info: 'Find your perfect city to live in!',
            img: '/cityswipe.png',
            href: 'https://cityswipe.city'
        },
        {
            name: "DR.NEWS",
            info: 'All the latest info in your hand!',
            img: '/drnews.png',
            href: 'https://drnews.iamdelrio.com/'
        },
        {
            name: "my dog food",
            info: "Feed your dog properly",
            img: '/mydogfood.png',
            href: 'https://mydogfood.vercel.app/'
        },
        {
            name: "clyme",
            info: "You can't control weather, but you can predict it with Clyme!",
            img: '/clyme.png',
            href: 'https://clyme.vercel.app/'
        },

    ]
    return (
        <div className='mx-auto min-h-screen py-8 px-4 lg:px-16 flex flex-col gap-8 lg:gap-16'>
            <h1 className='uppercase text-5xl font-bold'>projects</h1>
            <section className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {projects.map(({ name, info, img, href }, i) => (
                    <a target="_blank" rel="noopener noreferrer" href={href} className='rounded-2xl relative group' key={i}>
                        <Image
                            src={img}
                            width={500}
                            height={500}
                            quality={80}
                            className=' w-full h-full rounded-2xl hover:blur transition-all duration-300 ease-in-out'
                        />
                        <h2 className='absolute top-0 left-0 p-4 uppercase font-bold text-4xl flex flex-col gap-2'>{name}
                            <span className='hidden group-hover:inline text-2xl lowercase'>{info}</span>
                        </h2>
                    </a>
                ))}
            </section>
        </div>
    )
}

export default page