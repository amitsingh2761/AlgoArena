import React, { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import moment from 'moment';
import { Button, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';



export default function CommentPreview() {
    const { postId, user, comments, setComments, fetchComments } = ChatState();

    const toast = useToast();





    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const handleDelete = async (id, url) => {
        try {
            const response = await axios.delete(`/api/comment/${id}`, { data: { attachment: url }, headers: config.headers });
            if (response) {
                toast({
                    title: "Comment Deleted Successfully",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                // Refresh comments after deletion
                fetchComments(config);
            }
        } catch (error) {
            console.log('error in deleting comment', error.message);
            toast({
                title: "Facing Issue in Deleting Comments",
                status: "info",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };


    useEffect(() => {
        fetchComments(config);

    }, [postId, user, setComments]);


    return (
        <div className='container mt-7'>

            {console.log(comments)}

            {comments &&
                comments.map((comment, index) => (
                    <div className='w-full mx-auto border shadow-sm shadow-gray-600 px-6 py-4 rounded-lg m-2 p-2' key={index}>
                        <div className='flex items-center mb-6'>
                            <img src={comment.author.pic} alt='Avatar' className='w-12 h-12 rounded-full mr-4' />
                            <div>
                                <div className='text-lg font-medium text-gray-800'>
                                    <a href={`/${comment.author.username}`} className='text-blue-500 hover:underline'>
                                        {comment.author.name}
                                    </a>
                                </div>
                                <div className='text-gray-500'>{moment(comment.createdAt).fromNow()}</div>
                            </div>

                            <div className='justify-items-end ml-auto '>
                                {user._id === comment.author._id && (
                                    <Button colorScheme='red' variant='outline' onClick={() => handleDelete(comment._id, comment.attachment.url)}>
                                        <DeleteIcon />
                                    </Button>
                                )}

                            </div>

                        </div>
                        <p className='text-lg leading-relaxed mb-6 text-start'>{comment.body}</p>
                        {comment.attachment && <div className='justify-center w-full'>
                            {comment.attachment.map((attachment, attachmentIndex) => (
                                <a href={`https://drive.google.com/file/d/${attachment.url}/preview`}>
                                    {attachment.url && <> <span className='flex text-start mb-1 text-gray-400'>One Attachment:</span><iframe
                                        src={`https://drive.google.com/file/d/${attachment.url}/preview`}
                                        className='w-1/2  rounded-lg'
                                        height={"100px"}
                                        key={attachmentIndex}
                                    ></iframe></>}
                                </a>
                            ))
                            }
                        </div>}

                    </div>
                ))}
        </div>
    );
}
