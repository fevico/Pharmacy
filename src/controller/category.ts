import { RequestHandler } from "express";
import categoryModel from "src/model/category";

export const create: RequestHandler = async (req, res) =>{
    const {name, image} = req.body;
    const categoryExist = await categoryModel.findOne({name});
    if(categoryExist) return res.status(400).json({message: "Category already exist"});
    const category = new categoryModel({name, image});
    await category.save();
    res.status(201).json({message: "Category created successfully"});
}

export const getAll: RequestHandler = async (req, res) =>{
    const categories = await categoryModel.find();
    if(!categories) return res.status(404).json({message: "No categories found"});
    res.status(200).json(categories);
}

export const getOne: RequestHandler = async (req, res) =>{
    const {id} = req.params;
    const category = await categoryModel.findById(id);
    if(!category) return res.status(404).json({message: "Category not found"});
    res.status(200).json(category);
}

export const update: RequestHandler = async (req, res) =>{
    const {id} = req.params;
    const {name, image} = req.body;
    const category = await categoryModel.findByIdAndUpdate(id, {name, image}, {new: true});
    if(!category) return res.status(404).json({message: "Category not found"});
    res.status(200).json({message: "Category updated successfully"});
}

export const deleteCategory: RequestHandler = async (req, res) =>{
    const {id} = req.params;
    const category = await categoryModel.findByIdAndDelete(id); 
        
    if(!category) return res.status(404).json({message: "Category not found"});
    
    res.status(200).json({message: "Category deleted successfully"});
}