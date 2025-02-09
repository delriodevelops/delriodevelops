import Image from 'next/image'
import Link from 'next/link'
import { FaFileDownload } from "react-icons/fa";
import { IoLogoLinkedin, IoLogoGithub,IoLogoYoutube  } from "react-icons/io5";
import Chat from '@/components/chat';

export default function Home() {
  return (
    <main className="min-h-screen text-white
      px-4 lg:px-8
      py-4 lg:py-8
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8
      ">

      {/* BIO */}
      <section className='bg-lime-400 w-full h-full rounded-2xl p-8 text-black 
        col-span-1 md:col-span-2 lg:col-span-3
        row-span-1 lg:row-span-2
        grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8
        lg:relative
        '>
        <div className='col-span-2'>
          <h1 className='font-extrabold pb-1 sm:mb-3 text-transparent text-5xl sm:text-6xl bg-clip-text bg-gradient-to-r from-[#000052] to-[#414375] uppercase'>iamdelrio</h1>
          <h3 className="text-[#051937] font-extrabold text-2xl sm:text-4xl mb-3 sm:mb-12 uppercase">full stack</h3>
          <article className='text-md sm:text-xl lg:text-2xl text-balance flex flex-col gap-4'>
            <p>
              Creating optimized technological solutions. Always up to date with the
              <span className='font-extrabold text-xl sm:text-3xl ml-2'>latest trends 👨‍💻🚀💡</span>
              , learning every day.
            </p>
            <p>
              Excited about the future of technology and its possibilities.
            </p>
            <p>
              <span className='font-extrabold text-xl sm:text-3xl'>
                Real-world experience 🤝💼📈
              </span>
              in the professional field, adding value through personal projects.
            </p>
            <p>
              Committed to continuous growth and the creation of
              <span className='font-extrabold text-xl sm:text-3xl ml-2'>impactful solutions 🌍📱✨.</span>
            </p>
          </article>
        </div>
        <Image
          data-tooltip-target="tooltip-hover"
          data-tooltip-trigger="hover"
          src="/me.png"
          width={1000}
          height={1000}
          className="hidden lg:inline scale-x-[-1] absolute right-0 w-2/5 bottom-0 rounded-l-2xl"
        />
      </section>

      {/* CHATBOT */}
      <section className='bg-[#2f2f2f]
        row-span-1 lg:row-span-2
        rounded-2xl p-4 text-white
        h-[700px]
        overflow-y-auto flex flex-col items-stretch
      '>
        <Chat />
      </section>

      {/* PROJECTS */}
      <Link className='bg-violet-500 
        col-span-1 lg:col-span-2
        lg:h-full aspect-square lg:aspect-auto uppercase
        contrast-125 opacity-50 hover:opacity-100 bg-no-repeat bg-cover bg-center bg-[url(/monk.gif)]
        rounded-2xl p-4 text-white
        flex flex-col justify-center items-center
        hover:scale-[105%] transition duration-300 ease-in-out text-center'
        href='/projects'
      >
        <h1 className='font-extrabold text-5xl sm:text-6xl'>my products</h1>
      </Link>

      {/* CURRICULUM VITAE */}
      <Link href="/cv" className='gap-8 text-black aspect-square col-span-1 row-span lg:h-full uppercase flex flex-col justify-center items-center rounded-2xl hover:bg-lime-500 bg-lime-400 cursor-pointer hover:scale-[105%] transition duration-300 ease-in-out'>
        <FaFileDownload className='text-[250px] ' />
        <h3 className='text-4xl font-bold text-center'>download cv</h3>
      </Link>


      {/* youtube */}
      <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@iamdelrio" className='aspect-square bg-red-900 hover:bg-red-800 rounded-2xl col-span-1 row-span lg:h-full uppercase flex flex-col justify-center items-center cursor-pointer hover:scale-[105%] transition duration-300 ease-in-out'>
        <IoLogoYoutube className='text-[300px]' />
      </a>

      {/* LINKEDIN */}
      <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/iamdelrio" className='aspect-square bg-blue-900 hover:bg-blue-800 rounded-2xl col-span-1 row-span lg:h-full uppercase flex flex-col justify-center items-center cursor-pointer hover:scale-[105%] transition duration-300 ease-in-out'>
        <IoLogoLinkedin className='text-[300px]' />
      </a>

      {/* GITHUB */}
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/delriodevelops" className='bg-neutral-900 hover:bg-neutral-800 aspect-square rounded-2xl col-span-1 row-span lg:h-full uppercase flex flex-col justify-center items-center cursor-pointer hover:scale-[105%] transition duration-300 ease-in-out'>
        <IoLogoGithub className='text-[300px]' />
      </a>

      {/* current location */}
      <section className='relative bg-neutral-800 aspect-square uppercase aspect-square rounded-2xl col-span-1 row-span lg:h-full uppercase flex flex-col justify-center items-center cursor-pointer'>
        <iframe width="100%" height="100%" className="absolute inset-0 rounded-2xl neutralscale-[40%]" title="map" src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=Madrid,Spain&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed"></iframe>
      </section>

      {/* discord */}
      {/* <section className='bg-violet-500 aspect-square'>
        discord
      </section> */}
    </main>
  )
}
