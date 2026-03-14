import { prismaAdapter } from "./dbInit.js";
import { CreateGeofenceInput, UpdateGeofenceInput, FindGeofenceQueryInput, GeofenceIdParam } from "../dto/geofence.dto.js";
import { catchService } from "../utils/utilHandler.js";



//GDS here stands for Geofence Data Schema
//catchServcie here is a highOrder fucntion 
//whcih track , error in case the db call fails
//using other two parameter it is possible to
//trace out error propley

const createGeofence = catchService(async (geofenceDataScheam: CreateGeofenceInput) => {
    const { vehicleIds, ...body } = geofenceDataScheam.body;
    return await prismaAdapter.geofence.create({
        data: {
            ...body,
            vehicles: vehicleIds ? {
                connect: vehicleIds.map(id => ({ id }))
            } : undefined
        }
    })
}, "DB-Call:Geofence", "Geofence Creation");

const updateGeofence = catchService(async (gID: GeofenceIdParam, geofenceDataScheam: UpdateGeofenceInput) => {
    const { vehicleIds, ...body } = geofenceDataScheam.body;
    return await prismaAdapter.geofence.update({
        where: {
            id: gID.params.geofenceId
        },
        data: {
            ...body,
            vehicles: vehicleIds ? {
                set: vehicleIds.map(id => ({ id }))
            } : undefined
        }
    })
}, "DB-Call:Geofence", "Update Geofence");

const deleteGeofence = catchService(async (gID: GeofenceIdParam) => {
    return await prismaAdapter.geofence.delete({
        where: {
            id: gID.params.geofenceId
        }
    })
}, "DB-Call:Geofence", "Delete Geofence");

const findGeofenceById = catchService(async (gID: GeofenceIdParam) => {
    return await prismaAdapter.geofence.findUnique({
        where: {
            id: gID.params.geofenceId
        },
        include: {
            vehicles: true
        }
    })
}, "DB-Call:Geofence", "Find Geofence By Id");

const findGeofences = catchService(async (findGDS: FindGeofenceQueryInput) => {
    const { name, isActive, page = 1, limit = 10 } = findGDS.query;
    return await prismaAdapter.geofence.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive'
            },
            isActive
        },
        include: {
            vehicles: true
        },
        skip: (page - 1) * limit,
        take: limit
    })
}, "DB-Call:Geofence", "Find Geofences");
