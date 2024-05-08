import React, { useState } from 'react';
import axios from "axios";
import { VStack, FormControl, FormLabel, Input, Button, Textarea } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import { useToast } from '@chakra-ui/react'


export default function CreatePost() {
    const [credentials, setCredentials] = useState({ title: "", content: "" });
    const [files, setFiles] = useState([]);
    const { user, setMenuOption } = ChatState();
    const toast = useToast();
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const fileList = Array.from(e.target.files);
        setFiles(fileList);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const formData = new FormData();
            formData.append("title", credentials.title);
            formData.append("content", credentials.content);

            if (files.length > 0) {
                files.forEach((file, index) => {
                    formData.append(`files`, file);
                });
            }

            const response = await axios.post(`/api/post/create`, formData, config);
            toast({
                title: "Post Created Successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });

            console.log(response.data);
            setMenuOption("Home")

        } catch (error) {
            console.log(error.message);
            toast({
                title: "Facing Issue in Creating Post",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    };

    return (
        <div className='container sm:w-3/4 md:w-1/2 lg:w-1/2 mx-auto overflow-auto'>
            <div className='bg-white p-6 mt-5 mb-0 h-auto rounded-lg shadow-2xl'>
                <VStack spacing={5} align="center">
                    <FormControl isRequired>
                        <FormLabel>Post Title</FormLabel>
                        <Input placeholder='Enter Post Title' value={credentials.title} name='title' onChange={handleChange} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Post Content</FormLabel>
                        <Textarea isInvalid placeholder='Enter Post Content' name='content' value={credentials.content} onChange={handleChange} minHeight={150} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Add Attachments</FormLabel>
                        <Input placeholder='Add Attachments' name='files' type='file' multiple p={1.5} onChange={handleFileChange} />
                    </FormControl>
                    <Button colorScheme='blue' width="100%" style={{ marginTop: 15 }} onClick={handleSubmit}>Create Post</Button>
                </VStack>
            </div>
        </div>
    );
}
