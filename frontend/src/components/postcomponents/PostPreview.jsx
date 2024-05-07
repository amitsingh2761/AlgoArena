import React, { useEffect, useState } from 'react';
import FilesSlider from './FilesSlider';
import { Button, useToast } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import ReportModal from "../../screens/ReportModal"


import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { DeleteIcon } from '@chakra-ui/icons';

export default function PostPreview() {



    const [post, setPost] = useState({});
    const { postId, user, attachments } = ChatState();

    const { _id, title, content, author, reactions } = post;


    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [likesToggle, setLikesToggle] = useState(false);
    const [dislikesToggle, setDislikesToggle] = useState(false);



    const toast = useToast();


    if (!postId) {
        throw new Error("postId not available");
    }

    const fetchSinglePost = async () => {
        try {
            const response = await axios.get(`/api/post/${postId}`);
            if (response.data) {
                setPost(response.data);

            } else {
                console.log('Unable to fetch data');
            }
        } catch (error) {

            console.error('Error fetching single postData', error.message);
            toast({
                title: "Error fetching single postData",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };


    const sendReactions = async (updatedLikes, updatedDislikes) => {
        try {
            if (_id) {
                const response = await axios.put(`/api/post/${_id}`, {
                    likesData: updatedLikes,
                    dislikesData: updatedDislikes,


                },
                    config
                )
                console.log(response.data);
            }
        } catch (error) {
            console.log("error in sending reactions", error.message)
        }

    }


    useEffect(() => {
        fetchSinglePost();

    }, [likes, dislikes]);






















    const history = useHistory();

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };



    console.log("postId:", _id);


    const handleReactions = async (reaction) => {
        if (reaction === 'likes') {
            setLikes(prevLikes => prevLikes + 1);

            setLikesToggle(!likesToggle)
            const likesButton = document.getElementById("likes")
            likesButton.setAttribute("disabled", true)
            const dislikesbutton = document.getElementById("dislikes")
            dislikesbutton.setAttribute("disabled", true)


            await sendReactions(likes + 1, dislikes);

        } else if (reaction === 'dislikes') {
            setDislikes(prevDislikes => prevDislikes + 1);


            setDislikesToggle(!dislikesToggle)
            const likesButton = document.getElementById("likes")
            likesButton.setAttribute("disabled", true)
            const dislikesbutton = document.getElementById("dislikes")
            dislikesbutton.setAttribute("disabled", true)
            await sendReactions(likes, dislikes + 1);
        }



    };










    const handleDelete = async () => {
        try {
            if (_id) {
                const response = await axios.post(`/api/post/delete`, {
                    postId: _id,
                    attachments: attachments ? attachments : [],
                });
                console.log(response.data);
                toast({
                    title: "Post Deleted Successfully",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
                history.push("/allposts");
            }
        } catch (error) {
            toast({
                title: "Facing Issue In Deleting Post",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            console.log("Error in Deleting Post", error.message);

        }
    };

    useEffect(() => {
        if (reactions) {
            setLikes(reactions.likes);
            setDislikes(reactions.dislikes);
        }
    }, [reactions]);







    return (
        <div className='container mx-0 py-2'>
            <FilesSlider />
            <div className="bg-white rounded-md shadow-md shadow-gray-800 p-4 mt-4">
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-gray-700 mb-4">{content}</p>
                <p className="text-gray-500">Author: {author && author.name}</p>
                <button className="text-gray-500 mx-2" id='likes'>
                    Likes {!likesToggle ? <ThumbUpOffAltIcon onClick={() => handleReactions('likes')} /> : <ThumbUpAltIcon />}  {likes}
                </button>
                <button className="text-gray-500 mx-2" id='dislikes'>
                    Dislikes {!dislikesToggle ? <ThumbDownOffAltIcon onClick={() => handleReactions('dislikes')} /> : <ThumbDownAltIcon />}  {dislikes}
                </button>
                <div className='flex items-end justify-end'>
                    {author && author._id === user._id && <Button colorScheme='red' variant={"solid"} alignSelf={"end"} onClick={handleDelete}><DeleteIcon /></Button>}
                </div>
                <div className='flex items-end justify-end'>
                    {author && author._id !== user._id && <ReportModal authorName={author.name} />}
                </div>

            </div>
        </div>
    );
}
