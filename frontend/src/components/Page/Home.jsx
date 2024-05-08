import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router";
import { ChatState } from '../../context/ChatProvider';
import { Container } from '@chakra-ui/react'
import { CircularProgress } from '@chakra-ui/react'

import './styles/Home.css';
import moment from 'moment';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const { setPostId, setAttachments } = ChatState();

    const history = useHistory();
    const fetchPosts = async () => {
        try {
            const response = await axios.get(`/api/post`);
            if (response.data) {
                setPosts(response.data);
            } else {
                console.log('Unable to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error.message);
        }
    };

    const handleClick = (postId, attachment) => {
        setPostId(postId)
        const arr = attachment.map((item, index) => item.url)
        setAttachments(arr);
        history.push("/single")
    }

    // Function to truncate content to 18 words
    const truncateContent = (content) => {
        const words = content.split(' ');
        if (words.length > 18) {
            return words.slice(0, 18).join(' ') + '...';
        }
        return content;
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Container maxW="container.lg" className="h-screen w-full overflow-y-auto container m-2 p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.length ? (
                    posts.map((post, index) => (
                        <div key={index} className="flex flex-col font-serif font-medium rounded-lg bg-white text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white">
                            <iframe
                                className="w-full rounded-t-lg object-cover h-48 md:!rounded-none md:!rounded-s-lg"
                                src={`https://drive.google.com/file/d/${post.attachment[0].url}/preview`}
                                title={post.title}
                            ></iframe>
                            <div className="flex flex-col justify-start p-6">

                                <div className='flip-box'>
                                    <div className="flip-box-inner">

                                        <div className="flip-box-front shadow-lg shadow-gray-600">


                                            <h5 className="mb-2 text-xl font-bold">{post.title}</h5>
                                            <p className="mb-4 text-base">{truncateContent(post.content)}</p>
                                            <p className="text-xs text-surface/75 dark:text-neutral-300">Created {moment(post.createdAt).fromNow()}</p>
                                        </div>

                                        <div className="flip-box-back">
                                            <button
                                                onClick={() => handleClick(post._id, post.attachment)}
                                                className='mt-auto font-extrabold py-2 px-4 rounded absolute bottom-0 left-0 right-0 top-0'
                                            >
                                                View Post
                                            </button>

                                        </div>


                                    </div>


                                </div>


                            </div>
                        </div>
                    ))
                ) : (

                    <CircularProgress isIndeterminate color='green.300' />
                )}
            </div>
        </Container >
    );
}
