import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AiOutlineSearch, } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { PiGitlabLogoFill } from "react-icons/pi";
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSucess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

const Header = () => {
    const path = useLocation().pathname
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { theme } = useSelector(state => state.theme)
    const { currentUser } = useSelector((state) => state.user)
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    const handleSubmite = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    return (
        <Navbar className="border-b-2">
            <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
                <span className="py-2 px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                    <PiGitlabLogoFill className="inline" /> Blogs
                </span>
            </Link>
            <form onSubmit={handleSubmite}>
                <TextInput
                    type="text"
                    placeholder="Search..."
                    rightIcon={AiOutlineSearch}
                    className="hidden lg:inline"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <Button className="w-12 h-10 lg:hidden" color="gray" pill>
                <AiOutlineSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button className="w-12 h-10 hidden sm:inline" color="gray" onClick={() => dispatch(toggleTheme())}>
                    {theme === "dark" ? <FaMoon /> : <FaSun />}
                </Button>
                {
                    currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar
                                    alt="user"
                                    img={currentUser.profilePicture
                                    }
                                    rounded
                                    bordered
                                    status="online"
                                />
                            }
                        >
                            <Dropdown.Header className="text-slate-700 font-bold italic">@{currentUser.username}</Dropdown.Header>
                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to="/sign-in">
                            <Button gradientDuoTone="purpleToPink" outline>
                                Sign In
                            </Button>
                        </Link>
                    )
                }

                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === "/"} as={"div"}>
                    <Link to="/">
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={"div"}>
                    <Link to="/about">
                        About
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
