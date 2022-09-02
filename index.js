const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())


mongoose.connect(URI, (err)=>{
    console.log("Mongoose is now online")
})

const userRouter = require("./routes/user.route")
app.use("/user", userRouter);

const walletRouter = require("./routes/wallet.route")
app.use("/wallet", walletRouter);

app.use(express.static("build"))
app.get("/*", (req, res)=>{
    res.sendFile(__dirname+ "/build/index.html")
})


app.listen(PORT, ()=>{
    console.log("App is online at localhost:"+PORT)
})
