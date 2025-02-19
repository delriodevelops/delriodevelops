'use client'
import React, { useEffect, useRef } from 'react'
import { IoGlobeOutline, IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";

function calculateTimeDifference(dateStartStr, dateEndStr) {
    let dateStart = new Date('1 ' + dateStartStr);
    let dateEnd = new Date(dateEndStr || Date.now())

    let yearsDifference = dateEnd.getFullYear() - dateStart.getFullYear();
    let monthsDifference = dateEnd.getMonth() - dateStart.getMonth();

    if (monthsDifference < 0) {
        yearsDifference--;
        monthsDifference += 12;
    }

    return (!!yearsDifference ? yearsDifference + 'años ' : '') + (!!monthsDifference ? monthsDifference + ' meses' : '')
}

const page = () => {

    const downloadPDF = () => {
        const link = document.createElement('a');
        link.href = '/CV_CHRISTIAN_DELRIO_RODRIGUEZ_ES.pdf';
        link.download = 'CV_CHRISTIAN_DELRIO_RODRIGUEZ_ES.pdf';
        link.click();
        window.close();
    };

    useEffect(() => {
        downloadPDF()
    }, [])

    const experience = [
        {
            img: "data:image/png;base64,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",
            company: 'Nfq Advisory, Solutions, Outsourcing',
            location: 'Madrid, España',
            contract: 'Jornada Completa',
            remote: 'Híbrido',
            projects: [
                {
                    dateStart: 'Feb 2024',
                    dateEnd: 'Feb 2025',
                    name: 'Permira - GAIA',
                    title: 'Desarrollador Frontend',
                    description: [
                        "• Implementé Next.js con renderizado del lado del servidor, mejorando velocidad en entornos virtualizados y experiencia de usuario en dispositivos de bajos recursos",
                        "• Rediseñé la interfaz usando Tailwind y Zustand, optimizando navegación y accesibilidad",
                        "• Base de conocimiento vectorial para búsqueda en documentos confidenciales, chat con soporte de imágenes/documents, visor PDF con resúmenes, etc.",
                        "• Integré Okta SDK para autenticación segura y protección de datos",
                        "• Contribuí a optimizaciones en Python asegurando integración frontend-backend",
                        "• Colaboración ágil con cliente en UK mediante sprints, dailys y retrospectivas"
                    ],
                    techs: [
                        "Zustand",
                        "NextJS",
                        "React",
                        "Python",
                        "Tailwind",
                        "Node.js",
                        "Okta",
                        "JavaScript",
                        "Git",
                        "GitLab",
                        "HTML5",
                        "CSS3",
                    ]
                },
                {
                    dateStart: 'Feb 2023',
                    dateEnd: 'Feb 2024',
                    name: 'Solutions',
                    title: 'Desarrollador Frontend',
                    description: [
                        "• Desarrollo de aplicaciones B2B: TRAFIS, SZENA, ALQUID, NETZERO",
                        "• Creación de bibliotecas de componentes internos con Vuetify",
                        "• Desarrollo con Vue.js y React.js implementando lógica frontend compleja",
                        "• Colaboración en diseño de componentes reutilizables y eficientes",
                        "• Implementación de mixins y separación de responsabilidades",
                        "• Mantenimiento de código limpio y modular"
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
                    dateStart: 'Ene 2022',
                    dateEnd: 'Feb 2023',
                    name: 'Graphenus',
                    title: 'Desarrollador Full Stack',
                    description: [
                        "• Desarrollo Frontend con Angular (servicios, routing, Angular Material)",
                        "• Gestión Backend: routing, mantenimiento de controladores e integración DB/API",
                        "• Implementación de despliegues con Docker y control de versiones Git/GitLab",
                        "• Documentación técnica de procesos y convenciones",
                        "• Implementación de interacción de usuario clara e intuitiva"
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
        <article className='bg-neutral-100 h-[200vh] w-fit p-4 text-black text-pretty mx-auto'>
            <section className='bg-lime-500 h-[150px] w-fit rounded-2xl flex mx-auto'>
                <img src="/me.png" alt="" className='w-[150px] rounded-l-2xl' />
                <div className='pl-4 pr-8 py-4 flex flex-col content-evenly'>
                    <h1 className='text-3xl font-bold'>Christian del Río Rodríguez</h1>
                    <h2 className='text-2xl'>Desarrollador Full Stack</h2>
                    <div className='grid grid-cols-3 justify-items-center mt-4'>
                        <a href='https://iamdelrio.com' className='flex items-center gap-2'><IoGlobeOutline /> iamdelrio.com</a>
                        <a href='https://www.linkedin.com/in/iamdelrio' className='flex items-center gap-2'><IoLogoLinkedin /> iamdelrio</a>
                        <a href='https://github.com/delriodevelops' className='flex items-center gap-2'><IoLogoGithub /> delriodevelops</a>
                    </div>
                </div>
            </section>
            <div className='grid grid-cols-4 my-8 gap-2'>
                <div className='col-span-1 flex flex-col gap-12'>
                    <section className='uppercase'>
                        <h3 className='text-lg font-bold bg-orange-300 px-4 w-fit rounded-full'>Hablo</h3>
                        <ul className='mt-2 ml-2'>
                            <li>Español</li>
                            <li>Inglés</li>
                        </ul>
                    </section>
                    <section>
                        <h3 className='text-lg font-bold bg-orange-300 px-4 w-fit rounded-full uppercase'>Programo en</h3>
                        <ul className='mt-2 ml-2 uppercase'>
                            <li>JavaScript</li>
                            <li>React</li>
                            <li>Next JS</li>
                            <li>Vue</li>
                            <li>Python</li>
                            <li>Angular</li>
                            <li>Tailwind</li>
                        </ul>
                    </section>
                    <section>
                        <h3 className='text-lg font-bold bg-orange-300 px-4 w-fit rounded-full uppercase'>Uso</h3>
                        <ul className='mt-2 ml-2 uppercase'>
                            <li>Git</li>
                            <li>GitHub</li>
                            <li>GitLab</li>
                            <li>npm</li>
                            <li>node</li>
                            <li>bun</li>
                            <li>socket.io</li>
                            <li>postgres SQL</li>
                        </ul>
                    </section>
                    <section>
                        <h3 className='text-lg font-bold bg-orange-300 px-4 w-fit rounded-full uppercase'>Mis productos</h3>
                        <ul className='mt-2 ml-2 uppercase'>
                            <li><a href="https://meshmind.vercel.app">meshmind</a></li>
                            <li><a href="https://escudolealjpt.com">escudo leal jpt</a></li>
                            <li><a href="https://baitme.iamdelrio.com/">baitme</a></li>
                            <li><span className='text-sm bg-yellow-200 rounded-full px-2 lowercase'>en desarrollo</span> gestor de viajes</li>
                        </ul>
                    </section>
                </div>
                <div className='col-span-3 grid max-w-[650px]'>
                    <section className='w-full'>
                        <h3 className='text-xl font-bold uppercase bg-violet-300 w-fit px-4 rounded-2xl'>Sobre mí</h3>
                        <p className='mt-2 text-pretty w-full ml-4'>
                            Experiencia en proyectos profesionales y personales, enfocado en <b className='bg-yellow-200 px-1 rounded'>tecnologías emergentes</b> y <b className='bg-yellow-200 px-1 rounded'>desarrollo web moderno</b>.<br />
                            Busco oportunidades para <b className='bg-yellow-200 px-1 rounded'>crecer</b> y <b className='bg-yellow-200 px-1 rounded'>aprender</b> en los campos de <b className='bg-yellow-200 px-1 rounded'>programación</b> y <b className='bg-yellow-200 px-1 rounded'>IA</b>.
                        </p>
                    </section>
                    <section className='mt-6'>
                        <h3 className='text-xl font-bold uppercase bg-violet-300 w-fit px-4 rounded-2xl'>Experiencia</h3>
                        <div className='ml-4 mt-4'>
                            {experience.map((company, i) => (
                                <div key={i} className='mb-10'>
                                    <div className='flex'>
                                        <img src={company.img} alt="" className='w-[50px] h-[50px] rounded-full border-2 border-neutral-700' />
                                        <div className='pl-4'>
                                            <h4 className='text-lg font-bold'>{company.company}</h4>
                                            <h5 className='text-md text-neutral-700'>{company.contract} - {calculateTimeDifference(company.projects.at(-1).dateStart, company.projects[0].dateEnd || undefined)} - {company.remote}</h5>
                                        </div>
                                    </div>
                                    <ul className='mt-8 ml-4'>
                                        {company.projects.map((project, i) => (
                                            <li key={i} className='relative border-l-2 border-neutral-700 pl-6'>
                                                <span className='absolute -left-3 top-0 w-6 h-6 bg-lime-500 rounded-full border-2 border-neutral-700'></span>
                                                <h5 className='text-md font-bold'>{project.title} — {project.name}</h5>
                                                <p className='text-neutral-700'>{project.dateStart} - {project.dateEnd || 'Actualidad'} · {calculateTimeDifference(project.dateStart, project.dateEnd || undefined)}</p>
                                                <p className='text-md grid gap-2 mt-4'>
                                                    {project.description.map((paragraph, i) => (
                                                        <span key={i}>{paragraph}</span>
                                                    ))}
                                                </p>
                                                <p className={`${i !== company.projects.length - 1 && 'pb-12'} pt-6 grid`}>
                                                    <span className='bg-lime-300 rounded-full p-2 w-fit font-bold text-sm uppercase'>Tecnologías</span>
                                                    <span className='ml-2 mt-1'>
                                                        {project.techs.join(' · ')}
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