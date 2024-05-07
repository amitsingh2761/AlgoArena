import React, { useState, useEffect } from 'react';
import HubIcon from '@mui/icons-material/Hub';
import HomeIcon from '@mui/icons-material/Home';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ForumIcon from '@mui/icons-material/Forum';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, Stack, Avatar } from '@chakra-ui/react';
import axios from 'axios';
import GradientLine from './GradientLine';
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeButton, setActiveButton] = useState("Home");
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const { user, setMenuOption } = ChatState();
    const [userData, setUserData] = useState();
    const history = useHistory();

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await axios.get(`/api/user/${user._id}`);
                if (response.data) {
                    setUserData(response.data.user);
                } else {
                    console.log('Unable to fetch user Data');
                }
            } catch (error) {
                console.error('Error fetching User Data', error.message);
            }
        };
        fetchUser();
    }, [user]);

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    if (!user) {
        return null;
    }

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
        setMenuOption(buttonName);
    };

    const handleProfile = () => {
        setMenuOption("Profile");
        toggleDropdown();
    }

    return (
        <>
            <div>
                <nav className="bg-white border-gray-200relative ">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 shadow-2xl relative">
                        <a href="/main" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="https://i.postimg.cc/kgRcPZ3H/aaa-removebg-preview.png" className="h-7" alt="Logo" />
                            <span className="self-center text-2xl font-extrabold whitespace-nowrap dark:text-white">AlgoArena</span>
                        </a>
                        <div>
                            <Stack direction='row' spacing={4} alignSelf={"center"} justifyItems={"center"}>
                                <Button
                                    className='shadow-gray-700 shadow-md'
                                    leftIcon={<HomeIcon />}
                                    colorScheme='blue'
                                    fontWeight={"bold"}
                                    variant={activeButton === 'Home' ? 'solid' : 'outline'} // Check if the button is active
                                    onClick={() => handleButtonClick('Home')}
                                >
                                    {screenWidth > 700 ? "Home" : ""}
                                </Button>
                                <Button
                                    className='shadow-gray-700 shadow-md'
                                    leftIcon={<HubIcon />}
                                    fontWeight={"bold"}
                                    colorScheme='blue'
                                    variant={activeButton === 'Activity' ? 'solid' : 'outline'}
                                    onClick={() => handleButtonClick('Activity')}
                                >
                                    {screenWidth > 700 ? "Activity" : ""}
                                </Button>
                                <Button
                                    className='shadow-gray-700 shadow-md'
                                    leftIcon={<GroupsIcon />}
                                    fontWeight={"bold"}
                                    colorScheme='blue'
                                    variant={activeButton === 'Community' ? 'solid' : 'outline'}
                                    onClick={() => handleButtonClick('Community')}
                                >
                                    {screenWidth > 700 ? "Community" : ""}
                                </Button>
                                <Button
                                    className='shadow-gray-700 shadow-md'
                                    leftIcon={<PersonAddIcon />}
                                    fontWeight={"bold"}
                                    colorScheme='blue'
                                    variant={activeButton === 'People' ? 'solid' : 'outline'}
                                    onClick={() => handleButtonClick('People')}
                                >
                                    {screenWidth > 700 ? "People" : ""}
                                </Button>
                                <Button
                                    className='shadow-gray-700 shadow-md'
                                    leftIcon={<ForumIcon />}
                                    fontWeight={"bold"}
                                    colorScheme='blue'
                                    variant={activeButton === 'Chats' ? 'solid' : 'outline'}
                                    onClick={() => handleButtonClick('Chats')}
                                >
                                    {screenWidth > 700 ? "Chats" : ""}
                                </Button>
                            </Stack>
                        </div>

                        <div>
                            <Stack direction='row' spacing={4} alignSelf="end" justifyItems={"end"}>
                                <Button className='shadow-gray-700 shadow-md' leftIcon={<DriveFileRenameOutlineIcon />} onClick={() => { setMenuOption("CreatePost") }} fontWeight={"bold"} colorScheme='facebook' variant='solid'>
                                    {screenWidth > 700 ? "Create a New Post" : ""}

                                </Button>
                            </Stack>
                        </div>

                        {/* Dropdown menu positioned relative to the button */}
                        <div className="relative">
                            <button
                                type="button"
                                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                id="user-menu-button"
                                aria-expanded={isDropdownOpen ? "true" : "false"}
                                onClick={() => {
                                    toggleDropdown();

                                }}
                                data-dropdown-toggle="user-dropdown"
                                data-dropdown-placement="bottom"
                            >
                                <span className="sr-only">Open user menu</span>
                                <Avatar className="shadow-gray-700 shadow-md" src={userData ? userData.pic : "https://unsplash.com/photos/red-letters-neon-light-49uySSA678U"} alt="user photo" />
                            </button>

                            {/* Dropdown menu */}
                            <div className={`absolute z-50 right-0 mt-5 mx-3 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${isDropdownOpen ? "" : "hidden"}`} id="user-dropdown">
                                <div className="px-2 py-3">
                                    <span className="block text-sm text-gray-900 dark:text-white">{userData ? userData.name : "userName"}</span>
                                    <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">{userData ? userData.email : "Email Address"}</span>
                                </div>
                                <ul className="py-2 px-1" aria-labelledby="user-menu-button">
                                    <li>
                                        <Button colorScheme='gray' className='w-full mt-1 ' onClick={handleProfile}>DashBoard</Button>
                                    </li>

                                    <li>
                                        <Button onClick={logoutHandler} colorScheme='red' className='w-full mt-1' >Logout</Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            <GradientLine />
        </>
    );
}
