import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setUser,
  setOnlineUser,
  setSocketConnection,
} from "../redux/UserSlice";
import Siderbar from "../components/Siderbar";
import logo from "../assets/logo.png";
import io from "socket.io-client";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // console.log("redux user", user);
  const fetchUserDetails = async () => {
    try {
      const URL = `${
        import.meta.env.VITE_REACT_APP_BACKEND_URL
      }/api/user-details`;
      const response = await axios.get(URL, { withCredentials: true });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }

      // console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const basePath = location.pathname === "/";

  //socket connection
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_REACT_APP_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      // console.log(data);
      dispatch(setOnlineUser(data));
    });
    
    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Siderbar />
      </section>

      {/* messege components */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={logo} alt="logo" width={250} />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
