import express from 'express';
import ConnectDatabase from './Database/DBConnection.js';
import dotenv from 'dotenv';
import cors from 'cors';
const app=express();

dotenv.config({
    path:'./.env'
});

//// middlewares ///
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"lo",
    methods:["POST","GET","PATCH","DELETE"],
    credentials:true
}))
/// routers////////
import userRouter from './Routers/user.router.js'
app.use("/api/v1/user",userRouter)
////////// Listening server port ///////
app.listen(8000,()=>{
    console.log(`Server running on post: 8000`)
})
