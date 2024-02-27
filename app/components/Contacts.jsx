'use client'

import React, { useState, useEffect } from "react";

import Api from '../utility/Api';
import Image from "next/image";
export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  useEffect(() => {
    const fetchUser = () => {
      try {
        const data = JSON.parse(localStorage.getItem("usertoken"));
        //  (data.username);
        setCurrentUserName(data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUser();
  
  
  }, []);
  
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    //  (contact);
    changeChat(contact);
  };
  return (
    <>
     
       <>

     

            {contacts.map((contact, index) => {
              {/*  (contact.username) */}
              return (
                <div
  key={contact._id}
  className={`contact cursor-pointer hover:bg-[#F5F5F5] border-y-2 border-slate-500 max-md:border-y-0 ${index === currentSelected ? "bg-[#F5F5F5]" : ""}`}
  onClick={() => changeCurrentChat(index, contact)}
>
  <div className="flex items-center max-md:flex-col p-4 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105">
    <div className="w-12 h-12 overflow-hidden rounded-full mr-4">
      {/* Assuming 'userProfile' is the field with the image URL */}
      <Image
         width={100}
         height={100}
        src={`${Api}/uploads/${contact.profileImage}`}
        alt={`${contact.username}'s profile`}
        className="object-cover w-full h-full"
      />
    </div>
    <div className="username">
      <h3 className="text-black font-bold ">{contact.username}</h3>
    </div>
  </div>
</div>

              );
            })}
        
       
       
       </>
     
    </>
  );
}

