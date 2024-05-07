import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router";
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import { Button, Container } from '@chakra-ui/react'

import moment from 'moment';
import InstagramIcon from '@mui/icons-material/Instagram';
import MessageIcon from '@mui/icons-material/Message';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';



export default function Activity() {
    const [userData, setUserData] = useState([])
    const [commentsData, setCommentsData] = useState([])
    const [reportsData, setReportsData] = useState([])
    const { user, setPostId, setAttachments } = ChatState();
    const [section, setSection] = useState("Posts")



    const history = useHistory();


    console.log(user._id)


    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchAllPosts = async () => {
            try {


                const response = await axios.get(`/api/post/allposts/${user._id}`);
                if (response.data) {
                    setUserData(response.data.allPosts);
                    setCommentsData(response.data.allComments);
                    setReportsData(response.data.allReports);

                } else {
                    console.log('Unable to fetch allposts');
                }
            } catch (error) {
                console.error('Error fetching All posts Data', error.message);
            }
        };
        fetchAllPosts();
    }, [user]);

    if (!user) {
        return null;
    }




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










    return (
        <Container maxW="container.lg" className="h-screen w-full overflow-y-auto container m-2 p-2">

            <div className="text-3xl font-bold font-mono">My Activities</div>



            <div className="inline-flex w-96 rounded-lg shadow-lg shadow-gray-700 my-2" role="group">
                <button onClick={() => { setSection("Posts") }} type="button" className="inline-flex items-center px-4 py-2 text-md font-extrabold text-sky-600 bg-transparent border border-sky-800 rounded-s-lg hover:bg-sky-600 hover:text-white focus:z-10 focus:ring-2 focus:ring-sky-600 focus:bg-sky-600 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                    <InstagramIcon className='mx-1' />
                    Posts
                </button>

                <button onClick={() => { setSection("Comments") }} type="button" className="inline-flex items-center px-4 py-2 text-md font-extrabold text-sky-600 bg-transparent border border-gray-900 hover:bg-sky-600 hover:text-white focus:z-10 focus:ring-2 focus:ring-sky-600 focus:bg-sky-600 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                    <MessageIcon className='mx-1' />
                    Comments
                </button>
                <button onClick={() => { setSection("Reports") }} type="button" className="inline-flex items-center px-4 py-2 text-md font-extrabold text-sky-600 bg-transparent border border-gray-900 rounded-e-lg hover:bg-sky-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-sky-600 focus:bg-sky-600 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                    <NotificationImportantIcon className='mx-1' />
                    Reports
                </button>
            </div>







            {(section === "Posts" || section === "All") &&
                <>
                    <div className="text-2xl font-bold font-mono text-center mt-8 ">My Posts</div>
                    <div className='flex flex-wrap justify-center gap-24 m-1 p-3 w-full mb-12'>
                        {userData.length ? (
                            userData.map((post, index) => (
                                <div key={index} className="flex flex-col font-serif font-medium rounded-lg bg-white text-surface  shadow-md shadow-gray-400 dark:bg-surface-dark dark:text-white">


                                    <iframe
                                        className="w-full rounded-t-lg object-cover h-48 md:!rounded-none md:!rounded-s-lg"
                                        src={`https://drive.google.com/file/d/${post.attachment[0].url}/preview`}
                                        title={post.title}
                                    ></iframe>



                                    <div className="flex flex-col justify-start p-6">

                                        <div className='flip-box'>
                                            <div className="flip-box-inner">

                                                <div className="flip-box-front shadow-lg shadow-gray-600">


                                                    <h5 className="mb-2 text-xl font-medium">{post.title}</h5>
                                                    <p className="mb-4 text-base">{truncateContent(post.content)}</p>
                                                    <p className="text-sm text-surface/75 dark:text-neutral-300">Created {moment(post.createdAt).fromNow()}</p>
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

                            ))) : (<>
                                <div className='w-full text-center text-2xl text-gray-500'>Posts not Available</div>
                            </>)
                        }
                    </div>
                </>

            }












            {(section === "Comments" || section === "All") && <>

                <div className="text-2xl font-bold font-mono text-center mt-8 ">My Comments</div>
                <div className='flex flex-wrap justify-center gap-12 m-3 p-3 mb-12'>

                    {
                        commentsData.map((comment, index) => (
                            comment.reactions.comments.map((innerComment, innerIndex) => (
                                <div key={`${index}-${innerIndex}`} className='w-96 h-60 shadow-2xl font-serif font-medium rounded-xl m-2 overflow-auto bg-white text-black'>




                                    <div className='w-full bg-white mx-auto px-6 py-4 rounded-lg m-2 p-2' key={innerIndex}>
                                        <div className='flex items-center mb-6'>

                                            <div>
                                                <div className='text-lg font-medium text-gray-800'>
                                                    <a href={`/${innerComment.author.username}`} className='text-blue-500 hover:underline'>
                                                        {innerComment.author.name}
                                                    </a>
                                                </div>
                                                <div className='text-gray-500'>{moment(innerComment.createdAt).fromNow()}</div>
                                            </div>



                                        </div>
                                        <p className='text-lg leading-relaxed mb-6 text-start'>{innerComment.body}</p>

                                        <Button colorScheme='gray' className="block mx-auto"
                                            onClick={() => {

                                                handleClick(comment._id, comment.attachment)
                                            }}
                                        >View Comment</Button>
                                    </div>

                                </div>

                            ))))

                    }

                </div>
            </>
            }


















            {(section === "Reports" || section === "All") && <>
                <div className="text-2xl font-bold font-mono text-center mt-8 ">Reports</div>
                <div className='flex flex-wrap justify-center gap-12 m-3 p-3 mb-12'>

                    {reportsData.length ? (
                        reportsData.map((report, index) => (
                            report.reactions.reports.map((innerReport, innerIndex) => (
                                <div key={`${index}-${innerIndex}`} className='w-80 h-auto font-serif font-medium shadow-xl m-2 text-center overflow-hidden text-black'>




                                    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">


                                        <img className="rounded-t-lg" src="https://t3.ftcdn.net/jpg/01/93/90/82/360_F_193908219_ak4aB1PzlhizUVGLOVowzHICc3tl6WeX.jpg" alt="" />


                                        <div className="p-5">

                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{innerReport.type}</h5>

                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{innerReport.msg || "description not provided by user"}</p>
                                            <div onClick={() => handleClick(report._id, report.attachment)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                View Post
                                                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>






                                </div>
                            ))
                        ))) : (<>
                            <div className='w-full text-center text-2xl text-gray-500'>Reports not Available</div>
                        </>)
                    }

                </div>
            </>
            }




        </Container>

    );
}
