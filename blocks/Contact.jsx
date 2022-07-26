import React, { useState } from 'react'
import sendMessage from '../services/sendMessage'
import Alert from '../components/Alert'
const Contact = () => {
  const [email,setEmail]=useState('')
  const [message,setMessage]=useState('')
  const [alert,setAlert]=useState(false)

  function handleSubmit(e){
    e.preventDefault()
    sendMessage(email,message)
    setEmail('')
    setMessage('')
    setAlert(true)
  }


  return (
  <>
      {!!alert && <Alert setAlert={setAlert}>Message was succesfully sent. MAKE SURE to check your SPAM INBOX my response could be redirected there.</Alert>}
    <section id='contact' className="text-gray-400 bg-gray-900 body-font relative">
      <div className="absolute inset-0 bg-gray-900">
        <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=es&amp;q=madrid+(Mi%20nombre%20de%20egocios)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" style={{filter: "grayscale(1) contrast(1.2) opacity(0.16)"}}/>
      </div>
      <form onSubmit={(e)=>{handleSubmit(e)}} className="container px-5 py-24 mx-auto flex">
        <div className="lg:w-1/3 md:w-1/2 bg-gray-900 shadow-md rounded-lg p-8 flex flex-col md:ml-auto  mt-10 md:mt-0 relative z-10">
          <h2 className="text-white text-lg mb-1 font-medium title-font">Contact</h2>
          <p className="leading-relaxed mb-5">Send me your proposal and I will get in touch with you as soon as possible (2-24 hours).</p>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-400">Email</label>
            <input required value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" id="email" name="email" className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
          </div>
          <div className="relative mb-4">
            <label htmlFor="message" className="leading-7 text-sm text-gray-400">Message</label>
            <textarea required value={message} onChange={(e)=>{setMessage(e.target.value)}} id="message" name="message" className="w-full bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"/>
          </div>
          <input type="submit" value='Send' className="text-white cursor-pointer bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-500 rounded text-lg"/>
          <p className="text-xs text-gray-400 text-opacity-90 mt-3">
            You can also contact me via social media: 
            <a href="https://www.linkedin.com/in/iamdelrio" target="_blank" rel="noopener noreferrer" className='text-blue-500'> LinkedIn</a>, 
            <a href="https://www.instagram.com/iamdelrio" target="_blank" rel="noopener noreferrer" className='text-blue-500'> Instagram</a><br/>Or you can email me at 
            <a href='mailto:contact@iamdelrio.com' title='contact@iamdelrio.com' className='text-blue-500'> contact@iamdelrio.com</a>
          </p>
        </div>
      </form>
    </section>
  </>
  )
}

export default Contact