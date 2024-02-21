import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { FileInput, Select, TextInput, Button, Alert } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase'


const UpdatePost = () => {
    const { postId } = useParams()
    const { currentUser } = useSelector(state => state.user)
    const [formData, setFormData] = useState({
        title: '',
        category: 'uncategorized',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imageFileURL, setImageFileURL] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const [disbleButton, setDisableBotton] = useState(false);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);

    const navigate = useNavigate()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImageFileUploadError(null)
        setImageFileUploadingProgress(null)
        setImageFile(file)
        setImageFileURL(URL.createObjectURL(file))
    }

    const uploadImage = async () => {
        if (!imageFile) {
            setImageFileUploadError("Please select the image")
        }
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        setImageFileUploadError(null)
        setDisableBotton(true)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                let percent = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                setImageFileUploadingProgress(percent.toFixed(0))
            },
            (error) => {
                setImageFileUploadingProgress(null)
                setImageFileUploadError("Could not upload image (max size 2MB ade Image Only)")
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downlodURL) => {
                    setFormData({ ...formData, image: downlodURL })
                    setImageFileURL(downlodURL)
                    setDisableBotton(false)
                })
            }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`/api/post/updatePost/${postId}/${currentUser._id}`, {
                method: "PUT",
                headers: { "Content-Type": 'application/json' },
                credentials: "include",
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success === false) {
                setPublishError(data.message)
            }
            if (res.ok) {
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }

        } catch (error) {
            setPublishError("Something went wrong")
        }
    }

    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}&postId=${postId}`)
                const data = await res.json()
                if (data.success === false) {
                    console.log(data.message)
                    return
                }
                setFormData(data.posts[0])
            } catch (error) {
                console.log(error.message)
            }
        }
        getPost()
    }, [postId])


    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Update a Post</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className='flex justify-around gap-2'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        id='title'
                        className='flex-1'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        value={formData.title}
                        required
                    />
                    <Select
                        id="categories"
                        required
                        className='flex-1'
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        value={formData.category}
                    >
                        <option value='uncategorized'>Select a category</option>
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
                {formData.image && (
                    <>
                        <img src={imageFileURL || formData.image} accept="image/*" alt='Post image' className='max-h-52 object-cover' />
                        <span className='text-center text-green-500'>{imageFileUploadingProgress && imageFileUploadingProgress + "% uploaded"}</span>
                    </>
                )
                }
                {imageFileUploadError &&
                    <Alert color="failure">{imageFileUploadError}</Alert>
                }
                <div className="flex flex-col md:flex-row justify-between items-center border-2  border-dashed border-teal-400 p-3 gap-3">
                    <FileInput onChange={handleImageChange} type="file" accept='image/*' className='w-full flex' />
                    <Button outline gradientDuoTone="purpleToPink" className='text-nowrap' onClick={uploadImage} disabled={disbleButton}>Upload Image</Button>
                </div>
                <ReactQuill
                    theme="snow"
                    className='h-48 md:h-64 mb-4'
                    required
                    placeholder='Write Something...'
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    value={formData.content}
                />
                <Button type='submit' gradientDuoTone="purpleToPink" className='mt-10 md:mt-4' disabled={disbleButton}>Update</Button>
                {publishError &&
                    <Alert color={"failure"}>{publishError}</Alert>
                }
            </form>
        </div>
    )
}

export default UpdatePost