import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import "./styles/People.css";
import axios from 'axios';
import { useToast } from "@chakra-ui/toast";
import MessageBox from './MessageBox';
import { CircularProgress } from '@chakra-ui/react'

import { Container } from '@chakra-ui/react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons';
export default function People() {




    const { setChats,

        setSelectedChat,
        user,
        messageBoxOpen,
        setMessageBoxOpen

    } = ChatState();
    const [peoples, setPeoples] = useState();
    const [searchData, setsearchData] = useState("");

    const toast = useToast();

    const handleFollow = async (id) => {
        try {
            const response = await axios.put(`/api/user/follow`, {
                userId: id,
                reqId: user._id
            });
            if (response.data) {
                fetchPeoples();
            }
        } catch (error) {
            console.error('Error setting Follow', error.message);
        }
    }

    const handleUnFollow = async (id) => {
        try {
            const response = await axios.put(`/api/user/unfollow`, {
                userId: id,
                reqId: user._id
            });
            if (response.data) {
                fetchPeoples();
            }
        } catch (error) {
            console.error('Error setting unFollow', error.message);
        }
    }

    const handleFriends = async (id) => {
        try {
            const response = await axios.put(`/api/user/friend`, {
                userId: id,
                reqId: user._id
            });
            if (response.data) {
                fetchPeoples();
            }
        } catch (error) {
            console.error('Error setting friends', error.message);
        }
    }

    const handleMessage = async (userId) => {
        setMessageBoxOpen(true);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            setChats(prevChats => [data, ...prevChats]);
            setSelectedChat(data);
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const fetchPeoples = async () => {
        try {
            const response = await axios.get(`/api/user/people/${user._id}`);
            if (response.data) {
                setPeoples(response.data);
            } else {
                console.log('Unable to fetch peoples');
            }
        } catch (error) {
            console.error('Error fetching peoples:', error.message);
        }
    };

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/chat`, config);
            setChats(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchPeoples();
            await fetchChats();
        };

        fetchData();
    }, []);



    const handleSearch = (e) => {
        setsearchData(e.target.value);
    }


    return (
        <Container maxW="container.lg" className="h-screen w-full overflow-y-auto container m-2 p-2">
            <div className='overflow-x-auto max-h-screen w-full' style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>


                <div>
                    <InputGroup>
                        <InputLeftElement>
                            <SearchIcon color='blue.300' />
                        </InputLeftElement>
                        <Input focusBorderColor='crimson' placeholder='search user' backgroundColor={'white'} marginBottom={4} value={searchData}
                            onChange={handleSearch}

                        />
                    </InputGroup>
                </div>


                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center'>
                    {peoples ? (
                        peoples.map((people, index) => (

                            <>{
                                people.name.includes(searchData) &&
                                <div className="w-full p-2 sm:p-3 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105" key={index}>
                                    <div className="flex flex-col items-center pb-6 font-mono font-medium">

                                        <img className="w-24 h-24 mb-2 sm:mb-3 rounded-full shadow-lg" src={people.pic} alt={people.name + " img"} />
                                        <h5 className="mb-1 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{people.name}</h5>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{people.email}</span>
                                        <div className="flex items-center mt-2 sm:mt-4 m-1 p-1">
                                            <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mx-2">
                                                Followers: <span className="font-bold">{people.followers ? people.followers.length : 0}</span>
                                            </span>
                                            <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mx-2">
                                                Following: <span className="font-bold">{people.following ? people.following.length : 0}</span>
                                            </span>
                                        </div>
                                        <div className="flex mt-2 sm:mt-4">
                                            {people.followers.includes(user._id) ? (
                                                <button onClick={() => { handleUnFollow(people._id) }} className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2">unfollow</button>)
                                                : (
                                                    <button onClick={() => { handleFollow(people._id) }} className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-2">follow</button>
                                                )
                                            }
                                            {messageBoxOpen && <MessageBox setOpen={setMessageBoxOpen} />}
                                            {people.Friends.includes(user._id) ? (
                                                <button onClick={() => { handleMessage(people._id) }} className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-bolder text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</button>
                                            ) : (
                                                <button onClick={() => { handleFriends(people._id) }} className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-bolder text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Add friend</button>
                                            )}
                                        </div>
                                    </div>
                                </div>



                            }</>
                        ))
                    ) : (
                        <CircularProgress isIndeterminate color='green.300' />
                    )}
                </div>
            </div>
        </Container>
    );
}
