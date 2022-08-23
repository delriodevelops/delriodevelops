import Head from 'next/head'
import Image from 'next/image'
import { useContext } from 'react'
import styles from '../styles/Home.module.css'
import {GlobalContext} from '../context/GlobalContext'
import About from '../blocks/About'
import Hero from '../components/Hero'

export default function Home() {
  
  const {nia}=useContext(GlobalContext)
  return (
    <>
      <Hero/>
      <About/>
    </>
    )
}
