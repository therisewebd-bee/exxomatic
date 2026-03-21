const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const BATCH_SIZE = 5000;
const TOTAL_VEHICLES = 100000;

const hashGeofence = (zone) => {
  const normalized = JSON.stringify(zone, Object.keys(zone).sort());
  return crypto.createHash('md5').update(normalized).digest('hex');
};

const generateGlobalZone = () => ({
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-180.0, -90.0],
        [180.0, -90.0],
        [180.0, 90.0],
        [-180.0, 90.0],
        [-180.0, -90.0],
      ],
    ],
  },
});

const generateUniqueZone = (index) => {
  const lat = (index % 170) - 85; 
  const lng = (index % 350) - 175;
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [lng, lat],
          [lng + 0.1, lat],
          [lng + 0.1, lat + 0.1],
          [lng, lat + 0.1],
          [lng, lat],
        ],
      ],
    },
  };
};

async function main() {
  console.log(`🚀 Starting Database Stress Seeder for ${TOTAL_VEHICLES} Vehicles...`);

  // 1. Fetch Admin User
  const user = await prisma.user.findFirst({ where: { role: 'Admin' } });
  if (!user) {
      throw new Error("No Admin user found. Please register an admin first.");
  }
  console.log(`👤 Using Admin User: ${user.email} (ID: ${user.id})`);

  const globalZone = generateGlobalZone();
  const globalHash = hashGeofence(globalZone);

  // 2. Create or Find Global Geofence
  let globalGeofence = await prisma.geofence.findFirst({ where: { zoneHash: globalHash } });
  if (!globalGeofence) {
    globalGeofence = await prisma.geofence.create({
      data: {
        name: 'GLOBAL_TEST_ZONE',
        zoneHash: globalHash,
        isActive: true,
      },
    });
    // Set PostGIS Zone
    await prisma.$executeRaw`
        UPDATE "Geofence" 
        SET "zone" = ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(globalZone.geometry)}), 4326)
        WHERE "id" = ${globalGeofence.id}::uuid
    `;
    console.log(`🌍 Created Global Geofence: ${globalGeofence.id}`);
  } else {
    console.log(`🌍 Found Existing Global Geofence: ${globalGeofence.id}`);
  }

  // 3. Batch Creation Loop
  let totalCreated = 0;
  for (let i = 0; i < TOTAL_VEHICLES; i += BATCH_SIZE) {
    const chunkEnd = Math.min(i + BATCH_SIZE, TOTAL_VEHICLES);
    console.log(`\n⏳ Processing Batch ${i} to ${chunkEnd}...`);

    const vehicleData = [];
    const geofenceData = [];
    
    // Gen Vehicles and Geofences
    for (let j = i; j < chunkEnd; j++) {
      const imei = `TEST_${String(j).padStart(6, '0')}`;
      vehicleData.push({
        imei,
        vechicleNumb: `SIM-V-${j}`,
        customerId: user.id,
      });

      const zone = generateUniqueZone(j);
      geofenceData.push({
        name: `UNIQUE_ZONE_${j}`,
        zoneHash: hashGeofence(zone),
        isActive: true,
      });
    }

    // Insert Vehicles
    await prisma.vehicleInfo.createMany({
      data: vehicleData,
      skipDuplicates: true,
    });

    // Fetch the inserted vehicles to get their UUIDs for Geofence Linking
    const imeisToFetch = vehicleData.map(v => v.imei);
    const dbVehicles = await prisma.vehicleInfo.findMany({
      where: { imei: { in: imeisToFetch } },
      select: { id: true, imei: true },
    });

    // Link all generated vehicles to the Global Node
    const globalLinks = dbVehicles.map(v => ({
      vehicleId: v.id,
      geofenceId: globalGeofence.id,
    }));
    await prisma.vehiclesOnGeofences.createMany({
      data: globalLinks,
      skipDuplicates: true,
    });
    
    totalCreated += vehicleData.length;
    console.log(`✅ Completed Batch. Total Processed: ${totalCreated}/${TOTAL_VEHICLES}`);
  }

  console.log(`\n🎉 Seeding Complete! ${totalCreated} Simulator vehicles are now registered in the DB and bound to the Global Geofence.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
