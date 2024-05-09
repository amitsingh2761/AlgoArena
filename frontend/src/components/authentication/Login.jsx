import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { useToast } from '@chakra-ui/react'

import axios from "axios"
import {
    VStack, FormControl, FormLabel, Input,
    InputGroup, InputRightElement, Button
} from "@chakra-ui/react"
export default function Login() {


    const [credentials, setCredentials] = useState({
        email: "", password: ""
    });


    const toast = useToast();
    const history = useHistory();


    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);



    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }


    const handleSubmit = async () => {


        setLoading(true);
        if (!credentials.email || !credentials.password) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                `/api/user/login`,
                { email: credentials.email, password: credentials.password },
                config
            );

            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            // setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
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
            setLoading(false);
        }


    }
    return (
        <VStack
            spacing={5}
            align='stretch'
        >

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

            <Button
                colorScheme='blue' width="100%"
                style={{ marginTop: 15 }} onClick={handleSubmit} isLoading={loading}>Login</Button>
            <Button
                colorScheme='red' variant="solid" width="100%"
                style={{ marginTop: 15 }} onClick={(e) => { setCredentials({ email: "guest@example.com", password: "123456" }) }}>Get Guest User Credentials</Button>
        </VStack>
    )
}
