import logger from '../services/logger/logger.ts';

//this function will catch any type of error any log
//it in after that it will throw that

export interface ServiceError {
  statusCode: number;
  message: string;
  stack?: string;
  service: string;
  operation: string;
}

export function catchService<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  service: string,
  operation: string
) {
  return async (...args: T): Promise<R> => {
    try {
      const result = await fn(...args);
      logger.info(`[${service}]-[${operation}] success`);
      return result;
    } catch (error: any) {
      const err = error instanceof Error ? error : new Error(String(error));
      const statusCode = error?.statusCode ?? 500;

      // --- Prisma-specific details ---
      const prismaCode = error?.code;            // e.g. P2002, P2025
      const prismaMeta = error?.meta;            // { target: ['email'] }
      const prismaClientVersion = error?.clientVersion;
      const prismaErrorName = error?.constructor?.name; // PrismaClientKnownRequestError

      // Safely serialize the arguments that were passed to the DB call
      let calledWith: string;
      try {
        calledWith = JSON.stringify(args, null, 2);
      } catch {
        calledWith = '[unserializable]';
      }

      // Build a detailed error block for the console
      console.error(`\n========== DB ERROR ==========`);
      console.error(`Service   : ${service}`);
      console.error(`Operation : ${operation}`);
      console.error(`Error Type: ${prismaErrorName ?? err.name}`);
      if (prismaCode)          console.error(`Prisma Code : ${prismaCode}`);
      if (prismaMeta)          console.error(`Prisma Meta : ${JSON.stringify(prismaMeta)}`);
      if (prismaClientVersion) console.error(`Client Ver  : ${prismaClientVersion}`);
      console.error(`Message   : ${err.message}`);
      console.error(`Called With: ${calledWith}`);
      console.error(`Stack:\n${err.stack}`);
      console.error(`==============================\n`);

      // Also log via winston for file-based logs
      logger.error(`[${service}] [${operation}] failed`, {
        statusCode,
        prismaCode,
        prismaMeta,
        prismaClientVersion,
        errorType: prismaErrorName ?? err.name,
        message: err.message,
        calledWith,
        stack: err.stack,
      });

      const serviceError: ServiceError = {
        statusCode,
        message: err.message,
        stack: err.stack,
        service,
        operation,
      };

      throw serviceError;
    }
  };
}
