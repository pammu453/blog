import { Button, Select, TextInput, Spinner } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'
import RecentArticleCard from '../components/RecentArticleCard';


const Search = () => {
    const [sideBarData, setSideBarData] = useState({
        searchTerm: "",
        order: "desc",
        category: "uncategorized"
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const orderFromUrl = urlParams.get('order')
        const categoryFromUrl = urlParams.get('category')
        if (searchTermFromUrl || orderFromUrl || categoryFromUrl) {
            setSideBarData({
                ...sideBarData,
                searchTerm: searchTermFromUrl,
                order: orderFromUrl,
                category: categoryFromUrl
            })
        }

        const fetchPosts = async () => {
            setLoading(true)
            const serchQuery = urlParams.toString()
            try {
                const res = await fetch(`/api/post/getPosts?${serchQuery}`)
                const data = await res.json()
                if (!res.ok) {
                    setLoading(false)
                    return
                } else {
                    setPosts(data.posts)
                    setLoading(false)
                    if (data.posts.length < 9) {
                        setShowMore(false)
                    } else {
                        setShowMore(true)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts()
    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSideBarData({
                ...sideBarData,
                searchTerm: e.target.value
            })
        }
        if (e.target.id === 'order') {
            const order = e.target.value || 'desc'
            setSideBarData({
                ...sideBarData,
                order
            })
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized'
            setSideBarData({
                ...sideBarData,
                category
            })
        }
    }

    const handleSubmite = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', sideBarData.searchTerm)
        urlParams.set('order', sideBarData.order)
        urlParams.set('category', sideBarData.category)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    const handleShowMore = () => {
        const startIndex = posts.length
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const orderFromUrl = urlParams.get('order')
        const categoryFromUrl = urlParams.get('category')
        if (searchTermFromUrl || orderFromUrl || categoryFromUrl) {
            setSideBarData({
                ...sideBarData,
                searchTerm: searchTermFromUrl,
                order: orderFromUrl,
                category: categoryFromUrl
            })
        }

        const fetchPosts = async () => {
            setLoading(true)
            const serchQuery = urlParams.toString()
            try {
                const res = await fetch(`/api/post/getPosts?startIndex=${startIndex}/${serchQuery}`)
                const data = await res.json()
                if (!res.ok) {
                    setLoading(false)
                    return
                } else {
                    setPosts(posts.concat(data.posts));
                    setLoading(false)
                    if (data.posts.length < 9) {
                        setShowMore(false)
                    } else {
                        setShowMore(true)
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts()
    }

    return (
        <div>
            <div className='flex flex-col md:flex-row w-full'>
                <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500 dark:border-gray-600 min-w-72">
                    <form onSubmit={handleSubmite} className='flex flex-col gap-8'>
                        <div className="flex items-center gap-2 ">
                            <label className='whitespace-nowrap font-semibold'>Search Term :</label>
                            <TextInput placeholder='Serach...'
                                id='searchTerm'
                                type='text'
                                value={sideBarData.searchTerm || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className='font-semibold'>Sort :</label>
                            <Select onChange={handleChange}  id='order' value={sideBarData.order || ""}>
                                <option value="desc">Latest</option>
                                <option value="asc">Oldest</option>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className='font-semibold'>Category :</label>
                            <Select onChange={handleChange} id='category' value={sideBarData.category || ""}>
                                <option value={"uncategorized"}>Uncategorized</option>
                                <option value={"MERN/MEAN"}>MERN/MEAN</option>
                                <option value={"NodeJS"}>NodeJS</option>
                                <option value={"ExpressJS"}>ExpressJS</option>
                                <option value={"MongoDB"}>MongoDB</option>
                                <option value={"Javascipt"}>Javascipt</option>
                                <option value={"GitHub"}>GitHub</option>
                                <option value={"Python"}>Python</option>
                                <option value={"Backend"}>Backend</option>
                                <option value={"Frontend"}>Frontend</option>
                                <option value={"Database"}>Database</option>
                            </Select>
                        </div>
                        <Button type='submit' outline gradientDuoTone="purpleToPink">
                            Apply changes
                        </Button>
                    </form>
                </div>
                <div className="p-5 flex flex-wrap gap-8 w-full">
                    {loading ? (
                        <div className="w-full h-full flex justify-center items-center">
                            <Spinner size="lg"/>
                        </div>
                    ) : (
                        posts && posts.length === 0 ? (
                            <h1 className='text-2xl mt-4 ml-2'>No search result...</h1>
                        ) : (
                            <>
                                <div className='w-full'>
                                    <h1 className='text-2xl font-semibold py-2 border-b border-gray-500 dark:border-gray-600'>Posts results</h1>
                                </div>
                                {posts.map(post => (
                                    <RecentArticleCard key={post._id} cardPost={post} />
                                ))}
                            </>
                        )
                    )}
                </div>
            </div>
            {showMore && <span onClick={handleShowMore} className='text-teal-700 flex flex-col text-center hover:underline py-2 cursor-pointer'>Show more</span> }
        </div>
    )
}
export default Search
