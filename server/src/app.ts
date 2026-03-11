import express, { NextFunction,Request,Response } from "express";
import cors from "cors"
import dotenv from "dotenv"

const app=express();

dotenv.config();

//setup ayncHanlder util to return respsonse in json
app.use((err:any,req:Request,res:Response,next:NextFunction)=>{
    res.status(err.statusCode??500).json({
        success:false,
        messsage:err.message??"internal server error",
        path: req.path,
        timeStamp:new Date().toISOString(),
    })
})