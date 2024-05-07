import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    useDisclosure,
    ModalCloseButton,
    Button
} from '@chakra-ui/react'
import { ChatState } from '../../../context/ChatProvider'
import Profile from './Profile';
import { useEffect } from 'react';
export default function ModalProfile() {

    const { isOpen, onOpen, onClose } = useDisclosure();


    const { setModalProfileOpen, profileId } = ChatState();
    useEffect(() => {
        onOpen();
    }, []);
    const handleClose = () => {
        onClose();
        setModalProfileOpen(false);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><a href="/main" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="https://i.postimg.cc/kgRcPZ3H/aaa-removebg-preview.png" className="h-7" alt="Logo" />
                        <span className="self-center text-2xl font-extrabold whitespace-nowrap dark:text-white">AlgoArena</span>
                    </a></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody width="full" alignItems="center" alignSelf="center" height="80vh"> {/* Added height */}
                        {profileId && <Profile userId={profileId} />}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
