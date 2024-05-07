const asyncHandler = require("express-async-handler");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const { uploadAnyMultiple2, deleteFiles } = require("../config/uploadAnyMultiple2");
const Comment = require("../models/commentsModel");


const createPost = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const files = req.files;
    console.log(files)
    let attachments = {};
    if (!title || !content) {
        res.status(400);
        throw new Error("Enter All The Fields")
    }
    try {

        if (files.length > 0) {
            attachments = await uploadAnyMultiple2(files);
            console.log(attachments)

        }
    } catch (error) {
        console.log("Facing issues in uploading files", error.message)
    }
    const post = await Post.create({
        title,
        content,
        author: req.user._id,
        attachment: attachments
    })

    const creator = await User.findOne({ _id: req.user._id })
    if (post) {
        res.status(201).json(
            {

                title: post.title,
                content: post.content,

                author: creator.name,
                attachment: post.attachment

            }
        );
    }
    else {
        res.status(400);
        throw new Error("Problem in Creating User")
    }
})










const allPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find({});
        if (posts.length > 0) {
            res.send(posts);
        }
        else {
            res.send([])
        }
    } catch (error) {
        console.log("thier is some error fetching posts", error.message)
        res.status(500).send("Internal Server Error");
    }

})






const getPost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new Error("request Error ")
    }
    try {
        const post = await Post.findById(id);
        if (!post) {

            return res.status(404).json({ error: "Post not found" });
        }
        const fullPost = await post.populate({ path: "author" })
        res.status(200).json(fullPost);
    } catch (error) {

        console.log("Error fetching post:", error.message);
        res.status(500).json({ error: "Server error" });
    }


})






const deletePost = asyncHandler(async (req, res) => {
    let PostitemsDeleted = false;
    let commentsItemsDeleted = false;
    const { postId, attachments } = req.body;
    if (attachments) {
        PostitemsDeleted = await deleteFiles(attachments)
    }

    try {
        const postData = await Post.findById(postId).populate('reactions.comments', 'attachment');
        const commentsAttachments = postData.reactions.comments
            .filter(comment => comment.attachment.length > 0) // Filter out comments with empty attachment arrays
            .flatMap(comment => comment.attachment.map(attachment => attachment.url));

        if (commentsAttachments.length > 0) {
            commentsItemsDeleted = await deleteFiles(commentsAttachments)
        }

        const commentIds = postData.reactions.comments.map(comment => comment._id);

        // Delete all comments associated with the post
        await Comment.deleteMany({ _id: { $in: commentIds } });


        const deletedPost = await Post.findByIdAndDelete({ _id: postId });
        res.send({
            msg: `post Deleted of Id : ${deletedPost}`,
            PostitemsDeleted,
            commentsItemsDeleted
        })

    } catch (error) {
        console.log("error in deleting post", error.message)
        res.send({ error: "error in deleting post" });
    }



})





const updateReactions = asyncHandler(async (req, res) => {
    const { likesData, dislikesData } = req.body;
    const { id } = req.params;
    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (likesData !== undefined) {
            post.reactions.likes = likesData;
        }

        if (dislikesData !== undefined) {
            post.reactions.dislikes = dislikesData;
        }

        await post.save();
        res.status(200).json({ message: 'Reactions updated successfully', post });
    } catch (error) {
        console.log("Error in updating reactions", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});










const sendReport = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { reportMsg, violatedPolicy, author } = req.body;

    console.log('Received request to report post:', postId);

    if (!violatedPolicy) {
        throw new Error("Empty violated policy");
    }
    if (!postId || !author) {
        throw new Error("Empty postId or author id");
    }

    const report = {
        msg: reportMsg,
        type: violatedPolicy,
        author: author
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            console.log('Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }

        post.reactions.reports.push(report);
        await post.save();

        console.log('Report submitted successfully:', post);
        res.status(200).json({ message: 'Report submitted successfully', post });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






const fetchAll = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(404).json({ message: 'UserId not found on params' });
    }

    try {

        const allPosts = await Post.find({ author: userId });
        const allComments = await Post.find({})
            .populate({
                path: "reactions.comments",
                match: { author: userId } // Filter comments by author ID
            });


        let allReports = await Post.find({})
            .populate({
                path: "reactions.reports",

            });
        allReports = allReports.filter(post => post.reactions.reports.length > 0);
        res.status(200).json({ message: 'Fetch Successful', allPosts, allComments, allReports });


    } catch (error) {
        console.error('Error fetching all post data:', error);
        res.status(500).json({ message: 'Cant find POST Details?? Internal server error' });
    }

})











module.exports = { createPost, allPosts, getPost, deletePost, updateReactions, sendReport, fetchAll };