import logger from "../services/logger/logger.js";


//this function will catch any type of error any log
//it in after that it will throw that


export interface ServiceError {
    statusCode: number
    message: string
    stack?: string
    service: string
    operation: string
}

export function catchService<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    service: string,
    operation: string,
) {
    return async (...args: T): Promise<R> => {
        try {

            const result=await(fn(...args))
            logger.info(`[${service}]-[${operation}] success`)
            return result

        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));

            const statusCode=(error as any)?.statusCode??500

            logger.error(`[${service}] [${operation}] failed`, {
                statusCode,
                message: err.message,
                stack: err.stack
            }) //onWhich service, on what operation 

            const serviceError: ServiceError = {
                statusCode,
                message: err.message,
                stack: err.stack,
                service,
                operation
            }

            throw serviceError

        }
    }
}