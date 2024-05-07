import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router";
import { ChatState } from '../context/ChatProvider';

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const { setPostId, setAttachments } = ChatState();

    const history = useHistory();
    const fetchPosts = async () => {
        try {
            const response = await axios.get('/api/post');
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


    useEffect(() => {
        fetchPosts();
    }, []);



    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
            {posts.length ? (
                posts.map((post, index) => (
                    <div key={index} className="flex flex-col rounded-lg m-3 bg-white text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white md:max-w-xl md:flex-row min-w-[200px] max-h-[350px] overflow-hidden">
                        <iframe
                            className="w-full h-auto md:h-auto rounded-t-lg object-cover md:w-48 md:!rounded-none md:!rounded-s-lg"
                            src={`https://drive.google.com/file/d/${post.attachment[0].url}/preview`}
                            title={post.title}
                        ></iframe>
                        <div className="flex flex-col justify-start p-6">
                            <h5 className="mb-2 text-xl font-medium">{post.title}</h5>
                            <p className="mb-4 text-base">{post.content}</p>
                            <p className="text-xs text-surface/75 dark:text-neutral-300">Last updated 3 mins ago</p>
                            <button
                                className='mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                onClick={() => {
                                    handleClick(post._id, post.attachment);
                                }}
                            >View Post</button>
                        </div>
                    </div>
                ))
            ) : (
                <></>
            )}
        </div>
    );

}
