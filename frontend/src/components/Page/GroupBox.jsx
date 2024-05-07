import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Flex, // Import Flex component
} from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import Chatbox from '../chatComponents/Chatbox';

export default function GroupBox({ setOpen }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { setGroupBoxOpen, user, selectedChat } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    useEffect(() => {
        onOpen();
    }, []);

    const handleClose = () => {
        onClose();
        setGroupBoxOpen(false);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><a href="/main" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://i.postimg.cc/kgRcPZ3H/aaa-removebg-preview.png" className="h-7" alt="Logo" />
                        <span className="self-center text-2xl font-extrabold whitespace-nowrap dark:text-white">AlgoArena</span>
                    </a> </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody width="full" alignItems="center" alignSelf="center" height="80vh"> {/* Added height */}
                        {user && (
                            <Flex justifyContent="center"> {/* Center align Chatbox */}
                                <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                            </Flex>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
