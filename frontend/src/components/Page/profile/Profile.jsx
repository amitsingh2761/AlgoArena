import React, { useState, useEffect } from 'react';
import './profileStyle.css';
import axios from "axios";
import { ChatState } from "../../../context/ChatProvider"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export default function Profile({ userId }) {

    const history = useHistory();

    const { setMenuOption } = ChatState();
    const [userData, setUserData] = useState(null); // Initialize with null instead of undefined

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };



    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`/api/user/${userId}`);
            if (data) {
                setUserData(data);
            } else {
                console.log("empty response data");
            }
        } catch (error) {
            console.log(error.message);
            alert("error fetching user  (check console for more info)");
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    // Conditionally render profile content only when userData is defined
    return (
        <div className="frame shadow-2xl shadow-cyan-500">
            <div className="center shadow-xl shadow-cyan-300">
                {userData && (
                    <div className="profile">
                        <div className="image">
                            <div className="circle-1 font-extrabold"></div>
                            <div className="circle-2 font-extrabold"></div>
                            <img src={userData.user.pic} width="70" height="70" alt="User Pic" className='rounded-full' style={{ maxWidth: '70px', maxHeight: '70px' }} />

                        </div>
                        <div className="name text-blue-500 font-thin text-2xl">{userData.user.name}</div>
                        <div className="job text-gray-600 font-bold">{userData.user.email}</div>
                        <div className="actions">
                            <button onClick={() => { setMenuOption("Activity") }} id='btn1' className="btn text-blue-600">Portfolio</button>
                            <button onClick={logoutHandler} id='btn2' className="btn text-blue-600 ">Logout</button>

                        </div>
                    </div>
                )}
                {userData && (
                    <div className="stats">
                        <div className="box">
                            <span className="value">{userData.postsLength}</span>
                            <span className="parameter">Posts</span>
                        </div>
                        <div className="box">
                            <span className="value">{userData.user.followers.length}</span>
                            <span className="parameter">Followers</span>
                        </div>
                        <div className="box">
                            <span className="value">{userData.user.following.length}</span>
                            <span className="parameter">Following</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
