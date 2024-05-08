import React, { useState, useEffect } from 'react';
import { Container, Button } from '@chakra-ui/react'; // Imported Button from Chakra-UI
import axios from "axios";

import { ChatState } from '../../context/ChatProvider';
import GroupBox from './GroupBox';
import { useToast } from "@chakra-ui/toast";
import './styles/Community.css'; // Import the CSS file containing scrollbar styles



export default function Community() {

    const [myGroups, setMyGroups] = useState([]);
    const [otherGroups, setOtherGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setSelectedChat, user, groupBoxOpen, setGroupBoxOpen } = ChatState();
    const toast = useToast();

    const handleView = async (chat) => {
        if (chat) {
            try {
                setSelectedChat(chat);
                setGroupBoxOpen(true);
            } catch (error) {
                toast({
                    title: "Error Viewing Group Chats",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
            }
        } else {
            console.log("chat is empty")
        }
    }

    const handleJoin = async (group) => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupadd`,
                {
                    chatId: group._id,
                    userId: user._id,
                },
                config
            );
            setSelectedChat(data);
            fetchGroup();
            setLoading(false);
        } catch (error) {
            console.log(error.message)
            toast({
                title: "Error Occured in Adding User!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }

    const fetchGroup = async () => {
        try {
            const response = await axios.get(`/api/chat/fetchgroups/${user._id}`)
            if (response.data) {
                setMyGroups(response.data.myGroups);
                setOtherGroups(response.data.otherGroups)
            } else {
                console.log('Unable to fetch Groups');
            }
        } catch (error) {
            console.log("Fetching Group Error", error.message)
        }
    }

    useEffect(() => {
        fetchGroup();
    }, [])

    return (
        <Container maxW="container.lg" className="h-screen w-full overflow-y-auto container">

            <h2 className="text-3xl font-semibold mb-4">My Community    </h2>
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">

                {myGroups.length ?
                    (myGroups.map((group, index) => (
                        <div key={index} className="p-6 border font-mono font-medium rounded-lg shadow-md hover:shadow-xl transition duration-300 bg-white dark:bg-gray-800">

                            <div className='mb-8'>
                                <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{group.chatName}</h5>


                                <p className="mb-3 text-gray-700 dark:text-gray-400">Created By: {group.groupAdmin.name}</p>
                            </div>
                            <span>Community Members</span>
                            <div className="mb-3 flex -space-x-4">

                                {group.users.slice(0, 5).map((user, index) => (
                                    <img key={index} className="w-10 h-10 border-2 border-black rounded-full dark:border-gray-800" src={user.pic} alt={user.name} />
                                ))}
                                {group.users.length > 5 && (
                                    <a className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="#">+{group.users.length - 5}</a>
                                )}
                            </div>
                            {groupBoxOpen && <GroupBox setOpen={setGroupBoxOpen} />}
                            <Button colorScheme='blue' width={"100%"} variant={"solid"} onClick={() => { handleView(group) }}>View</Button>
                        </div>
                    ))) : (<>
                        <div className='w-full text-center text-2xl text-gray-500'>No Community Found</div>
                    </>)}















            </div>
            <div className="text-center mt-6 mb-3 text-3xl font-semibold">Related Communities</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherGroups.map((group, index) => (
                    <div key={index} className="p-6 border rounded-lg shadow-md hover:shadow-xl transition duration-300 bg-white dark:bg-gray-800">
                        <div className='mb-8'>
                            <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{group.chatName}</h5>


                            <p className="mb-3 text-gray-700 dark:text-gray-400">Created By: {group.groupAdmin.name}</p>
                        </div>
                        <div className="mb-3 flex -space-x-4">
                            {group.users.slice(0, 5).map((user, index) => (
                                <img key={index} className="w-10 h-10 border-2 border-black rounded-full dark:border-gray-800" src={user.pic} alt={user.name} />
                            ))}
                            {group.users.length > 5 && (
                                <a className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800" href="#">+{group.users.length - 5}</a>
                            )}
                        </div>
                        <Button isLoading={loading} colorScheme='blue' variant="solid" onClick={() => { handleJoin(group) }}>Join</Button>
                    </div>
                ))}
            </div>
        </Container>
    )
}
