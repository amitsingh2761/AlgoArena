import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState();
    const [postId, setPostId] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [comments, setComments] = useState([]);
    const [menuOption, setMenuOption] = useState("Home");
    const [messageBoxOpen, setMessageBoxOpen] = useState(false);
    const [groupBoxOpen, setGroupBoxOpen] = useState(false);
    const [modalProfileOpen, setModalProfileOpen] = useState(false);
    const [profileId, setProfileId] = useState("");




    const fetchComments = async (config) => {

        try {
            const response = await axios.get(`/api/comment/${postId}`, config);
            setComments(response.data);
        } catch (error) {


            console.log('error fetching comments', error.message);
        }
    };

    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) { history.push("/"); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history]);

    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats,
                postId,
                setPostId,
                attachments,
                setAttachments,
                comments,
                setComments,
                fetchComments,
                menuOption,
                setMenuOption,
                messageBoxOpen,
                setMessageBoxOpen,
                groupBoxOpen,
                setGroupBoxOpen,
                modalProfileOpen,
                setModalProfileOpen,
                profileId,
                setProfileId


            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};

export default ChatProvider;