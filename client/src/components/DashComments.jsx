import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner, Avatar, Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

const DashComments = () => {
    const { currentUser } = useSelector(state => state.user)
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [commentId, setCommentId] = useState("");

    useEffect(() => {
        const getComments = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/comment/getComments`)
                const data = await res.json()
                if (res.ok) {
                    setLoading(false)
                    setComments(data.comments)
                    if (data.comments.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        getComments()
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = comments.length
        try {
            setLoading(true)
            const res = await fetch(`/api/comment/getComments?startIndex=${startIndex}`)
            const data = await res.json()
            if (res.ok) {
                setLoading(false)
                setComments((prev) => [...prev, ...data.comments])
                if (data.comments.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const deleteComment = async () => {
        setOpenModal(false)
        try {
            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: "DELETE",
                headers: { "Content-Type": 'application/json' },
                credentials: "include"
            })
            setComments(comments.filter((comment) => comment._id !== commentId))
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
                comments.length > 0 ? (
                    <>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Comment Content</Table.HeadCell>
                                <Table.HeadCell>Number of likes</Table.HeadCell>
                                <Table.HeadCell>PostId</Table.HeadCell>
                                <Table.HeadCell>UserId</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            {
                                comments && comments.map((comment) => (
                                    <Table.Body key={comment._id} className="divide-y p-2">
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {(comment.updatedAt)?.substring(0, 10)}
                                            </Table.Cell>
                                            <Table.Cell>{comment.content}</Table.Cell>
                                            <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                            <Table.Cell>{comment.postId}</Table.Cell>
                                            <Table.Cell>{comment.userId}</Table.Cell>
                                            <Table.Cell onClick={() => {
                                                setOpenModal(true)
                                                setCommentId(comment._id)
                                            }} className='text-red-600 hover:underline cursor-pointer'>Delete</Table.Cell>
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
                    <p className='text-center mt-10' hidden={loading}>You don't have the comments now </p>
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
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => deleteComment()}>
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

export default DashComments
