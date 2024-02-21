import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiUsers, HiChat } from 'react-icons/hi'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOutSucess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RxDashboard } from 'react-icons/rx'

const DashSidebar = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [tab, setTab] = useState("");
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        const userParams = new URLSearchParams(location.search)
        const tabFromUrl = userParams.get("tab")
        setTab(tabFromUrl)
    }, [location.search])

    const handleSignOut = async () => {
        try {
            const res = await fetch("/api/user/signOutUser", {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                credentials: "include"
            })
            const data = await res.json()

            if (data.success === false) {
                console.log(error)
            }

            if (res.ok) {
                dispatch(signOutSucess())
                navigate("/sign-in")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-2'>
                    <Link to={'/dashboard?tab=profile'}>
                        <Sidebar.Item as={"div"} active={tab === "profile"} icon={HiUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor="dark">
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=dash'}>
                            <Sidebar.Item as={"div"} active={tab === "dash"} icon={RxDashboard} labelColor="dark">
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=posts'}>
                            <Sidebar.Item as={"div"} active={tab === "posts"} icon={HiDocumentText} labelColor="dark">
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=users'}>
                            <Sidebar.Item as={"div"} active={tab === "users"} icon={HiUsers} labelColor="dark">
                                Users
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <Link to={'/dashboard?tab=comments'}>
                            <Sidebar.Item as={"div"} active={tab === "comments"} icon={HiChat} labelColor="dark">
                                Comments
                            </Sidebar.Item>
                        </Link>
                    )}
                    <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className="cursor-pointer">
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar
