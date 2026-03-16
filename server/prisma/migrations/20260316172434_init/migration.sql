-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Customer');

-- CreateTable
CREATE TABLE "VehicleInfo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "imei" VARCHAR(25) NOT NULL,
    "vechicleNumb" VARCHAR(25) NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationLog" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "imei" VARCHAR(25) NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "lng" DECIMAL(65,30) NOT NULL,
    "altitude" DECIMAL(65,30),
    "speed" DECIMAL(65,30),
    "heading" DECIMAL(65,30),
    "batteryVoltage" DOUBLE PRECISION,
    "ignition" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(80) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'Customer',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Geofence" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "zone" geometry,
    "zoneHash" VARCHAR(32),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Geofence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehiclesOnGeofences" (
    "vehicleId" UUID NOT NULL,
    "geofenceId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehiclesOnGeofences_pkey" PRIMARY KEY ("vehicleId","geofenceId")
);

-- CreateTable
CREATE TABLE "VehicleCompliance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vehicleId" UUID NOT NULL,
    "fuelQuantity" DECIMAL(65,30) NOT NULL,
    "fuelRate" DECIMAL(65,30) NOT NULL,
    "totalCost" DECIMAL(65,30) NOT NULL,
    "filledLat" DECIMAL(65,30),
    "filledLng" DECIMAL(65,30),
    "filledAddress" VARCHAR(255),
    "filledBy" VARCHAR(100) NOT NULL,
    "receiptUrl" VARCHAR(500),
    "filledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleCompliance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleInfo_imei_key" ON "VehicleInfo"("imei");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleInfo_vechicleNumb_key" ON "VehicleInfo"("vechicleNumb");

-- CreateIndex
CREATE INDEX "VehicleInfo_imei_idx" ON "VehicleInfo"("imei");

-- CreateIndex
CREATE INDEX "VehicleInfo_vechicleNumb_idx" ON "VehicleInfo"("vechicleNumb");

-- CreateIndex
CREATE INDEX "VehicleInfo_customerId_idx" ON "VehicleInfo"("customerId");

-- CreateIndex
CREATE INDEX "LocationLog_imei_timestamp_idx" ON "LocationLog"("imei", "timestamp");

-- CreateIndex
CREATE INDEX "LocationLog_timestamp_idx" ON "LocationLog"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Geofence_zoneHash_key" ON "Geofence"("zoneHash");

-- CreateIndex
CREATE INDEX "Geofence_zoneHash_idx" ON "Geofence"("zoneHash");

-- CreateIndex
CREATE INDEX "VehicleCompliance_vehicleId_filledAt_idx" ON "VehicleCompliance"("vehicleId", "filledAt");

-- CreateIndex
CREATE INDEX "VehicleCompliance_filledAt_idx" ON "VehicleCompliance"("filledAt");

-- AddForeignKey
ALTER TABLE "VehicleInfo" ADD CONSTRAINT "VehicleInfo_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationLog" ADD CONSTRAINT "LocationLog_imei_fkey" FOREIGN KEY ("imei") REFERENCES "VehicleInfo"("imei") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehiclesOnGeofences" ADD CONSTRAINT "VehiclesOnGeofences_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "VehicleInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehiclesOnGeofences" ADD CONSTRAINT "VehiclesOnGeofences_geofenceId_fkey" FOREIGN KEY ("geofenceId") REFERENCES "Geofence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleCompliance" ADD CONSTRAINT "VehicleCompliance_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "VehicleInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
