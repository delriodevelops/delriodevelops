import React, { useEffect, useState } from 'react'
import PostPreview from '../components/PostPreview'


const Blog = () => {
  const [posts,setPosts]=useState([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    fetch('api/blog')
    .then(res=>res.json())
    .then(data=>setPosts(data))
    setLoading(false)
  },[])

  console.log(posts)

  
  if(!loading) {
    return (
    <section className="text-gray-400 bg-gray-900 body-font overflow-hidden">
    <div className="container px-5 py-24 mx-auto">
      <div className="-my-8 divide-y-2 divide-gray-800">
        {posts.map(post=>
          <PostPreview post={post} key={post._id}/>
        )}
      </div>
    </div>
  </section>
  )}
}

export default Blog