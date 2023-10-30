import jwt from "jsonwebtoken"


export const verifyAuth=(req,res,next)=>{
   
try{
    // const token=req.cookies.jwt;
    const token=req.headers.authorization?req.headers.authorization.split(" ")[1]:req.cookies.jwt;
    jwt.verify(token,process.env.JWT_KEY,async(error,payload)=>{
        if(error){
           return res.status(403).send("you are not logged in")
        }
        req.userId=payload?.userId;
        next();
    })


}catch(err){
    console.log(err)
}
}