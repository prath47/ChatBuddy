import React, { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import { uploadFile } from '../helpers/UploadFile'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/UserSlice'

const EditUserDetails = ({ onClose, user }) => {
    console.log("user", user);
    const [data, setData] = useState({
        name: user?.name,
        profile_pic: user?.profile_pic
    })
    const dispatch = useDispatch()

    const handleOnChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];

        document.querySelector('#submitButton').disabled = true;
        document.querySelector('#submitButton').innerHTML = "Uploading...";
        const uploadPhoto = await uploadFile(file)

        setData((prev) => {
            return {
                ...prev,
                profile_pic: uploadPhoto?.url
            }
        })
        document.querySelector('#submitButton').disabled = false;
        document.querySelector('#submitButton').innerHTML = "Save";
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/update-user`;
            const response = await axios.post(URL, data, { withCredentials: true });

            toast.success(response?.data?.message)

            if (response.data.success) {
                dispatch(setUser(response?.data?.data))
                onClose()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    const uploadPhotoRef = useRef()
    const handleOpenUploadPhoto = (e) => {
        e.preventDefault()
        e.stopPropagation()
        uploadPhotoRef.current.click()
    }

    useEffect(() => {
        setData((prev) => {
            return {
                ...prev,
                ...user
            }
        })
    }, [user])
    return (
        <div className='fixed top-0 bottom-0 right-0 left-0 bg-gray-700 bg-opacity-30 flex justify-center items-center' onSubmit={handleSubmit}>
            <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold'>Profile Details</h2>
                <p className='text-sm'>Edit User Deatils</p>

                <form className='grid gap-3 mt-3'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="name">Name: </label>
                        <input type="text"
                            name='name'
                            id='name'
                            value={data?.name}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primary border'
                        />
                    </div>

                    <div>
                        <div>Photo</div>
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar width={40} height={40} imageUrl={data?.profile_pic} name={data?.name} />
                            <label htmlFor="profile_pic">
                                <button className='font-bold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                                <input ref={uploadPhotoRef} type="file" name="profile_pic" id="profile_pic" className='hidden' onChange={handleUploadPhoto} />
                            </label>
                        </div>
                    </div>

                    <Divider />
                    <div className='flex gap-2 w-fit ml-auto'>
                        <button onClick={onClose} className='border-primary text-primary border px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                        <button onClick={handleSubmit} id='submitButton' className='border-primary bg-primary border px-4 text-white py-1 rounded hover:bg-white hover:text-primary'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default React.memo(EditUserDetails)  