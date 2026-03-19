import { z } from 'zod';

const nameSchema = z
  .string()
  .min(2, 'Name must be at lest 2 char long')
  .max(50, 'Name must be max 50 char length');

// zone field represents Unsupported("geometry") in Prisma, expects GeoJSON object
const zoneSchema = z.record(z.string(), z.any());

const zoneHashSchema = z.string().length(32).optional();

const isActiveSchema = z.boolean().default(true);

// main schema which is gonna used in controler and sql query
export const createGeofenceSchema = z.object({
  body: z.object({
    name: nameSchema,
    zone: zoneSchema,
    zoneHash: zoneHashSchema,
    isActive: isActiveSchema,
    vehicleIds: z.array(z.uuid()).optional(),
  }),
});

export const updateGeofenceSchema = z.object({
  body: z.object({
    name: nameSchema.optional(),
    zone: zoneSchema,
    zoneHash: zoneHashSchema,
    isActive: isActiveSchema.optional(),
    vehicleIds: z.array(z.uuid()).optional(),
  }),
});

export const findGeofenceQuerySchema = z.object({
  query: z.object({
    name: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    imei: z.coerce.string().optional(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
  }),
});
export const geofenceIdParamSchema = z.object({
  params: z.object({
    geofenceId: z.uuid('Invalid geofence ID format'),
  }),
});

// Export types
export type CreateGeofenceInput = z.infer<typeof createGeofenceSchema>;
export type UpdateGeofenceInput = z.infer<typeof updateGeofenceSchema>;
export type FindGeofenceQueryInput = z.infer<typeof findGeofenceQuerySchema>;
export type GeofenceIdParam = z.infer<typeof geofenceIdParamSchema>;
