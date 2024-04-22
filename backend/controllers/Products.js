import Products from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getProduts = async(req,res)=>{
    try {
        let response;
        if(req.role === "admin"){
            response = await Products.findAll({
                attributes: ['uuid', 'name','price'],
                include : [{
                    model:User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Products.findAll({
                attributes: ['uuid', 'name','price'],
                where:{
                
                    userId : req.userId
                },
                include : [{
                    model:User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ms:error.message});
    }
}

export const getProdutsById = async(req,res)=>{
    try {
        const product = await Products.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Data Tidak Ditemukan"});

        let response;
        if(req.role === "admin"){
            response = await Products.findOne({
                attributes: ['uuid', 'name','price'],
                where:{
                    id: product.id
                },
                include : [{
                    model:User,
                    attributes:['name','email']
                }]
            });
        }else{
            response = await Products.findOne({
                attributes: ['uuid', 'name','price'],
                where:{
                    [Op.and]:[{id : product.id},{userId : req.userId}]
                },
                include : [{
                    model:User,
                    attributes:['name','email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ms:error.message});
    }
}

export const createProduts = async(req,res)=>{
    const {name,price,} = req.body;
    try {
        await Products.create({
            name:name,
            price:price,
            userId: req.userId
        });
        res.status(201).json({msg:"Product Created Succesfully"});
    } catch (error) {
        res.status(500).json({ms:error.message});
    }
}

export const updateProduts = async(req,res)=>{
    try {
        const product = await Products.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Data Tidak Ditemukan"});

        const {name,price,} = req.body;
        if(req.role === "admin"){
            await Products.update({name,price},{
                where :{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg:"Akses Terlarang"})
            await Products.update({name,price},{
                where:{
                    [Op.and]:[{id : product.id},{userId : req.userId}]
                },
            });
        }
        res.status(200).json({msg:"Product Updated Sucessfully"});
    } catch (error) {
        res.status(500).json({ms:error.message});
    }
}

export const deleteProduts = async(req,res)=>{
    try {
        const product = await Products.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!product) return res.status(404).json({msg: "Data Tidak Ditemukan"});

        const {name,price,} = req.body;
        if(req.role === "admin"){
            await Products.destroy({
                where :{
                    id: product.id
                }
            });
        }else{
            if(req.userId !== product.userId) return res.status(403).json({msg:"Akses Terlarang"})
            await Products.destroy({
                where:{
                    [Op.and]:[{id : product.id},{userId : req.userId}]
                },
            });
        }
        res.status(200).json({msg:"Product Deleted Sucessfully"});
    } catch (error) {
        res.status(500).json({ms:error.message});
    }
}