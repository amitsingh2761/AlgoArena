import React from 'react'
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
    FormControl,
    Textarea,
    Radio, RadioGroup
} from '@chakra-ui/react'

import axios from "axios"
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useState } from 'react';
import { ChatState } from "../context/ChatProvider"

export default function ReportModal({ authorName }) {
    const { postId, user } = ChatState();

    const [violatedPolicy, setViolatedPolicy] = useState("none");
    const [reportMsg, setReportMsg] = useState();
    console.log("user_id:", user._id)

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const setPolicy = (e) => {
        if (e.target) {
            setViolatedPolicy(e.target.value);
        }
    }



    const OverlayOne = () => (
        <ModalOverlay
            bg='rgba(255, 255, 255, 0.3)'
            backdropFilter='blur(2px)'
        />
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)


    const handleChange = (e) => {
        setReportMsg(e.target.value)
    }


    const submitReport = async () => {
        onClose();
        if (!violatedPolicy) {
            return alert("select one of the following reasons")
        }
        if (postId) {
            const response = await axios.post(`/api/post/report/${postId}`, {
                reportMsg,
                violatedPolicy,
                author: user._id

            }, config)
            if (response.data) {
                alert("report Submitted Successfully")

                console.log(response.data)
            }
        }
        else { throw new Error("Post_Id not Found!!") }


    }


    return (
        <>
            <Button
                onClick={() => {
                    setOverlay(<OverlayOne />)
                    onOpen()
                }}
                colorScheme='red' variant={"solid"} alignSelf={"end"}
            >
                <ReportProblemOutlinedIcon className='h-full font-extrabold' />

            </Button>

            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent>
                    <ModalHeader >Report <span className='text-red-600 font-extrabold'>{authorName}</span></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <FormControl>
                            <RadioGroup display="flex" flexDirection="column" name='violatedPolicy' onClick={setPolicy} colorScheme='red' marginBottom="25px">
                                <Radio value='Spam'><span className='font-bold font-sans text-lg'>Spam</span> </Radio>
                                <Radio value='Hate Speech'><span className='font-bold font-sans text-lg'>Hate Speech</span></Radio>
                                <Radio value='Harrasement And Bullying'><span className='font-bold font-sans text-lg'>Harrasement And Bullying</span></Radio>
                                <Radio value='Harmful Activites'><span className='font-bold font-sans text-lg'>Harmful Activites</span></Radio>
                                <Radio value='Poorly Written'><span className='font-bold font-sans text-lg'>Poorly Written</span></Radio>
                                <Radio value='Bad Image'><span className='font-bold font-sans text-lg'>Bad Image</span></Radio>
                                <Radio value='Factually Incorrect'><span className='font-bold font-sans text-lg'>Factually Incorrect</span></Radio>
                            </RadioGroup>
                            <Textarea placeholder='enter your message' value={reportMsg} onChange={handleChange} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={submitReport} colorScheme='green' margin={2}>Submit</Button>
                        <Button onClick={onClose} colorScheme='blackAlpha' margin={2}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
