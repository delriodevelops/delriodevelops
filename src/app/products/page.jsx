import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
const page = () => {
  const products = [
    {
      name: "meshmind",
      info: "Create your custom chain of thought",
      img: "/meshmind.png",
      href: "https://meshmind.vercel.app/"
    },
    {
      name: "Escudo Leal JPT",
      info: "Landing page of Escudo Leal JPT",
      img: "/escudo-leal-jpt.png",
      href: "https://www.escudolealjpt.com"
    },
    {
      name: "Baitme",
      info: 'Test your thumbnails and get the best one for your video!',
      img: '/baitme.png',
      href: 'https://baitme.iamdelrio.com/'
    },
  ]
  return (
    <div className='mx-auto min-h-screen py-8 px-4 lg:px-16 flex flex-col gap-8 lg:gap-16'>
      <h1 className='uppercase text-5xl font-bold'>products</h1>
      <p className='text-neutral-400'>These are complete products. With more complexity and adding unique value to the user.</p>
      <div className='text-2xl p-2 gap-3 bg-neutral-900 uppercase rounded-xl flex w-fit'>
        <Link href="/products" className='rounded-xl bg-neutral-700 p-3'>products</Link>
        <Link href="/projects" className='rounded-xl p-3 hover:bg-neutral-800'>projects</Link>
      </div>
      <section className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {products.map(({ name, info, img, href }, i) => (
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