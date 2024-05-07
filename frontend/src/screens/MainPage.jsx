import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import { ChatState } from '../context/ChatProvider'

import Home from "../components/Page/Home"
import Activity from "../components/Page/Activity"
import Community from "../components/Page/Community"
import CreatePost from "../components/Page/CreatePost"
import People from "../components/Page/People"
import Profile from "../components/Page/profile/Profile"
import Chats from "../components/Page/Chats"

export default function MainPage() {

    const { menuOption, user } = ChatState();

    return (
        <div className='w-full'>
            <Navbar />

            <div className='w-full'>

                {menuOption === "Home" && <Home />}

            </div>
            <div className='w-full'>
                {menuOption === "Activity" && <Activity />}

            </div>
            <div className='w-full'>
                {menuOption === "Community" && <Community />}

            </div>
            <div className='w-full'>
                {menuOption === "People" && <People />}

            </div>
            <div className='w-full'>
                {menuOption === "CreatePost" && <CreatePost />}

            </div>
            <div className='w-full'>
                {menuOption === "Profile" && user && <Profile userId={user._id} />}

            </div>
            <div className='w-full'>
                {menuOption === "Chats" && user && <Chats />}

            </div>


        </div>
    )
}
