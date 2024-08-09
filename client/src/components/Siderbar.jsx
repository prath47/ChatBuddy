import React, { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";

const Siderbar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);

  return (
    <div className="bg-white w-full h-full grid grid-cols-[48px,1fr]">
      <div className="bg-slate-100 w-12 h-full py-5 rounded-tr-lg rounded-br-lg flex justify-between items-center flex-col">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={20} className="" />
          </NavLink>
          <div
            className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-200 rounded"
            title="add friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} className="" />
          </div>
        </div>
        <div className="flex items-center justify-center flex-col">
          <button
            title={user?.name}
            className="flex items-center justify-center"
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              name={user?.name}
              profile_pic={user?.profile_pic}
              width={40}
              height={40}
              imageUrl={user?.profile_pic}
            />
          </button>

          <button
            className="w-12 h-12 flex items-center justify-center cursor-pointer hover:bg-slate-200 rounded"
            title="logout"
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-500 ">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore user to start conversation with..
              </p>
            </div>
          )}
        </div>
      </div>

      {/* edit user details */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Siderbar;
