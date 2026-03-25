-- DropForeignKey
ALTER TABLE "VehiclesOnGeofences" DROP CONSTRAINT "VehiclesOnGeofences_geofenceId_fkey";

-- DropForeignKey
ALTER TABLE "VehiclesOnGeofences" DROP CONSTRAINT "VehiclesOnGeofences_vehicleId_fkey";

-- CreateIndex
CREATE INDEX "VehiclesOnGeofences_geofenceId_idx" ON "VehiclesOnGeofences"("geofenceId");

-- CreateIndex
CREATE INDEX "VehiclesOnGeofences_vehicleId_idx" ON "VehiclesOnGeofences"("vehicleId");

-- AddForeignKey
ALTER TABLE "VehiclesOnGeofences" ADD CONSTRAINT "VehiclesOnGeofences_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "VehicleInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehiclesOnGeofences" ADD CONSTRAINT "VehiclesOnGeofences_geofenceId_fkey" FOREIGN KEY ("geofenceId") REFERENCES "Geofence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
