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
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmite = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      const data = await res.json()

      if (data.success === false) {
        setLoading(false)
        return setError(data.message)
      }

      setLoading(false)
      navigate("/sign-in")
    } catch (error) {
      setError(error.message)
      setLoading(false)
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
            </span> Sing Up
          </Link>
          <p className="text-sm mt-4">This is the place where devlopers can create there blog and share with the world!</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form onSubmit={handleSubmite} className="flex flex-col gap-4">
            <div>
              <Label value="Your name" color="info" />
              <TextInput
                type="text"
                onChange={handleChange}
                placeholder="Username"
                id="username"
                autoComplete="off"
                required />
            </div>
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
                autoComplete="off"
                required />
            </div>
            <Button type="submit" gradientDuoTone="purpleToPink" outline disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  <span className="ml-2">Loading...</span>
                </>
              ) : "SignUp"
              }
            </Button>
            <OAuth/>
          </form>
          <p className="text-center mt-2">Have an account?
            <Link to="/sign-in" className="text-blue-600 ml-1">Sign-In</Link>
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

export default SignUp