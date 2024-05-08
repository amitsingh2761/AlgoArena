import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { Spinner, useToast, Avatar, InputGroup, Button } from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import { getSenderFull } from "../../config/chatConfig";
import axios from "axios";
import io from "socket.io-client"

import UpdateGroupChatModal from './UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import SendIcon from '@mui/icons-material/Send';


// const ENDPOINT = "http://localhost:5000";
const ENDPOINT = "https://algoarena.onrender.com";
var socket, selectedChatCompare;




function SingleChat({ fetchAgain, setFetchAgain, inputRef }) {



    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)


    const { user, selectedChat, notification, setNotification } = ChatState();
    const toast = useToast();


    useEffect(() => {
        // Create a new socket connection when the component mounts
        socket = io(ENDPOINT);//ENDPOINT
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => { setTyping(true) })
        socket.on("stop typing", () => { setIsTyping(false) })


        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);

        } catch (error) {
            toast({
                title: "Error Occurred on Socket!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };


    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;

    }, [selectedChat]);



    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {

            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }

            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);

                setNewMessage("");
                socket.emit("new message", data);
                setMessages(prevMessages => [...prevMessages, data]);
            } catch (error) {
                toast({
                    title: "Error Occurred!!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };
    const sendButtonMessage = async (e) => {
        if (newMessage) {
            socket.emit("stop typing", selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config);

                setNewMessage("");
                socket.emit("new message", data);
                setMessages(prevMessages => [...prevMessages, data]);
            } catch (error) {
                toast({
                    title: "Error Occurred!!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };




















    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px={4}
                        py={2}
                    >
                        {!selectedChat.isGroupChat ?
                            <Box display="flex" alignItems="center">
                                <Avatar src={selectedChat.users[0]._id === user._id ? selectedChat.users[1].pic : selectedChat.users[0].pic} />
                                <span className='self-start ml-2 my-3 text-xl font-bold font-sans text-gray-500'>{selectedChat.users[0]._id === user._id ? selectedChat.users[1].name : selectedChat.users[0].name}</span>
                            </Box>
                            : <></>
                        }

                        <Box display="flex" alignItems="center">

                            <Text fontSize="lg">
                                {!selectedChat.isGroupChat ? (
                                    <>

                                        <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                    </>
                                ) : (

                                    <div className='flex flex-row w-full justify-between'>
                                        <span className='text-3xl text-gray-700 mx-2 text-center font-sans px-2 font-semibold self-start'>
                                            {selectedChat.chatName.toUpperCase()}
                                        </span>
                                        <span className='flex items-end mr-0 ml-auto'>
                                            <UpdateGroupChatModal
                                                fetchAgain={fetchAgain}
                                                setFetchAgain={setFetchAgain}
                                                fetchMessages={fetchMessages}
                                            />
                                        </span>
                                    </div>




                                )}
                            </Text>
                        </Box>
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="end"
                        flexDirection="column"
                        p={3}
                        bg="#E8E8E8"
                        width="100%"
                        height="80%"
                        borderRadius="lg"
                        overflow="hidden"
                    >
                        {loading ?
                            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
                            :
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                overflowY: "scroll",
                                scrollbarWidth: "none"
                            }}>
                                <ScrollableChat messages={messages} />
                            </div>
                        }
                        <FormControl onKeyDown={sendMessage}>
                            {isTyping ? <div>loading...</div> : <></>}
                            <InputGroup>
                                <Input ref={inputRef} variant="filled" bg="#E0E0E0" placeholder='enter the message...'
                                    onChange={typingHandler}
                                    value={newMessage}   >

                                </Input>
                                <Button colorScheme='blue' padding={4} marginLeft={1} marginRight={4} onClick={sendButtonMessage}> <SendIcon /></Button>
                            </InputGroup>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={3}
                    bg="#E8E8E8"
                    width="100%"
                    height="100%"
                    borderRadius="lg"
                    overflowY="hidden"
                    fontSize="xx-large"
                    fontFamily="cursive"
                >
                    Loading Chats ...
                </Box>
            )}
        </>
    );
}

export default SingleChat;
