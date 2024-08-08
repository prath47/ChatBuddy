import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/UploadFile";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { PiUserCircle } from 'react-icons/pi'


const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message, { duration: 2000 });

      if (response.data.success) {
        setData((prev) => {
          return {
            email: "",
          }
        })
        console.log(response?.data.data);
        navigate('/password', {
          state: response?.data.data
        })
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

          <button id="submitButton" className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 text-white tracking-wider">Login</button>
        </form>

        <p className="my-3 text-center">Do Not Have An Account ? <Link to={'/register'} className="hover:text-primary font-semibold">Register</Link></p>
      </div>
    </div>
  )
}

export default CheckEmailPage