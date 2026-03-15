//import data parser , primsa file and query from db
//this code has somekind of the race conditon 
import logger from "../logger/logger.js"
interface BufferedLocation {
    vehicleId: number
    latitude: number
    longitude: number
    speed: number
    altitude: number
    heading: number
    ignition: boolean
    batteryVoltage: number
    timestamp: Date
}

//creating a in-memory buffer , so db call can be reduce 
//as data will come every 10s
//and a o(1) lookup can be done

let locationBuffer = new Map<number, BufferedLocation>()
let isFlushing = false
let flushTimer: ReturnType<typeof setInterval> | null = null


//GpsData is data fromat of the 
//in-which it's interpreter


const bufferedLocation = (vehicleId: number, gps: GPSData): void => {
    locationBuffer.set(vehicleId, {
        vehicleId,
        latitude: gps.latitude,
        longitude: gps.longitude,
        speed: gps.speed,
        altitude: gps.altitude,
        heading: gps.heading,
        ignition: gps.ignition,
        batteryVoltage: gps.batteryVoltage,
        timestamp: new Date()
    })
}

const flushBuffer = async (): Promise<void> => {

    if (isFlushing || locationBuffer.size === 0) return

    isFlushing = true
    const snapshot = new Map(locationBuffer);
    locationBuffer.clear()//this clear data so new update data can come after maxTime
    //and snapshot is copy , make sure data is store correctly

    try {
        const latestLocations = [...snapshot.values()]
        //call prisma query here to store data
        logger.info(`[buffer] upserted ${latestLocations.length} vehicles`)
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))

        logger.error('[buffer] flush failed', {
            message: err.message,
            stack: err.stack
        })

        if (locationBuffer.size === 0) locationBuffer = new Map(snapshot)
    }
    finally {
        isFlushing = false;
    }

}

//seting a 2 min timer
//so data can be updated on db itself
const startFlushTimer = (): void => {
    if (flushTimer) return
    flushTimer = setInterval(flushBuffer, 120000)
    logger.info('[buffer] flush timer started — every 2 minutes')
}

// flush remaining on shutdown
process.on('SIGTERM', async () => {
    logger.info('[buffer] SIGTERM received — flushing before shutdown')
    if (flushTimer) clearInterval(flushTimer)
    await flushBuffer()
})