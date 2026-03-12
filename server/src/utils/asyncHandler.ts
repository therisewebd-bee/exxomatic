import { Request,Response,NextFunction } from "express";
import logger from "../services/logger/logger.js";


const AsyncHandler=(requestHanlder:(req:Request,res:Response,next:NextFunction)=>Promise<any>)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        Promise.resolve(requestHanlder(req,res,next)).catch((error:any)=>{
            logger.error(`[${req.method}] ${req.path}`,{
                message:error.message,
                stack:error.stack
            })

            res.status(error.statusCode??500).json({
                success:false,
                message:error.message??"internal server error",
                path:req.path,
                timeStamp:new Date().toISOString()
            })
        })
    }

}

export default AsyncHandler