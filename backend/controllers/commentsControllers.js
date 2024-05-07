const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentsModel");
const { uploadAnyFile, deleteSingleFile } = require("../config/uploadAnyMultiple2")
const Post = require("../models/postModel")
const User = require("../models/userModel")
const createComment = asyncHandler(async (req, res) => {
    const { file } = req;
    const { body } = req.body;
    const { postId } = req.params;
    let attachment = {};


    try {
        if (file) {
            attachment = await uploadAnyFile(file);
        }
        console.log(attachment)
    } catch (error) {
        console.log("Problem in adding attachment", error.message);
        throw new Error("Error adding attachment");
    }

    try {
        const comment = await Comment.create({
            body,
            attachment,
            author: req.user._id,
        });

        const post = await Post.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }

        post.reactions.comments.push(comment);
        await post.save();

        const creator = await User.findById({ _id: req.user._id });

        if (!creator) {
            throw new Error("User not found");
        }

        return res.status(201).json({
            body: comment.body,
            attachment: comment.attachment,
            author: creator.name

        });
    } catch (error) {
        console.log("Error creating comment", error.message);
        throw new Error("Error creating comment");
    }
});





const getComment = asyncHandler(async (req, res) => {

    const { postId } = req.params;
    if (postId) {
        try {
            const post = await Post.findOne({ _id: postId })
                .populate({
                    path: 'reactions.comments',
                    populate: {
                        path: 'author',
                        model: 'User'
                    }
                });
            const comments = post.reactions.comments;
            res.send(comments)


        } catch (error) {
            console.log("conflict in fetching comments", error.message)
        }
    }
    else {
        res.sendStatus("400").send("postId not Found")
    }
})


const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;
        const { attachment } = req.body;

        // First, delete the comment
        const deletedComment = await Comment.findByIdAndDelete({ _id: commentId });

        // Check if the comment was found and deleted
        if (!deletedComment) {
            return res.status(404).send("CommentId not Found");
        }

        // Delete the attachment if it exists
        let isAttachmentDeleted = false;
        if (attachment) {
            try {
                isAttachmentDeleted = await deleteSingleFile(attachment);
            } catch (error) {
                console.log("Error in deleting comment attachment file", error.message);
            }
        }

        // Send the deleted comment and attachment deletion status in the response
        res.send({ deletedComment, isAttachmentDeleted });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});




module.exports = { createComment, getComment, deleteComment };

