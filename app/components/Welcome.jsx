'use client'

import Image from "next/image";

import React, { useState, useEffect } from "react";

import Robot from "../../public/images/robot.gif";

 function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = localStorage.getItem("usertoken");
  
        if (!userToken) {
          // Assuming 'navigate' is a function to redirect the user
          navigate("/");
        } else {
          const { username } = JSON.parse(userToken);
          setUserName(username);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  
  }, []);
  
  return (
  <>
    
    <div className="w-full flex justify-center items-center flex-col">
    <Image src={Robot} className="w-[20rem] h-[20rem]" alt="" />
      <h1 className="text-white font-bold text-2xl m-1">
        Welcome, <span className="bg-[#78E378] font-extrabold px-2 py-1 rounded-lg">{userName}!</span>
      </h1>
      <h3 className="text-white font-semibold" >Please select a chat to Start messaging.</h3>
    </div>
</>
  );
}

export default Welcome;