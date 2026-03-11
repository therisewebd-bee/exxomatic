import net from "net"
import logger from "../services/logger/logger"


//creating a tcp server to accept request 
const startTcpServer = async (): Promise<void> => {
    const server = net.createServer((socket) => {
        logger.info(`[tcp] device connected:${socket.remoteAddress}`)
        socket.on('data', (data: Buffer) => {
            const rawData = data.toString().trim()
            logger.info(`data from ${socket.remoteAddress} sender : ${rawData} `)
            socket.write('ACK\r\n');
        })

        socket.on('close', () => {
            // don't write here — socket already closed
            logger.info('[tcp] device disconnected')
        })

        socket.on('error', (err) => {
            logger.error(`[tcp] error: ${err.message}`)
        })
    })
    

    server.listen(5000,()=>{
        logger.info('[tcp] server up')
    })
}

export default startTcpServer;