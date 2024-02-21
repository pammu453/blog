import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader';
import { Button } from 'flowbite-react';
import CommentSction from '../components/CommentSction';
import RecentArticleCard from '../components/RecentArticleCard';

const PostPage = () => {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);

    useEffect(() => {
        const getPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getPosts?slug=${postSlug}`)
                const data = await res.json()
                if (!res.ok) {
                    setError(true)
                    setLoading(false)
                    return
                } else {
                    setPost(data.posts[0])
                    setLoading(false)
                    setError(false)
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        getPost()
    }, [postSlug])

    useEffect(() => {
        const getPost = async () => {
            try {
                const fetchRecentPosts = await fetch(`/api/post/getPosts?limit=2`)
                const data = await fetchRecentPosts.json()
                if (fetchRecentPosts.ok) {
                    setRecentPosts(data.posts)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getPost()
    }, [])

    if (loading) return <Loader />
    if (error) return <h2 className='text-3xl flex justify-center items-center font-serif max-w-2xl mx-auto lg:text-4xl  min-h-screen'>Unable to load the blog</h2>

    return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        {post && (
            <>
                <div>
                    <h1 className='text-3xl mt-10 p-3 text-center italic max-w-2xl mx-auto lg:text-4xl'>{post.title}</h1>
                    <Link to={`/search?category=${post.category}`} className=' flex justify-center mt-5'>
                        <Button className='gray' pill size="xs">{post.category}</Button>
                    </Link>
                    <img src={post.image} alt={post.title} className='mt-10 p-3 max-h-[400px] w-full object-cover' />
                    <div className='flex justify-between p-3 border-b border-slate-500 w-full text-sm mx-auto '>
                        <span>{post.updatedAt.substring(0, 10)}</span>
                        <span className='italic'>{(post.content.length / 1000).toFixed(0)} mins read</span>
                    </div>
                    <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                    <p className='italic flex justify-center w-full text-center mt-1'>End of blog</p>
                    <div className='flex justify-between p-3 border-b border-slate-500 w-full text-sm mx-auto max-w-2xl'></div>
                    <CommentSction postId={post._id} />
                    <div className="flex flex-col justify-center items-center mb-5">
                        <h1 className="text-xl mt-5">Recent Articles</h1>
                        <div className="flex flex-wrap gap-3 mt-5 justify-center">
                            {
                                recentPosts && recentPosts.map((post) => (
                                    <RecentArticleCard cardPost={post} key={post._id} />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </>
        )}
    </main>
}

export default PostPage
