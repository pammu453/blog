import { Alert, Button, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comment from './Comment'

const CommentSction = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState(false);
    const [comments, setComments] = useState([]);

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("/api/comment/create", {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({ postId, userId: currentUser._id, content: comment }),
                credentials: "include",
            })
            const data = await res.json()
            if (!res.ok) {
                setCommentError("Unable to post a comment")
            } else {
                setComment("")
                setCommentError(null)
                setComments([data, ...comments])
            }
        } catch (error) {
            setCommentError("Unable to post a comment")
        }
    }

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComment/${postId}`)
                const data = await res.json()
                if (res.ok) {
                    setComments(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getComments()
    }, [postId])

    const likeHandler = async (commentId) => {
        try {
            if (!currentUser) {
                navigate("/sign-in")
                return
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: "PUT",
                headers: { "Content-Type": 'application/json' },
                credentials: "include",
            })

            const data = await res.json()
            setComments(comments.map((comment) => {
                if (comment._id === commentId) {
                    return {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length
                    };
                }
                return comment;
            }));
        } catch (error) {
            console.log(error)
        }
    }

    const editHandler = (comment, editedContent) => {
        setComments(
            comments.map((c) => c._id === comment._id ? { ...c, content: editedContent } : c)
        )
    }

    const deleteHandler = (commentId) => {
        setComments(
            comments.filter((c) => c._id !== commentId)
        )
    }

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {
                currentUser ? (
                    <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                        <p>Signed in as :</p>
                        <img className='w-5 h-5 rounded-full bg-gray-200' src={currentUser.profilePicture} alt="" />
                        <Link to={"/dashboard?tab=profile"} className='text-sm text-cyan-500 hover:underline'>
                            @{currentUser.username}
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-2 text-teal-400 text-sm">
                        You must be signed in to comment and like the comment.
                        <Link to={"/sign-in"} className='text-blue-400 hover:underline'>Sign in</Link>
                    </div>
                )
            }
            {currentUser && (
                <form onSubmit={handleSubmit} className='border p-2 caret-lime-900 rounded-md dark:bg-slate-800'>
                    <Textarea
                        placeholder='Add a comment...'
                        rows='6'
                        maxLength="200"
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                        required
                    />
                    <div className='flex items-center justify-between mt-3'>
                        <p className='italic text-sm'>{200 - comment.length} charecters remaining</p>
                        <Button type='submit' gradientDuoTone="purpleToBlue" outline>Submit</Button>
                    </div>
                    {commentError && <Alert color="failure" className='mt-2'>{commentError}</Alert>}
                </form>
            )}
            {comments.length === 0 ? (
                <p className='text-sm mt-4'>No comments yet</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p >{comments.length}</p>
                        </div>
                    </div>
                    {
                        comments.map((comment) => (
                            <Comment key={comment._id} comment={comment} onLike={likeHandler} onEdit={editHandler} onDelete={deleteHandler} />
                        ))
                    }

                </>
            )}
        </div>
    )
}

export default CommentSction