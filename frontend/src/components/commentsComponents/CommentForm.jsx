import React, { useState } from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useRef } from 'react';

import {
    FormControl,
    FormLabel,
    Textarea,
    FormHelperText,
    Button,
    Stack,
    IconButton,
    useToast

} from '@chakra-ui/react'
import axios from "axios"

import { ChatState } from "../../context/ChatProvider"


export default function CommentForm() {
    const { postId, user, fetchComments } = ChatState();
    const toast = useToast();





    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const handleClick = () => {
        fileInputRef.current.click();

    };

    const [comment, setComment] = useState("");

    const handleChange = (e) => {
        setComment(e.target.value);
    }
    const handleFileChange = (event) => {
        const data = event.target.files[0];
        setFile(data);
        console.log(data)
        console.log(postId)
    };
    const handleClear = () => {
        setComment("");
        setFile(null)

    }

    const handleSubmit = async () => {
        if (postId && (comment !== "" || file)) {
            try {
                console.log(comment)
                console.log(file)
                const config = {
                    headers: {

                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const formData = new FormData();
                formData.append("body", comment)
                formData.append("file", file ? file : "")


                const response = await axios.post(`/api/comment/${postId}`, formData, config)
                toast({
                    title: "Comment Added Successfully",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
                console.log(response.data)
                fetchComments(config);
                setComment("")
                setFile(null)

            } catch (error) {
                console.log("facing issue in uploading file from frontend", error.message)
                toast({
                    title: "Facing Issue In Adding Comment",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            }




        }
        else {
            toast({
                title: "Empty comment can't be posted",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    }

    return (
        <div>

            <FormControl>
                <FormLabel>Enter Comment</FormLabel>
                <Textarea width={"100%"} minHeight={"100px"}
                    size={"md"} placeholder='Write your comment here...'
                    name='comment' value={comment} onChange={handleChange} isRequired />
                <FormHelperText className='text-start'>Do not write inapropriate things !</FormHelperText>
            </FormControl>
            <Stack direction='row' spacing={0} className="flex items-end justify-end mt-0 p-0">

                <input
                    type='file'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <div onClick={handleClick} className='mx-0'>
                    <span className='text-gray-600 font-bold mx-1'> {file ? file.name : 'Attachment'}</span>
                    <IconButton variant={"outline"} icon={<AttachFileIcon className='text-bolder mx-0 hover:bg-slate-200' />} />
                </div>


                <Button colorScheme='blue' variant='ghost' onClick={handleClear}>
                    Clear<ClearIcon />
                </Button>
                <Button colorScheme='teal' variant='ghost' onClick={handleSubmit}>
                    Submit<LocalPostOfficeIcon />
                </Button>
            </Stack>
        </div>
    )
}
