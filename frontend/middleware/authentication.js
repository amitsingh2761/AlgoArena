const isCommentsAuthor = (userId, authorId) => {

    if (userId === authorId) {
        return userId;
    }
    return false;
}

module.exports = { isCommentsAuthor }