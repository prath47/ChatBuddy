import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/UploadFile";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';


const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const [uploadPhoto, setUploadPhoto] = useState("");
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    document.querySelector('#submitButton').disabled = true;
    document.querySelector('#submitButton').innerHTML = "Uploading...";
    const uploadPhoto = await uploadFile(file)
    setUploadPhoto(file);

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url
      }
    })
    document.querySelector('#submitButton').disabled = false;
    document.querySelector('#submitButton').innerHTML = "Register";

  };

  const handleClearUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadPhoto("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message, { duration: 2000 });

      if (response.data.success) {
        setData((prev) => {
          return {
            name: "",
            email: "",
            password: "",
            profile_pic: "",
          }
        })
        handleClearUploadPhoto(e)
        navigate('/email')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { duration: 2000 });
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3 className="text-center text-2xl">Welcome</h3>

        <form action="" className="grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 mt-4">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Your Name"
              value={data?.name}
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              id="name"
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={data.email}
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              id="email"
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={data.password}
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              id="password"
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo:
              <div className="h-14 bg-slate-400 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : "Upload Profile Photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handleClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <div></div>
            <input
              type="file"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              id="profile_pic"
              onChange={handleUploadPhoto}
            />
          </div>

          <button id="submitButton" className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 text-white tracking-wider">Register</button>
        </form>

        <p className="my-3 text-center">Already Have Account ? <Link to={'/email'} className="hover:text-primary font-semibold">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
