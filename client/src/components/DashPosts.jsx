import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner, Avatar, Button, Modal } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashPosts = () => {
  const { currentUser } = useSelector(state => state.user)
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [postId, setpostId] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`)
        const data = await res.json()
        if (res.ok) {
          setLoading(false)
          setUserPosts(data.posts)
          if (data.posts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    getPosts()
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      setLoading(true)
      const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok) {
        setLoading(false)
        setUserPosts((prev) => [...prev, ...data.posts])
        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const deletePost = async () => {
    setOpenModal(false)
    try {
      const res = await fetch(`/api/post/deletePost/${postId}/${currentUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": 'application/json' },
        credentials: "include"
      })
      setUserPosts(userPosts.filter((post) => post._id !== postId))
      const data = await res.json()
      if (data.success === false) {
        console.log(data.message)
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="table-auto overflow-x-auto p-2 w-full">
      {
        userPosts.length > 0 ? (
          <>
            <Table>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Image</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>Edit</Table.HeadCell>
              </Table.Head>
              {
                userPosts && userPosts.map((post) => (
                  <Table.Body key={post._id} className="divide-y p-2">
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {(post.updatedAt)?.substring(0, 10)}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <Avatar img={post.image} bordered size="md" className='float-start' />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`} className='text-nowrap'>
                          {post.title.length > 10 ? post.title.substring(0, 10) + "..." : post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell onClick={() => {
                        setOpenModal(true)
                        setpostId(post._id)
                      }} className='text-red-600 hover:underline cursor-pointer'>Delete</Table.Cell>
                      <Table.Cell>
                        <Link to={`/update-post/${post._id}`} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                          Edit
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))
              }
            </Table >
            {
              showMore && (
                <span onClick={handleShowMore} className='text-teal-500 flex justify-center mt-2 hover:cursor-pointer'>
                  Show more
                </span>
              )
            }
          </>
        ) : (
          <p className='text-center mt-10' hidden={loading}>You don't have the posts now </p>
        )
      }
      {loading &&
        <div className="text-center w-full mt-5">
          <Spinner aria-label="Center-aligned spinner Extra large example" size="xl" />
        </div>
      }

      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => deletePost()}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div >
  )
}

export default DashPosts
