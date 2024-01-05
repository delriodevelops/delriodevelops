'use client'
import React, { useEffect, useRef } from 'react'
import { IoGlobeOutline, IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";
function calculateTimeDifference(dateStartStr, dateEndStr) {
    // Convertir 'Feb 2023' a '1 Feb 2023'
    let dateStart = new Date('1 ' + dateStartStr);
    let dateEnd = new Date(dateEndStr || Date.now())

    let yearsDifference = dateEnd.getFullYear() - dateStart.getFullYear();
    let monthsDifference = dateEnd.getMonth() - dateStart.getMonth();

    // Ajustar los años y meses si es necesario
    if (monthsDifference < 0) {
        yearsDifference--;
        monthsDifference += 12;
    }

    return (!!yearsDifference ? yearsDifference + 'yrs ' : '') + (!!monthsDifference ? monthsDifference + ' mos' : '')
}

const page = () => {

    const downloadPDF = () => {
        const link = document.createElement('a');
        link.href = '/CV_CHRISTIAN_DELRIO_RODRIGUEZ.pdf'; // replace with the actual path to your PDF
        link.download = 'CV_CHRISTIAN_DELRIO_RODRIGUEZ.pdf'; // replace with your desired filename
        link.click();
        window.close();
    };
    useEffect(() => {
        downloadPDF()
    }, [])
    const experience = [
        {
            img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABEVBMVEX////GFDBQpd3vewGiEAdXZK3udAD4yKm62PBFodxUZa/KCSN2WphKo9yOwOfudwCbAACgAAD0gQCmERDBABRNqeD0pW56V5TEACilEAubAAe/AABWXqnym130oGXubwDBABr88fJ/VI/y9/zh7viozuzNSljAAAn55ObfZwf1295Tf8DnqrBRlND98vPps7hGV6epKibrzs3L4fPZnZ+wMzbQko+yPD5qsODb6/bowbnkoKb/5dO9JwD0jjzLQE/97+R4tuL61bu8OwnglJvILkF0d6zGSAnrfzrPUF73u5Okstbd4O1CUqWYocrxkEmHkMHN0eS9wdvwhCj859pqdbT1sIXTYGuETYd3LnXIu9AwfpqzAAAGRUlEQVR4nO3ZfXcTRRTH8d08bEhjmxKjBBuaVloSkbbB+sCTpYCAqBUUEfX9vxCzm4fdmbn3zkySdu+cc39/mz18zv2ybSSKZDKZTCaTyWQymUwmk8lkMplMJpPJZDKZTCaTyWQymUwmi6LR/W/W9qyD07U9an37dvv6/XU967R5bV2PWttG323Xatvfr+dhW01+wskBa5Nt76/hWQeVzQo34eiH7Vq2629Wf9hhs1LhJpwdMF333orPuv0gBfISLg6YLu6u1ulpc7PCTVg4YCrs3VnlYVszICOhcsBa7WYcr9DpQaVZqTATqgfMhPFw2U4PFz42Qu2AM2Fvuffp7BXDSqgfcCaMu4+XeNj8FcNIaB5wLlym063iAXkIgQMuhN7v08IrhosQPOBC6Nvpoe4rXwgfMBfGw5H7w9RXDAshdsCC0KNT7RXDQYgesCB071R/xZQvJA5YFMZdp04fGq+Y0oWPiAMqQqdOD8FCSxU2aGBB6NAp+IopWfjkRypRVWjt9Bp6wBKFZ/QFVWHvKfks5BVTrvA8+cJDSHf6jASWJXye3PQRUp0Cv8ZwEDbaL7yERKcWYGnC5CtLpqoQ7/SUrbBjOaImRDu1RVqesFql/ybqQqzTLeIHRdlCulNdiHXKWdh5QRENIdIpZ2G16nVDpFPeQqpTUxjvQZ3yFlKdAkLw+z5vIdUpJIQ65S7EO4WEUKfchXinoDDeMTrlLsQ7hYVmp/yFWKefgsJ476fghFiniNDolL+w2vG6odFpAEKkU0yodxqCEO4UFWqdhiCEO8WFaqdBCMFOcaHaaRjCzmuTSAjjnbuhCaGf+5Sw9zI8odkpJSx2GorQfJ+Swri76DQUodkpLcw7DUeod0oL807DEervU4swHt4NTaj/3LcJ550GJNQ6tQnnnYYkVDu1CmedhiRU36d24bTTsITFTu3CaadhCYudOgizTsMSFjt1EaadhibMO3URpp2GJsw7dRJOvkeFJsx/7rsJey+DEy46dRPG3VefhSacd+oobN1g/O/4dKeuwk82LEfkJ5x16i78miYyFE47dRf2j0ITTjt1F9Y3ghNmnXoI+2SnLIVppx7COtkpS2HaqY+Q7JSncNKpl7BOdMpU2HntJ+wfoUSmwmoH/nd8TEh0ylVY/dlPiL9PuQrbu/e6PkL8fcpWeCt62vMRop0yFo6GXkKsU8bC6LFDp7kQ65Sz0KXTgrBeB4/IWjja8RLCnbIWOnSq3BDslLfQ3qkiBDtlLrR2qgmBTtkKd6f/oa1TTQh0yl0Y3aE71YRAp+yFlk51ofk+ZS+0dGrc0PgexV9Id2oIjU4DEJK/n5pCvdMAhBH1PQq4ofY+DUFIdQoI6/XwhCP8iJBQ7TQIIdEpeEOl0zCEeKegUPm+H4gQ7RQWFn8/ZSv8XP0A1ikiLHQaihDrFBEW3qfBCJFOMWH+Pg1GiHSK3nDx+ylb4a7xGbBTVLjolK3QuGG0v+cnnHUakBDslBDOOg1JGL0xOyWEs06DEu6bRySFWadBCYFOSWHWaVhCs1NSmH3fD0y4r3/ftwgnnXIVJr/AHzzpegknv59uMhUOniCf1Dq1CCedNh9eqWw+m7D9HvvksXrE1g1a2D96cJWufBZhu3qOflR9n9qE45KAFuHA/KW0MKVTi/Di16sS6aOE7eQ5+Vnl5z4pHNd/uyKPOUJIHzBd8X1KCS9+vwoKMlRoO2C2Qqe4sF/iASNcOLh17PDpQqetLxFhqQeMMGE7abh9PO8UEfbrf1wuwDpQOHjrcsBsi05h4cW7y/zDOw0QOh8w3fEe8few3y/7gBEkHLw993nAyRC94fjd7Uv6U/tMF7YHHgfM9rGHCMd/Xsqf2HeacHB27vuE/RYo5HHASBO2B8hXJXLTTlXhBpMDRqow8T9gtqxTRTh+xeSAUVG43AHTZe/TovCCzQGjgjA5+2vph6Sd5sLxBz4HjBbC5Q+YbdLpQlje9yR4U2HyfvkDpjtuzYXMDhhNhe3B36s+5mQ4FXI7YJQJkzb2P5s89rE7EY4/lPo9CV4jWf2A6Y5b/2yU/T0JXiNZwwHTPfp3g+EBJ1uTb7L/1vYkmUwmk8lkMplMJpPJZDKZTCaTyWQymUwmk8lkMplMJpPJZDKZzLL/AbdU4t3VJ8u9AAAAAElFTkSuQmCC",
            company: 'Nfq Advisory, Solutions, Outsourcing',
            location: 'Madrid, Spain',
            contract: 'Full Time',
            remote: 'Hybrid',
            projects: [
                {
                    dateStart: 'Feb 2023',
                    name: 'Solutions',
                    title: 'Frontend Developer',
                    description: [
                        "• Integral in Solutions' B2B apps: TRAFIS, SZENA, ALQUID, NETZERO.",
                        "• Skilled in Vuetify for *internal component libraries.",
                        "• Expertise in *front-end tech*: Vue.js, Vuex, React.js, JavaScript, etc.",
                        "• Proficient in *Vue.js* and *React.js* for app development.",
                        "• Lead frontend logic and functionality, ensuring *deep application knowledge.",
                        "• Collaborative in design for *efficient, reusable components.",
                        "• Employ *separation of responsibilities* and *mixins* for *clear functionality.",
                        "• Committed to *clean*, *modular* code for *easy maintenance.",
                        "• Vue developer with a focus on advanced front-end skills and efficient component development."
                    ],
                    techs: [
                        "Firebase",
                        "Cloud Firestore",
                        "Vue Router",
                        "Mixins",
                        "Vue.js",
                        "Vuex",
                        "Node.js",
                        "Vuetify",
                        "React.js",
                        "JavaScript",
                        "Git",
                        "GitLab",
                        "HTML5",
                        "CSS3",
                        "SASS",
                    ]
                },
                {
                    dateStart: 'Jan 2022',
                    dateEnd: 'Feb 2023',
                    name: 'Graphenus',
                    title: 'Full Stack Developer',
                    description: [
                        "• Leveraged Angular for FrontEnd development, including *services*, *routing*, and *Angular Material.",
                        "• Managed *Backend* tasks including *routing*, *controller maintenance*, and *database/API integration.",
                        "• Ensured project *deployment* across *environments* and *version control* using Docker and Git/GitLab.",
                        "• Documented project processes and conventions for clarity and consistency.",
                        "• Facilitated user interaction on FrontEnd with clear information display and interactive input options.",
                    ],
                    techs: [
                        "PostgreSQL",
                        "TypeScript",
                        "Angular",
                        "MongoDB",
                        "REST API",
                        "JWT",
                        "HTML5",
                        "JavaScript",
                        "CSS3",
                        "Git",
                        "GitHub",
                        "ECMAScript",
                        "npm",
                        "Node.js",
                        "Express.js",
                    ]
                },
            ]
        },
    ]
    return (
        <article className='bg-gray-100 h-[200vh] w-fit p-4 text-black text-pretty mx-auto'>
            <section className='bg-lime-500 h-[150px] w-fit rounded-2xl flex mx-auto'>
                <img src="/me.png" alt="" className='w-[150px] rounded-l-2xl' />
                <div className='pl-4 pr-8 py-4 flex flex-col content-evenly'>
                    <h1 className='text-3xl font-bold'>Christian del Río Rodríguez</h1>
                    <h2 className='text-2xl'>Full Stack Developer</h2>
                    <div className='grid grid-cols-3 justify-items-center mt-4'>
                        <span className='flex items-center gap-2'><IoGlobeOutline /> iamdelrio.com</span>
                        <span className='flex items-center gap-2'><IoLogoLinkedin /> iamdelrio</span>
                        {/* <span className='flex items-center gap-2'><IoLogoInstagram /> iamdelrio</span> */}
                        <span className='flex items-center gap-2'><IoLogoGithub /> delriodevelops</span>
                    </div>
                </div>
            </section>
            <div className='grid grid-cols-4 my-8 gap-2'>
                <div className='col-span-1 flex flex-col gap-12'>
                    <section className='uppercase'>
                        <h3 className='text-lg font-bold bg-orange-300 px-4 w-fit rounded-full'>i speak</h3>
                        <ul className='mt-2 ml-2'>
                            <li>Spanish</li>
                            <li>English</li>
                        </ul>
                        {/* <p className='pl-2'>French</p> */}
                        {/* <p className='pl-2'>Japanese</p> */}
                    </section>
                    <section>
                        <h3 className='text-lg font-bold bg-orange-300 px-4 w-fit rounded-full uppercase'>i code</h3>
                        <ul className='mt-2 ml-2 uppercase'>
                            <li>JavaScript</li>
                            <li>react</li>
                            <li>next js</li>
                            <li>vue</li>
                            <li>Python</li>
                            <li>angular</li>
                            <li>tailwind</li>
                        </ul>
                    </section>
                    <section>
                        <h3 className='text-lg font-bold bg-orange-300 px-4 w-fit rounded-full uppercase'>i use</h3>
                        <ul className='mt-2 ml-2 uppercase'>
                            <li>git</li>
                            <li>github</li>
                            <li>gitlab</li>
                            <li>npm</li>
                            <li>node</li>
                            <li>bun</li>
                            <li>socket.io</li>
                            <li>postgres SQL</li>
                        </ul>
                    </section>
                    <section>
                        <h3 className='text-lg font-bold bg-orange-300 px-4 w-fit rounded-full uppercase'>my projects</h3>
                        <ul className='mt-2 ml-2 uppercase'>
                            <li>cityswipe.city</li>
                            <li><span className='text-sm bg-yellow-200 rounded-full px-2 lowercase'>wip</span> sortz </li>
                            <li><span className='text-sm bg-yellow-200 rounded-full px-2 lowercase'>wip</span> beba </li>
                            <li><span className='text-sm bg-yellow-200 rounded-full px-2 lowercase'>wip</span> ai assistant </li>
                        </ul>
                    </section>
                </div>
                <div className='col-span-3 grid max-w-[650px]'>
                    <section className='w-full'>
                        <h3 className='text-xl font-bold uppercase bg-violet-300 w-fit px-4 rounded-2xl'>about me</h3>
                        <p className='mt-2 text-pretty w-full ml-4'>
                            Experience in both professional and personal projects, focusing on <b className='bg-yellow-200 px-1 rounded'>emerging technologies</b> and <b className='bg-yellow-200 px-1 rounded'>modern web development</b>.<br />
                            I seek opportunities to <b className='bg-yellow-200 px-1 rounded'>grow</b> and <b className='bg-yellow-200 px-1 rounded'>learn</b> in the fields of <b className='bg-yellow-200 px-1 rounded'>programming</b> and <b className='bg-yellow-200 px-1 rounded'>AI</b>.
                        </p>
                    </section>
                    <section className='mt-6'>
                        <h3 className='text-xl font-bold uppercase bg-violet-300 w-fit px-4 rounded-2xl'>experience</h3>
                        <div className='ml-4 mt-4'>
                            {experience.map((company, i) => (
                                <div key={i} className='mb-10'>
                                    <div className='flex'>
                                        <img src={company.img} alt="" className='w-[50px] h-[50px] rounded-full border-2 border-gray-700' />
                                        <div className='pl-4'>
                                            <h4 className='text-lg font-bold'>{company.company}</h4>
                                            <h5 className='text-md text-gray-700'>{company.contract} - {calculateTimeDifference(company.projects.at(-1).dateStart, company.projects[0].dateEnd || undefined)} - {company.remote}</h5>
                                        </div>
                                    </div>
                                    <ul className='mt-8 ml-4'>
                                        {company.projects.map((project, i) => (
                                            <li key={i} className='relative border-l-2 border-gray-700 pl-6'>
                                                <span className='absolute -left-3 top-0 w-6 h-6 bg-lime-500 rounded-full border-2 border-gray-700'></span>
                                                <h5 className='text-md font-bold'>{project.title} — {project.name}</h5>
                                                <p className='text-gray-700'>{project.dateStart} - {project.dateEnd || 'Present'} · {calculateTimeDifference(project.dateStart, project.dateEnd || undefined)}</p>
                                                <p className='text-md grid gap-2 mt-4'>
                                                    {
                                                        project.description.map((paragraph, i) => (<span key={i} className='text-pretty'>{
                                                            paragraph.split('*').map((text, i) => (
                                                                <span key={i} className={`${i % 2 != 0 && 'bg-blue-100 font-bold px-1 rounded'}`}>{text}</span>
                                                            ))
                                                        }</span>))
                                                    }
                                                </p>
                                                <p className={`${i !== company.projects.length - 1 && 'pb-12'} pt-6 grid`}>
                                                    <span className='bg-lime-300 rounded-full p-2 w-fit font-bold text-sm uppercase'>Technologies </span>
                                                    <span className='ml-2 mt-1'>
                                                        {
                                                            project?.techs?.map((tech, i) => (
                                                                <span key={i} className='text-sm'>{tech}{i !== project.techs.length - 1 ? ' · ' : ''}</span>
                                                            ))
                                                        }
                                                    </span>
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </article>
    )
}

export default page