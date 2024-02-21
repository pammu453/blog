import { useSelector, useDispatch } from 'react-redux'
import { TextInput, Button, Alert, Modal } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { updateStart, udpateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure, signOutSucess } from '../redux/user/userSlice'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'

const DashProfile = () => {
  const { currentUser } = useSelector(state => state.user)

  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadError, setimageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [udpatedSuccessfully, setudpatedSuccessfully] = useState(null);
  const [error, setError] = useState(null);
  const [disableBotton, setDisableBotton] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const filePickerRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
    setImageFileURL(URL.createObjectURL(file))
  }

  const uploadImage = async () => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    setimageFileUploadError(null)
    setDisableBotton(true)
    setError(null)
    setudpatedSuccessfully(null)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        setImageFileUploadingProgress(percent.toFixed(0))
      },
      (error) => {
        setudpatedSuccessfully(null)
        setimageFileUploadError("Could not upload image (max size 2MB ade Image Only)")
        setDisableBotton(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downlodURL) => {
          setImageFileURL(downlodURL)
          setFormData({ ...formData, profilePicture: downlodURL })
          setDisableBotton(false)
        })
      }
    )
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  const handleChange = (e) => {
    setError(null)
    setudpatedSuccessfully(null)
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (Object.keys(formData).length === 0) {
      return setError("No changes made")
    }
    setImageFileUploadingProgress(null)
    dispatch(updateFailure(null))
    setLoading(true)
    try {
      dispatch(updateStart())
      const res = await fetch(`/api/user/updateUser/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": 'application/json' },
        credentials: "include",
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success === false) {
        setudpatedSuccessfully(null)
        setLoading(false)
        return setError(data.message)
      }

      if (res.ok) {
        dispatch(udpateSuccess(data))
        setError(null)
        setLoading(false)
        setudpatedSuccessfully("Profile updated!")
      }
    } catch (error) {
      setError("Something went wrong!")
    }
  }

  const deleteUser = async () => {
    setOpenModal(false)
    try {
      dispatch(deleteStart())
      const res = await fetch(`/api/user/deleteUser/${currentUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": 'application/json' },
        credentials: "include"
      })
      const data = await res.json()

      if (data.success === false) {
        return setError(data.message)
      }

      if (res.ok) {
        dispatch(deleteSuccess())
        navigate("/sign-in")
      }

    } catch (error) {
      setError("Something went wrong!")
    }
  }

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signOutUser", {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        credentials: "include"
      })
      const data = await res.json()

      if (data.success === false) {
        setError("Something went wrong!")
      }

      if (res.ok) {
        dispatch(signOutSucess())
        navigate("/sign-in")
      }
    } catch (error) {
      setError("Something went wrong!")
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl text-slate-300'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div onClick={() => filePickerRef.current.click()} className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
          <img
            src={imageFileURL || currentUser.profilePicture}
            alt='user'
            className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
          />
        </div>
        {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}

        <div className='text-center text-green-500'>
          {imageFileUploadingProgress && !imageFileUploadError && imageFileUploadingProgress + "% Uploded"}
        </div>

        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
        />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={disableBotton || loading}>
          {loading ? "Loading..." : "Update"}
        </Button>

        {
          currentUser.isAdmin && (
            <Link to={"/create-post"}>
              <Button type='button' className='w-full' gradientDuoTone='purpleToPink' >
                Create Post
              </Button>
            </Link>
          )
        }
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setOpenModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
      </div>
      {
        error && <Alert color="failure">
          {error}
        </Alert>
      }
      {
        udpatedSuccessfully && <Alert color="success">
          {udpatedSuccessfully}
        </Alert>
      }
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile
