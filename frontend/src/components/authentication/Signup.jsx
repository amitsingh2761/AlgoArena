import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import {
    VStack, FormControl, FormLabel, Input,
    InputGroup, InputRightElement, Button
} from "@chakra-ui/react"
export default function Signup() {

    const toast = useToast()
    const history = useHistory();


    const [credentials, setCredentials] = useState({
        name: "", email: "", password: "", confirmPassword: ""
    });


    const [pic, setPic] = useState();


    const [picLoading, setPicLoading] = useState(false);

    const [show, setShow] = useState(false);


    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }


    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        console.log(pics);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "webChat");
            data.append("cloud_name", "vguide");
            fetch("https://api.cloudinary.com/v1_1/vguide/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {

                    setPic(data.url.toString());
                    console.log(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
    };


    const handleSubmit = async () => {
        setPicLoading(true);
        if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
            toast({
                title: "Please Fill all the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
        if (credentials.password !== credentials.confirmPassword) {
            toast({
                title: "Passwords do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user/signup",
                {

                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                    pic: pic
                },
                config
            );
            console.log(data);
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            history.push("/main");
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
        }
    }




    return (
        <VStack
            spacing={5}
            align='stretch'
        >
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter your name' value={credentials.name} name='name' onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter your email' type='email' value={credentials.email} name='email' onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input placeholder='Enter your Password' value={credentials.password} type={show ? "text" : "password"} name='password' onChange={handleChange} />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={() => { setShow(!show) }}>
                            {show ? "Hide" : "Show"}
                        </Button></InputRightElement>
                </InputGroup>

            </FormControl >
            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input placeholder='Confirm Password' value={credentials.confirmPassword} type='password' name='confirmPassword' onChange={handleChange} />
            </FormControl>
            <FormControl>
                <FormLabel>Upload Profile Pic</FormLabel>
                <Input placeholder='Add Pic' name='pic' type='file' p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0])} />
            </FormControl>
            <Button
                colorScheme='blue' width="100%"
                style={{ marginTop: 15 }} onClick={handleSubmit}
                isLoading={picLoading}>Sign Up</Button>
        </VStack>
    )
}
