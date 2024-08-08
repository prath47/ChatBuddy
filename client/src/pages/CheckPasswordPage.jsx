import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/UploadFile";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { PiUserCircle } from 'react-icons/pi'
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/UserSlice";


const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
  });

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

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

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/password`;

    try {
      const response = await axios.post(URL, {
        password: data.password,
        userId: location?.state?._id
      }, { withCredentials: true });

      toast.success(response?.data?.message, { duration: 2000 });

      if (response.data.success) {
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token', response?.data?.token)

        setData((prev) => {
          return {
            password: "",
          }
        })
        navigate('/')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { duration: 2000 });
    }
  };

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email')
    }
  }, [])

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          <Avatar
            height={70}
            width={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-1 ">{location?.state?.name}</h2>
        </div>
        <h3 className="text-center text-2xl">Welcome</h3>

        <form action="" className="grid gap-4" onSubmit={handleSubmit}>
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

          <button id="submitButton" className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 text-white tracking-wider">Login</button>
        </form>

        <p className="my-3 text-center">Do Not Have An Account ? <Link to={'/forgot-password'} className="hover:text-primary font-semibold">Forgot Password ?</Link></p>
      </div>
    </div>
  )
}

export default CheckPasswordPage