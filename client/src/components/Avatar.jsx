import React from "react";
import { PiUserCircle } from "react-icons/pi";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
    let avatarName = "";
    if (name) {
        const splitName = name?.split(" ");
        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            avatarName = splitName[0][0];
        }
    }

    const bgColor = [
        "bg-slate-200",
        "bg-teal-200",
        "bg-red-200",
        "bg-green-200",
        "bg-yellow-200",
    ];

    const randomNumber = Math.floor(Math.random() * bgColor.length);
    return (
        <div
            className={`text-slate-800 overflow-hidden rounded-full font-bold`}
            style={{ width: width + "px", height: height + "px" }}
        >
            {imageUrl ? (
                <img
                    width={width}
                    height={height}
                    src={imageUrl}
                    alt={name}
                    className="overflow-hidden rounded-full"
                />
            ) : name ? (
                <div
                    style={{ width: width + "px", height: height + "px" }}
                    className={`text-slate-800 overflow-hidden flex items-center justify-center rounded-full shadow border text-lg font-bold ${bgColor[randomNumber]}`}
                >
                    {avatarName}
                </div>
            ) : (
                <PiUserCircle size={width} />
            )}
        </div>
    );
};

export default Avatar;
