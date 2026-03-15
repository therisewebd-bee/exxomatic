import { z } from 'zod';

const imeiSchema = z
  .string()
  .min(15, 'IMEI must be at lest 15 char long')
  .max(25, 'IMEI must be max 25 char length');

const vehicleNumbSchema = z
  .string()
  .min(3, 'Vehicle number must be at lest 3 char long')
  .max(25, 'Vehicle number must be max 25 char length');

const customerIdSchema = z.uuid('CustomerId must be a valid UUID');

// main schema which is gonna used in controler and sql query
export const createVehicleSchema = z.object({
  body: z.object({
    imei: imeiSchema,
    vechicleNumb: vehicleNumbSchema,
    customerId: customerIdSchema,
    geofenceIds: z.array(z.uuid()).optional(),
  }),
});

export const updateVehicleSchema = z.object({
  body: z.object({
    imei: imeiSchema.optional(),
    vechicleNumb: vehicleNumbSchema.optional(),
    customerId: customerIdSchema.optional(),
    geofenceIds: z.array(z.uuid()).optional(),
  }),
});

export const findVehicleQuerySchema = z.object({
  query: z.object({
    customerId: customerIdSchema.optional(),
    imei: z.string().optional(),
    vechicleNumb: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
  }),
});

export const vehicleIdParamSchema = z.object({
  params: z.object({
    vehicleId: z.uuid('Invalid vehicle ID format'),
  }),
});

// Export types
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type FindVehicleQueryInput = z.infer<typeof findVehicleQuerySchema>;
export type VehicleIdParam = z.infer<typeof vehicleIdParamSchema>;
