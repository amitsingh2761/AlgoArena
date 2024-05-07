import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/chatComponents/Chatbox";
import MyChats from "../components/chatComponents/MyChats";
import SideDrawer from "../components/chatComponents/SideDrawer";
import { ChatState } from "../context/ChatProvider";


const ChatPage = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const { user } = ChatState();

    return (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                height="91.5vh"
                padding="10px"
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </Box>
        </div>
    );
};

export default ChatPage;
