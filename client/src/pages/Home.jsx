import { Link } from 'react-router-dom'
import { Carousel } from 'flowbite-react'
import { useEffect, useState } from 'react'

const Home = () => {
  const [newPosts, setNewPosts] = useState([]);

  useEffect(() => {
    const latestBlogs = async () => {
      const res = await fetch("/api/post/getPosts?limit=5")
      const data = await res.json()
      if (res.ok) {
        setNewPosts(data.posts)
      }
    }
    latestBlogs()
  }, [])
  return (
    <div className='mt-6 md:mt-0'>
      <div className="flex flex-col gap-6 p-3 lg:p-10 max-w-6xl mx-auto">
        <h1 className="text-3xl text-center md:text-left font-bold lg:text-6xl">Welcome to Pramod's blog</h1>
        <p className="text-gray-500 text-center md:text-left text-xs sm:text-sm">"Where curiosity meets content. Explore diverse topics, engage in lively discussions, and embark on a journey of discovery with us. Join our community and let the adventure begin."</p>
        <span className='text-center md:text-left'>
          <Link to="/search" className='text-teal-500  hover:underline'>View all blogs</Link>
        </span>
      </div>
      <div className="flex flex-col gap-6 p-3 lg:p-10 max-w-6xl mx-auto mt-0 h-56 sm:h-72 md:max-h-fit 2xl:h-96  mx-w-6xl mb-20">
        <Carousel pauseOnHover>
          {
            newPosts.map((post) => (
              <div className="w-full h-full"  key={post._id}>
                <Link to={`/post/${post.slug}`}>
                  <img src={post.image} alt={post.title} className='object-cover w-full h-full' />
                </Link>
              </div>
            ))
          }
        </Carousel>
      </div>
    </div>
  )
}

export default Home
