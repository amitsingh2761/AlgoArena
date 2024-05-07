const mongoose = require("mongoose");
const Comment = require("./commentsModel")
// Define attachment schema
const attachmentSchema = new mongoose.Schema({
    fname: String,
    url: String,
    mimetype: String
});

const reportSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    type: String,
    msg: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

// Define post schema
const postSchema = new mongoose.Schema({
    title: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        trim: true
    },

    attachment: {
        type: [attachmentSchema] // Use the attachment schema here
    },
    reactions: {
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }],
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        reports: [reportSchema]
    }
}, { timestamps: true });



const Post = mongoose.model("Post", postSchema);
module.exports = Post;
