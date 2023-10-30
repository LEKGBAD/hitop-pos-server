import { PrismaClient } from '@prisma/client'
import prisma from '../lib/prisma.js';


export const SubmitSale=async (req,res,next)=>{
    let valid=true;
    req.body.sale.forEach(({description,salesPrice,quantity,amount,unitPrice,costPrice})=>{
        if(!description || !salesPrice || !quantity || !amount || !unitPrice ||!costPrice){
            valid=false
            return
        }
    })
    try{
        if(valid){
        // const prisma=new PrismaClient();
        const sale=await prisma.sales.create({
            data:{
                total:parseInt(req.body.total),
                costPrice:parseInt(req.body.costP),
                paid:parseInt(req.body.paid),
                name:req.body.name,
                phoneNumer:req.body.number,
                discount:parseInt(req.body.discount),
                owing:parseInt(req.body.owing),
                saleId:Date.now()+req.body.teller,
                payment:[parseInt(req.body.paid)],
                change:parseInt(req.body.change),
                mode:req.body.mode
            }
        })

        if(sale){
            req.body.sale.forEach(async (s)=>{
                await prisma.items.create({
                    data:{
                      description:s.description,
                      category:s.category,
                      costPrice:s.costPrice,
                      salesPrice:s.salesPrice,
                      unitPrice:s.unitPrice,
                      amount:s.amount,
                      quantity:parseFloat(s.quantity),
                      sale: { connect:{id:sale.id} }
                    }
                })
            })
            
            const s=await prisma.sales.findUnique({
                where:{id:sale.id},
                include:{items:true}
            })
            return res.status(200).json({s:{sale:req.body.sale,...s},success:true})
        } 
    }
    else{
        res.status(200).json({success:false})
    }
     
        

    }catch(err){

    }
}

export const getGoods = async (req,res,next)=>{

    try{
        
        // const prisma=new PrismaClient();
        const good=await prisma.goods.findMany({
            where:{}
        });
        if(good){
            return res.status(200).json({good})
        }

    }catch(err){
       return res.status(500).send("Internal server error")
    }
}

export const getSales = async (req,res,next)=>{

    try{
        // const prisma=new PrismaClient();
        const sale=await prisma.sales.findMany({
            where:{},
            include:{items:true,payments:true}
        });
        if(sale){
            return res.status(200).json({sale})
        }

    }catch(err){
       return res.status(500).send("Internal server error")
    }
}

export const itemsFilter = async (req,res,next)=>{
    
    
    const today=new Date();
    let data={}
    if(req.body.start){
        data={...data,
            createdAt: {
                lte: new Date(Date.parse(today)+86340000+59000+999),
                gte: new Date(req.body.start),
              },  
        }}
    if(req.body.end){
        data={...data,
            createdAt: {
                lte: new Date(Date.parse(req.body.end)+86340000+59000+999),
                gte: new Date(req.body.start),
              },  
        }
    }
    if(req.body.category){
        data={...data,category:{contains:req.body.category,mode:'insensitive'}}
    }
    
    if(req.body.product){
        data={...data,description:{contains:req.body.product,mode:'insensitive'}}
        }
    
    try{
        // const prisma=new PrismaClient();
        const items=await prisma.items.findMany({
            where:{
                ...data
            }, 
     })
     const {_sum:{quantity:quantity}}=await prisma.items.aggregate({
        where:{
            ...data
        },
        _sum:{quantity:true}
    })
       
        return res.status(200).json({filtItem:items,quantity})
    }catch(err){
       return res.status(500).send("Internal server error")
    }
}

export const makePayment = async (req,res,next)=>{
    try{
        // const prisma=new PrismaClient();
        if(req.body.paid && req.body.saleId)
       { 
        const newPay=await prisma.payments.create({
            data:{
                amount:parseInt(req.body.paid),
                teller:req.userId.toString(),
                sale: { connect:{id:parseInt(req.body.id)} }
            }
        })
        
        if(newPay){
        const sale=await prisma.sales.findMany({
            where:{
                saleId:req.body.saleId
            },
            include:{payments:true}
        })
        // 
        let s=sale[0].payments.map(({amount})=>amount).reduce((am,acc)=>Number(am)+acc)+sale[0].paid;
        const totalPayment=sale[0].payments.reduce((val,acc)=>val.amount+acc)+parseInt(req.body.paid);
        const owin=sale[0].total-sale[0].discount-s
        const pa=[...sale[0].payment,parseInt(req.body.paid)]
        const paym=await prisma.sales.update({
            data:{
                payment:pa,
                owing:owin
            },
            where:{
                id:sale[0].id
            }
        })
        if(paym){
            return res.status(200).json({success:true,ppp:sale[0].payments})
        }
    }
    }

    }catch(err){
       return res.status(500).send("Internal server error")
    }
}

export const getItems = async (req,res,next)=>{

    try{
        // const prisma=new PrismaClient();
        const item=await prisma.items.findMany({
            where:{},
        });
        if(item){
            return res.status(200).json({item})
        }

    }catch(err){
       return res.status(500).send("Internal server error")
    }
}

export const salesFilter = async (req,res,next)=>{
    
    const today=new Date();
    let data={}
    if(req.body.start){
        data={...data,
            createdAt: {
                lte: new Date(Date.parse(today)+86340000+59000+999),
                gte: new Date(req.body.start),
              },  
        }}
    if(req.body.end){
        data={...data,
            createdAt: {
                lte: new Date(Date.parse(req.body.end)+86340000+59000+999),
                gte: new Date(req.body.start),
              },  
        }
    }
    if(req.body.category){
        data={...data,
            items:{some:{category:{contains:req.body.category,mode:'insensitive'}}},
        }
    }
    if(req.body.name){
        data={...data,name:{contains:req.body.name,mode:'insensitive'}}
    }
    if(req.body.product){
        data={...data,
            items:{some:{description:{contains:req.body.product,mode:'insensitive'}}},
        }
    }
    if(req.body.saleId){
        data={...data,saleId:{contains:req.body.saleId,mode:'insensitive'}}
    }
    if(req.body.phoneNumber){
        data={...data,phoneNumer:{contains:req.body.phoneNumber,mode:'insensitive'}}
    }
    if(req.body.mode){
        data={...data,mode:{contains:req.body.mode,mode:'insensitive'}}
    }
    if(req.body.owing){
        data={...data,owing:{gte:1}}
    }

    try{
        // const prisma=new PrismaClient();
        const sales=await prisma.sales.findMany({
            where:{
                ...data
            },
            include:{items: true}  
     })
     const {_sum:{owing:owing}}=await prisma.sales.aggregate({
        where:{
            ...data
        },
        _sum:{owing:true}
    })

       
        return res.status(200).json({filtSale:sales,owing})
    }catch(err){
       return res.status(500).send("Internal server error")
    }
}
export const deleteSale = async (req,res,next)=>{
    try{
        // const prisma=new PrismaClient();
        const sale=await prisma.sales.delete({
            where:{id:parseInt(req.body.id)},
        });
        if(sale){
            return res.status(200).json({sale})
        }

    }catch(err){
        console.log(err)
       return res.status(500).send("Internal server error")
    }
}
