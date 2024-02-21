import { useState } from "react";
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput
} from "flowbite-react"
import { PiGitlabLogoFill } from "react-icons/pi"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmite = async (e) => {
    e.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      const data = await res.json()

      if (data.success === false) {
        return dispatch(signInFailure(data.message))
      }

      dispatch(signInSuccess(data))
      navigate("/")
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className="min-h-screen mt-40">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-4">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-xl bold dark:text-white">
            <span className="py-2 px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              <PiGitlabLogoFill className="inline" /> Blogs
            </span> Sing In
          </Link>
          <p className="text-sm mt-4">This is the place where devlopers can create there blog and share with the world!</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form onSubmit={handleSubmite} className="flex flex-col gap-4">
            <div>
              <Label value="Your email" color="info" />
              <TextInput
                type="email"
                onChange={handleChange}
                placeholder="Email"
                id="email"
                autoComplete="off"
                required />
            </div>
            <div>
              <Label value="Your password" color="info" />
              <TextInput
                type="password"
                onChange={handleChange}
                placeholder="Password"
                id="password"
                autoComplete="current-password"
                required />
            </div>
            <Button type="submit" gradientDuoTone="purpleToPink" outline disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Loading...</span>
                </>
              ) : "SignIn"
              }
            </Button>
            <OAuth/>
          </form>
          <p className="text-center mt-2">Dont't have an account?
            <Link to="/sign-up" className="text-blue-600 ml-1">Sign-Up</Link>
          </p>
          {error &&
            <Alert color="failure">
              <span className="font-medium">{error}</span>
            </Alert>
          }
        </div>
      </div>
    </div>
  )
}

export default SignIn