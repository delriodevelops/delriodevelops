import React from 'react'
import Link from 'next/link'

const Messages = () => {
  return (
    <>
    {!!user && 
        <Link href='/messages'>
            <a className="mr-5 hover:text-white">About</a>
        </Link>}
    </>
  )
}

export default Messages