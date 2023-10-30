import { PrismaClient } from '@prisma/client'
import prisma from '../lib/prisma.js';

export const addGoods=async (req,res,next)=>{
    try{
        // const prisma=new PrismaClient();
        let goods;
        if(req.body.goods.length){
            req.body.goods.forEach(async (s)=>{
               goods = await prisma.goods.create({
                    data:{
                      description:s.description,
                      category:s.category,
                      unitPrice:parseInt(s.unitPrice),
                      retailPrice:parseInt(s.retailPrice),
                      wholesalePrice:parseInt(s.wholesalePrice)
                    }
                })     
            })
            return res.status(201).json({success:true})
            
        }
     

    }catch(err){
        res.status(500).send("Internal server error")
    }
}

export const addCategory=async (req,res,next)=>{
    try{

        // const prisma=new PrismaClient();

        
    
            const category=await prisma.categories.create({
                data:{
                    category:req.body.category
                }
            })
            if(category){
                return res.status(201).json({success:true})
            }

    
        

    }catch(err){
        res.status(500).send("Internal server error")
    }
}

export const getCategory=async (req,res,next)=>{
    try{
        // const prisma= new PrismaClient();
        const cat=await prisma.categories.findMany({
            where:{}
        })
        if(cat){
            return res.status(200).json({cat})
        }

    }catch(err){
        res.status(500).send("Internal server error")
    }
}

export const updateGoods=async (req,res,next)=>{
    try{
        // const prisma= new PrismaClient();
        if(req.body.update){
            req.body.update.forEach(async ({id,ind})=>{
                await prisma.goods.update({
                    where:{id:parseInt(id)},
                    data:{
                        description:req.body.goods[ind].description,
                        retailPrice:parseInt(req.body.goods[ind].retailPrice),
                        wholesalePrice:parseInt(req.body.goods[ind].wholesalePrice),
                        unitPrice:parseInt(req.body.goods[ind].unitPrice),
                        category:req.body.goods[ind].category
                    }
                })
            })
        }
            
            return res.status(200).send("update succesful")
         

    }catch(err){
        res.status(500).send("Internal server error")
    }
}

export const deleteGoods=async (req,res,next)=>{
    try{
        // const prisma= new PrismaClient();

        if(req.body.dele){
            req.body.dele.forEach(async (id)=>{
                await prisma.goods.delete({
                    where:{id:parseInt(id)}
                })
            })
        }
        
            return res.status(200).send("deleted successfully")
    }catch(err){
        res.status(500).send("Internal server error")
    }
}