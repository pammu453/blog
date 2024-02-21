import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner, Avatar, Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { ImCheckmark, ImCross } from "react-icons/im";

const DashUsers = () => {
    const { currentUser } = useSelector(state => state.user)
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/user/getUsers`)
                const data = await res.json()
                if (res.ok) {
                    setLoading(false)
                    setUsers(data.users)
                    if (data.users.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        getUsers()
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = users.length
        try {
            setLoading(true)
            const res = await fetch(`/api/user/getUsers?startIndex=${startIndex}`)
            const data = await res.json()
            if (res.ok) {
                setLoading(false)
                setUsers((prev) => [...prev, ...data.users])
                if (data.users.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const deleteUser = async () => {
        setOpenModal(false)
        try {
            const res = await fetch(`/api/user/adminDeleteUser/${userId}/${currentUser._id}`, {
                method: "DELETE",
                headers: { "Content-Type": 'application/json' },
                credentials: "include"
            })
            setUsers(users.filter((user) => user._id !== userId))
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
                users.length > 0 ? (
                    <>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Date Created</Table.HeadCell>
                                <Table.HeadCell>User Image</Table.HeadCell>
                                <Table.HeadCell>Username</Table.HeadCell>
                                <Table.HeadCell>Admin</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            {
                                users && users.map((user) => (
                                    <Table.Body key={user._id} className="divide-y p-2">
                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {(user.createdAt)?.substring(0, 10)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Avatar img={user.profilePicture} alt={user.username} bordered size="md" className='float-start' />
                                            </Table.Cell>
                                            <Table.Cell>{user.username}</Table.Cell>
                                            <Table.Cell>
                                                {user.isAdmin ? <ImCheckmark className='text-green-600' /> : <ImCross className='text-red-500' />}
                                            </Table.Cell>
                                            <Table.Cell onClick={() => {
                                                setOpenModal(true)
                                                setUserId(user._id)
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
                    <p className='text-center mt-10' hidden={loading}>You don't have the users now </p>
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
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => deleteUser()}>
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

export default DashUsers
