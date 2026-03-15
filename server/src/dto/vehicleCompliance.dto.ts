import { z } from "zod";


const vehicleIdSchema = z.uuid("VehicleId must be a valid UUID")


const fuelQuantitySchema = z.coerce.number().min(0, "Fuel quantity cannot be negative")


const fuelRateSchema = z.coerce.number().min(0, "Fuel rate cannot be negative")


const totalCostSchema = z.coerce.number().min(0, "Total cost cannot be negative")


const filledLatSchema = z.coerce.number().min(-90).max(90).optional()


const filledLngSchema = z.coerce.number().min(-180).max(180).optional()


const filledAddressSchema = z.string().max(255, "Address must be max 255 char long").optional()


const filledBySchema = z.string().min(2).max(100, "Name must be max 100 char long")


const receiptUrlSchema = z.string().url("Invalid URL format").max(500).optional()


const filledAtSchema = z.coerce.date()


// main schema which is gonna used in controler and sql query    
export const createVehicleComplianceSchema = z.object({
    body: z.object({
        vehicleId: vehicleIdSchema,
        fuelQuantity: fuelQuantitySchema,
        fuelRate: fuelRateSchema,
        totalCost: totalCostSchema,
        filledLat: filledLatSchema,
        filledLng: filledLngSchema,
        filledAddress: filledAddressSchema,
        filledBy: filledBySchema,
        receiptUrl: receiptUrlSchema,
        filledAt: filledAtSchema
    })
})


export const updateVehicleComplianceSchema = z.object({
    body: z.object({
        vehicleId: vehicleIdSchema.optional(),
        fuelQuantity: fuelQuantitySchema.optional(),
        fuelRate: fuelRateSchema.optional(),
        totalCost: totalCostSchema.optional(),
        filledLat: filledLatSchema.optional(),
        filledLng: filledLngSchema.optional(),
        filledAddress: filledAddressSchema.optional(),
        filledBy: filledBySchema.optional(),
        receiptUrl: receiptUrlSchema.optional(),
        filledAt: filledAtSchema.optional()
    })
})


export const findVehicleComplianceQuerySchema = z.object({
    query: z.object({
        vehicleId: vehicleIdSchema.optional(),
        filledBy: z.string().optional(),
        page: z.coerce.number().min(1).optional(),
        limit: z.coerce.number().min(1).max(100).optional()
    })
})

export const complianceIdParamSchema = z.object({
    params: z.object({
        complianceId: z.uuid('Invalid compliance ID format'),
    }),
});

// Export types
export type CreateVehicleComplianceInput = z.infer<typeof createVehicleComplianceSchema>;
export type UpdateVehicleComplianceInput = z.infer<typeof updateVehicleComplianceSchema>;
export type FindVehicleComplianceQueryInput = z.infer<typeof findVehicleComplianceQuerySchema>;
export type ComplianceIdParam = z.infer<typeof complianceIdParamSchema>;
