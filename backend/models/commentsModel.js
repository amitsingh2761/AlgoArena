const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
    name: String,
    url: String,
    mimetype: String
});


const commentsSchema = mongoose.Schema({
    body: { type: String, trim: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    attachment: { type: [attachmentSchema] },
    reactions: {
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 }

    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentsSchema);
module.exports = Comment;