import { z } from 'zod';

const imeiSchema = z
  .string()
  .min(15, 'IMEI must be at lest 15 char long')
  .max(25, 'IMEI must be max 25 char length');

const latSchema = z.coerce
  .number()
  .min(-90, 'Latitude must be between -90 and 90')
  .max(90, 'Latitude must be between -90 and 90');

const lngSchema = z.coerce
  .number()
  .min(-180, 'Longitude must be between -180 and 180')
  .max(180, 'Longitude must be between -180 and 180');

const altitudeSchema = z.coerce.number().optional();

const speedSchema = z.coerce.number().min(0, 'Speed cannot be negative').optional();

const headingSchema = z.coerce.number().min(0).max(360).optional();

const batteryVoltageSchema = z.coerce.number().optional();

const ignitionSchema = z.boolean().default(false);

const timestampSchema = z.coerce.date();

// main schema which is gonna used in controler and sql query
export const createLocationLogSchema = z.object({
  body: z.object({
    imei: imeiSchema,
    lat: latSchema,
    lng: lngSchema,
    altitude: altitudeSchema,
    speed: speedSchema,
    heading: headingSchema,
    batteryVoltage: batteryVoltageSchema,
    ignition: ignitionSchema,
    timestamp: timestampSchema,
  }),
});

export const findLocationQuerySchema = z.object({
  query: z.object({
    imei: imeiSchema,
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    limit: z.coerce.number().min(1).max(5000).optional(),
  }),
});

export const locationIdParamSchema = z.object({
  params: z.object({
    locationId: z.uuid('Invalid location ID format'),
  }),
});

// Export types
export type CreateLocationLogInput = z.infer<typeof createLocationLogSchema>;
export type FindLocationQueryInput = z.infer<typeof findLocationQuerySchema>;
export type LocationIdParam = z.infer<typeof locationIdParamSchema>;
