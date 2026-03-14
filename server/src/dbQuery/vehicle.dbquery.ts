import { prismaAdapter } from "./dbInit.js";
import { CreateVehicleInput, UpdateVehicleInput, FindVehicleQueryInput, VehicleIdParam } from "../dto/vehicle.dto.js";
import { catchService } from "../utils/utilHandler.js";



//VDS here stands for Vehicle Data Schema
//catchServcie here is a highOrder fucntion 
//whcih track , error in case the db call fails
//using other two parameter it is possible to
//trace out error propley

const createVehicle = catchService(async (vehicleDataScheam: CreateVehicleInput) => {
    const { geofenceIds, ...body } = vehicleDataScheam.body;
    return await prismaAdapter.vehicleInfo.create({
        data: {
            ...body,
            geofech: geofenceIds ? {
                connect: geofenceIds.map(id => ({ id }))
            } : undefined
        }
    })
}, "DB-Call:Vehicle", "Vehicle Creation");

const updateVehicle = catchService(async (vID: VehicleIdParam, vehicleDataScheam: UpdateVehicleInput) => {
    const { geofenceIds, ...body } = vehicleDataScheam.body;
    return await prismaAdapter.vehicleInfo.update({
        where: {
            id: vID.params.vehicleId
        },
        data: {
            ...body,
            geofech: geofenceIds ? {
                set: geofenceIds.map(id => ({ id }))
            } : undefined
        }
    })
}, "DB-Call:Vehicle", "Update Vehicle");

const deleteVehicle = catchService(async (vID: VehicleIdParam) => {
    return await prismaAdapter.vehicleInfo.delete({
        where: {
            id: vID.params.vehicleId
        }
    })
}, "DB-Call:Vehicle", "Delete Vehicle");

const findVehicleById = catchService(async (vID: VehicleIdParam) => {
    return await prismaAdapter.vehicleInfo.findUnique({
        where: {
            id: vID.params.vehicleId
        },
        include: {
            geofech: true
        }
    })
}, "DB-Call:Vehicle", "Find Vehicle By Id");

const findVehicles = catchService(async (findVDS: FindVehicleQueryInput) => {
    const { customerId, imei, vechicleNumb, page = 1, limit = 10 } = findVDS.query;
    return await prismaAdapter.vehicleInfo.findMany({
        where: {
            customerId,
            imei,
            vechicleNumb
        },
        include: {
            geofech: true
        },
        skip: (page - 1) * limit,
        take: limit
    })
}, "DB-Call:Vehicle", "Find Vehicles");
