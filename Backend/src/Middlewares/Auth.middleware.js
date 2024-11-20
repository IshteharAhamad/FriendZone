import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
});
 const VerifyToken=async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        console.log(token)
        if(!token){
            return res.status(401).json({ message: "Unauthrized request!" });
        }
        const decode= jwt.verify(token, process.env.ACCESS_TOKEN);
        req.userId=decode.id;
        next()
        
    } catch (error) {
        // return res.status(500).json(error.message); 
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" });
          }
    }
 }
 export {VerifyToken}