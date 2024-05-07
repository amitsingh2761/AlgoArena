const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")
const Post = require("../models/postModel")
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !password || !email) {
        res.status(400);
        throw new Error("Enter All The Fields")
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("Email Already in Use")
    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    })

    if (user) {
        res.status(201).json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            }
        );
    }
    else {
        res.status(400);
        throw new Error("Problem in Creating User")
    }
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.status(201).json(
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            }
        );

    }
})
// /api/user?search
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});



const fetchUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400);
        throw new Error("User Id Not Found iN Params")
    }

    try {
        const user = await User.findOne({ _id: id });
        const posts = await Post.find({ author: id });
        const postsLength = posts.length;
        res.status(201).json({ user, postsLength });
    } catch (error) {
        res.status(400);
        throw new Error("Error in Fetching User")
    }

})

const people = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    try {
        const allUsers = await User.find({ _id: { $ne: userId } }); // Find all users where the _id is not equal to userId
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(400).json({ message: 'Error in Fetching People' });
    }
});


const setFollowers = asyncHandler(async (req, res) => {
    const { userId, reqId } = req.body;
    try {
        const user = await User.findOne({ _id: userId });
        const reqUser = await User.findOne({ _id: reqId });
        user.followers.push(reqId);
        reqUser.following.push(userId);
        await user.save();
        await reqUser.save();
        res.status(200).json({ msg: "success" });
    } catch (error) {
        res.status(400).json({ message: 'Error in setting followers' });
    }
})



const setUnFollowers = asyncHandler(async (req, res) => {
    const { userId, reqId } = req.body;
    try {
        const user = await User.findOne({ _id: userId });
        const reqUser = await User.findOne({ _id: reqId });
        user.followers.pop(reqId);
        reqUser.following.pop(userId);
        await user.save();
        await reqUser.save();
        res.status(200).json({ msg: "success" });
    } catch (error) {
        res.status(400).json({ message: 'Error in setting Unfollowers' });
    }
})


const setFriends = asyncHandler(async (req, res) => {
    const { userId, reqId } = req.body;
    try {
        const user = await User.findOne({ _id: userId });
        const reqUser = await User.findOne({ _id: reqId });
        user.Friends.push(reqId);
        reqUser.Friends.push(userId);
        await user.save();
        await reqUser.save();
        res.status(200).json({ msg: "success" });
    } catch (error) {
        res.status(400).json({ message: 'Error in setting friends' });
    }
})



module.exports = { registerUser, authUser, setFriends, setFollowers, setUnFollowers, allUsers, fetchUser, people }