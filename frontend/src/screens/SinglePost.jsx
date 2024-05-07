import React from 'react';
import PostPreview from '../components/postcomponents/PostPreview';
import CommentForm from '../components/commentsComponents/CommentForm';
import CommentPreview from '../components/commentsComponents/CommentPreview';
import { Container } from '@chakra-ui/react';

export default function SinglePost() {
    return (
        <Container maxW="container.lg" className="h-screen w-full overflow-y-auto container m-2 p-2">
            <div className="flex flex-col md:flex-row">
                <div className="bg-gray-400 font-mono border-solid border-2 border-black text-center p-4 w-full mx-2 mb-3 md:w-1/2 md:h-full" style={{ height: "700px" }}>
                    <PostPreview />
                </div>
                <div className="bg-white border-solid border-2 border-black text-center p-4 w-full md:w-1/2">
                    <div className="flex flex-col mb-3 h-full">
                        <h2 className="text-lg font-sans font-semibold mb-4">Comments</h2>
                        <div className='font-serif font-medium'>
                            <CommentForm />
                            <CommentPreview />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
