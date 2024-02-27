'use client'

import Image from "next/image";
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CoverImg from '../public/images/coverimg.png'; 
// Replace with your image path
import Api from './utility/Api';
import axios from 'axios';


export default function Home() {
    
  const [activeTab, setActiveTab] = useState('signup');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    img: '',
  });
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleChange = (e) => {
    if (e.target.name === 'img') {
      setFormData({ ...formData, img: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };


   

  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const form = new FormData();
      form.append('email', formData.email);
      form.append('password', formData.password);
  
      if (activeTab === 'signup') {
        form.append('username', formData.username);
        form.append('profileImage', formData.img);
  
        const response = await axios.post(`${Api}/signup`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });



        console.log(response)
  
        if (response.status === 201) {
          localStorage.setItem('usertoken', JSON.stringify(response.data.newUser));
          window.location.href = '/chats';
        } else if (response.status === 404) {
          // Handle invalid credentials
          toast.error('user are available');
        } 
      
  
      } else if (activeTab === 'signin') {
        const response = await axios.post(`${Api}/login`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  

  
        // Check for successful login status
        if (response.status === 200) {
          localStorage.setItem('usertoken', JSON.stringify(response.data.user));
          window.location.href = '/chats';
        } else if (response.status === 401) {
          // Handle invalid credentials
          toast.error('Invalid email or password');
        } else {
         
          toast.error('Unexpected error occurred',response.status);
        }
      }
    } catch (error) {
      // Handle network or other unexpected errors
      console.error('Error submitting form:', error);
  
      if (axios.isAxiosError(error)) {
        // Handle specific Axios errors
        const { response } = error;
        if (response && response.status === 401) {
          toast.error('Invalid email or password');
        } else {
          toast.error('Unexpected error occurred');
        }
      } else {
        // Handle other types of errors
        toast.error('Error processing request');
      }
    }
  };
  return (
  <>
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
     <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="w-[80%] bg-white shadow-md rounded-md  md:flex md:items-center">
      <div className="md:w-[40%] mb-4 md:mb-0 flex  justify-center lg:p-0  max-md:p-4">
        <Image
          src={CoverImg}
          alt="Your Image"
          className="w-full h-auto md:h-[670px] max-md:h-[160px]  max-sm:h-[160px] lg:rounded-none md:rounded-none max-md:rounded-[20px]"
        />
      </div>
        <div className="md:w-[60%] md:ml-4 p-4">
          <div className="flex justify-center mb-4">
            <button
              className={`mr-2 px-4 py-2 focus:outline-none ${
                activeTab === 'signup'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => handleTabChange('signup')}
            >
              Sign Up
            </button>
            <button
              className={`px-4 py-2 focus:outline-none ${
                activeTab === 'signin'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => handleTabChange('signin')}
            >
              Sign In
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {activeTab === 'signup' && (
                <div>
                <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="border rounded-md text-gray-700 py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border text-gray-700 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border text-gray-700 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="img"
                    accept="image/*"
                    onChange={handleChange}
                    className="border text-gray-700 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                >
                  Sign Up
                </button>
              </div>
            )}
            {activeTab === 'signin' && (
                <div>
                <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border text-gray-700 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border  text-gray-700 rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                >
                  Sign In
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  </>
  );
}
