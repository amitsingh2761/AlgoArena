import React, { useEffect, useRef } from 'react';
import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { ChatState } from "../../context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();
    const messageBoxRef = useRef(null);

    useEffect(() => {
        console.log("Selected chat changed:", selectedChat);
        if (selectedChat && messageBoxRef.current) {
            messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
            console.log("Scrolled to bottom");
        }
    }, [selectedChat]);

    return (

        <Box
            d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
            ref={messageBoxRef}
            overflowY="auto"
            style={{ maxHeight: "400px", height: "400px" }}
            className='shadow-gray-800 shadow-2xl'
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>

    );
};

export default Chatbox;
