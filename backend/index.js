require("dotenv").config();

const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const postRoutes = require("./routes/postRoutes");
const commentsRoutes = require("./routes/commentsRoutes")
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

connectDB(); // Start/connect to the DB
const app = express();



const setPermissionsPolicyHeader = (req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(self "https://example.com")'); // Example policy, adjust as needed
    next();
};
// Apply middleware to set Permissions-Policy header
app.use(setPermissionsPolicyHeader);



app.use(express.json());


app.get("/", (req, res) => {

    res.send("Home");
});




app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentsRoutes)

// //------------------------DEPLOYEMENT---------------------------------------
// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname1, "/frontend/build")));

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//     })
// }
// else {
//     app.get("/", (req, res) => {
//         res.send("API is running successfully")
//     });
// }


// //-----------------------------------------------------------------------------
//error handling
app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 5000;


const server = app.listen(port, () => {
    console.log(`app listening on PORT ${port}`);
});

//socket io
const io = require("socket.io")(
    server, {
    pingTimeout: 60000,
    cors: { origin: "https://algoarena-frontend.onrender.com", }
}
)

io.on("connection", (socket) => {
    console.log("connected to socket.io")
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id)

        socket.emit("connected");
    });


    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });


    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));




    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });


    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });

});