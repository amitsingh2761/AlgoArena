import { Button } from '@chakra-ui/react';
import React from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

export default function ErrorPage() {
    const history = useHistory();
    return (
        <div className="container">
            <div className='text-center my-auto text-gray-600 text-4xl'>404 Page Not Found
                <br />
                <Button className='block m-3 p-3 text-2xl font-extrabold' colorScheme='blackAlpha' onClick={() => { history.push("/main") }} variant={"outline"}>Go To Home Page</Button>
            </div></div>
    )
}
