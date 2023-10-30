import { genSalt,hash,compare } from "bcrypt";
import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js";

const generatePassword=async (password)=>{
    const salt=await genSalt();
    return await hash(password,salt);
}

const maxAge=3*24*60*60;

const createToken=(email,userId)=>{
return jwt.sign({email,userId},process.env.JWT_KEY,{
    expiresIn:maxAge
})
}

export const addTeller=async (req,res,next)=>{
    try{
        // const prisma=new PrismaClient();
        const {loginId,password,firstName,lastName}=req.body;
        if(loginId && password){
            const user=await prisma.users.create({
                data:{loginId,password:await generatePassword(password),firstName,lastName} 
            })
            // return res.cookie("jwt",createToken(email,user.id),{
            //     httpOnly:false,
            //     maxAge:maxAge*1000
            // }).status(201).json({id:user.id,email:user.email})
            return res.status(201).json({user:{id:user.id,loginId:user.loginId}})

        }
        return res.status(400).send("Email and password required")
        
    }catch(err){
        console.log(err);
        return res.status(500).send("Leke Internal Server Error");
    }
}

export const login=async (req,res,next)=>{
    try{
        // const prisma=new PrismaClient();
        const {loginId,password}=req.body;
        if(loginId && password){
            const user=await prisma.users.findUnique({
                where:{loginId}
            })
            if(!user){
                return res.status(400).send("User not found")
            }
            const auth=await compare(password,user.password)
            if(!auth){
                return res.status(400).send("incorrect Password")
            }
            return res.cookie("jwt",createToken(loginId,user.id),{
                httpOnly:false,
                maxAge:maxAge*1000
            }).status(200).json({user:{id:user.id,loginId:user.loginId}})
        }
        return res.status(400).send("Email and password required")
        
    }catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
}

export const getUser=async (req,res,next)=>{
    
    try{
        // const prisma=new PrismaClient();
        const user=await prisma.users.findUnique({
            where:{id:req.userId}
        })
        if(!user){
            return res.status(400).send("User not found")
        }
        delete user.password;
        return res.cookie("jwt",createToken(user.email,user.id),{
            httpOnly:false,
            maxAge:maxAge*1000
        }).status(200).json({user:{...user}})

    }catch(err){

    }
}

export const getUsers=async (req,res,next)=>{
    
    try{
        // const prisma=new PrismaClient();
        const user=await prisma.users.findMany({
            where:{}
        })
        if(!user){
            return res.status(400).send("User not found")
        }
        return res.status(200).json({user})

    }catch(err){

    }
}

export const updateUsers=async (req,res,next)=>{
    try{
        // const prisma= new PrismaClient();
        if(req.body.update){
            req.body.update.forEach(async ({id,ind})=>{
                await prisma.users.update({
                    where:{id:parseInt(id)},
                    data:{
                        loginId:req.body.users[ind].loginId,
                        firstName:req.body.users[ind].firstName,
                        lastName:req.body.users[ind].lastName,
                    }
                })
            })
        }
            
            return res.status(200).send("update succesful")
         

    }catch(err){
        res.status(500).send("Internal server error")
    }
}

export const deleteUsers=async (req,res,next)=>{
    try{
        // const prisma= new PrismaClient();

        if(req.body.dele){
            req.body.dele.forEach(async (id)=>{
                await prisma.users.delete({
                    where:{id:parseInt(id)}
                })
            })
        }
        
            return res.status(200).send("deleted successfully")
    }catch(err){
        res.status(500).send("Internal server error")
    }
}

export const changePassword=async (req,res,next)=>{
    try{
        const {currentPassword,newPassword,confirmNewPassword}=req.body;
        // const prisma= new PrismaClient();

        if(currentPassword && newPassword && confirmNewPassword){
            const user=await prisma.users.findUnique({
                where:{
                    id:req.userId
                }
            })
            if(user){
                const auth=await compare(currentPassword,user.password)
            if(!auth){
                return res.status(200).json({mess:"incorrect Password"})
            }
            if(newPassword === confirmNewPassword){
            const upd=await prisma.users.update({
                data:{
                    password:await generatePassword(newPassword)
                },
                where:{id:req.userId}
            }) 
            return res.status(200).json({user:{id:user.id}})
            }
            else{
                return res.status(200).json({mess:"New Password and Confirm New Password mismatch"})
            }
            }
        }
        else{
            res.status(400).send("current password,new password and confirm new password are needed");
        }

        
    }catch(err){
        res.status(500).send("Internal server error")
    }
}

export const setUserInfo=async (req,res,next)=>{

    try{
        
        const {username,fullName,description}=req.body;
        if(username && fullName && description){

            // const prisma=new PrismaClient();
        const us=await prisma.user.findUnique({
            where:{username}
        })
        if(us){
           return res.json({usernameError:true})
        }
        else
            await prisma.user.update({
                where:{id:req.userId},
                data:{
                    username:username,
                    fullName:fullName,
                    description:description,
                    isProfileInfoSet:true
                }
            })
           return res.status(200).send("updated succesfully");
        }
        else{
            return res.status(400).send("fill required fields")
        }
        
        


    }catch(err){
        res.status(500).send("internal server error")
    }
}