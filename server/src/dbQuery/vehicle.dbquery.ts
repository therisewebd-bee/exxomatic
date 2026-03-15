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
    
    const vehicle = await prismaAdapter.vehicleInfo.create({
        data: {
            ...body
        }
    });

    if (geofenceIds && geofenceIds.length > 0) {
        await prismaAdapter.vehiclesOnGeofences.createMany({
            data: geofenceIds.map(gId => ({
                vehicleId: vehicle.id,
                geofenceId: gId
            }))
        });
    }

    return vehicle;
}, "DB-Call:Vehicle", "Vehicle Creation");

const updateVehicle = catchService(async (vID: VehicleIdParam, vehicleDataScheam: UpdateVehicleInput) => {
    const { geofenceIds, ...body } = vehicleDataScheam.body;
    const { vehicleId } = vID.params;

    const vehicle = await prismaAdapter.vehicleInfo.update({
        where: {
            id: vehicleId
        },
        data: {
            ...body
        }
    });

    if (geofenceIds) {
        // Sync relations
        await prismaAdapter.vehiclesOnGeofences.deleteMany({
            where: { vehicleId: vehicleId }
        });

        if (geofenceIds.length > 0) {
            await prismaAdapter.vehiclesOnGeofences.createMany({
                data: geofenceIds.map(gId => ({
                    vehicleId: vehicleId,
                    geofenceId: gId
                }))
            });
        }
    }

    return vehicle;
}, "DB-Call:Vehicle", "Update Vehicle");

const deleteVehicle = catchService(async (vID: VehicleIdParam) => {
    const { vehicleId } = vID.params;

    // Explicitly delete relations first
    await prismaAdapter.vehiclesOnGeofences.deleteMany({
        where: { vehicleId: vehicleId }
    });

    return await prismaAdapter.vehicleInfo.delete({
        where: {
            id: vehicleId
        }
    });
}, "DB-Call:Vehicle", "Delete Vehicle");

const findVehicleById = catchService(async (vID: VehicleIdParam) => {
    const { vehicleId } = vID.params;

    return await prismaAdapter.vehicleInfo.findUnique({
        where: {
            id: vehicleId
        },
        include: {
            geofences: {
                include: {
                    geofence: true
                }
            }
        }
    });
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
            geofences: {
                include: {
                    geofence: true
                }
            }
        },
        skip: (page - 1) * limit,
        take: limit
    });
}, "DB-Call:Vehicle", "Find Vehicles");

export {
    createVehicle,
    updateVehicle,
    deleteVehicle,
    findVehicleById,
    findVehicles
};
