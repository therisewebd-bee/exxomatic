import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"
import path from "node:path"

const logger=winston.createLogger({
    level:process.env.LOG_LEVEL || "info",

    format:winston.format.combine(
        winston.format.timestamp({format:'YYYY-MM-DD HH:mm:ss'}),
        winston.format.errors({stack:true}),
        winston.format.json()
    ),

    transports:[
        new winston.transports.Console({
            format:winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),

        //file rotation
        new DailyRotateFile({
            filename:path.join(process.cwd(),"logs", "app-%DATE%.log"),
            datePattern:"YYYY-MM-DD",
            maxFiles:'14d',
            maxSize:"10m",
            zippedArchive:true,
        }),

        //log error only

        new DailyRotateFile({
            filename:path.join(process.cwd(),"logs", "error-%DATE%.log"),
            datePattern:"YYYY-MM-DD",
            level:"error",
            maxFiles:'30d',
            maxSize:"10m",
            zippedArchive:true,
        }),
    ]
})

export default logger;