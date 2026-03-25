/**
 * Barrel re-export for backward compatibility.
 *
 * All hooks are now split by domain in separate files.
 * New code should import directly from the domain-specific file:
 *   import { useVehiclesQuery } from '../hooks/useVehicleQueries';
 *
 * This file re-exports everything so existing imports still work.
 */
export { useVehiclesQuery, useCreateVehicleMutation, useUpdateVehicleMutation, useDeleteVehicleMutation } from './useVehicleQueries';
export { useGeofencesQuery, useCreateGeofenceMutation, useDeleteGeofenceMutation } from './useGeofenceQueries';
export { useUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from './useUserQueries';
export { useCompliancesQuery, useCreateComplianceMutation } from './useComplianceQueries';
