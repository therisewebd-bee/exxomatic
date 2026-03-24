import { prismaAdapter } from './dbInit.ts';
import {
  CreateVehicleComplianceInput,
  UpdateVehicleComplianceInput,
  FindVehicleComplianceQueryInput,
  ComplianceIdParam,
} from '../dto/vehicleCompliance.dto.ts';
import { catchService } from '../utils/utilHandler.ts';

//VCS here stands for VehicleCompliance Data Schema
//catchServcie here is a highOrder fucntion
//whcih track , error in case the db call fails
//using other two parameter it is possible to
//trace out error propley

const createVehicleComplianceDb = catchService(
  async (complianceDataScheam: CreateVehicleComplianceInput) => {
    return await prismaAdapter.vehicleCompliance.create({
      data: {
        ...complianceDataScheam.body,
      },
    });
  },
  'DB-Call:Compliance',
  'Create Compliance Record'
);

const updateVehicleComplianceDb = catchService(
  async (cID: ComplianceIdParam, complianceDataScheam: UpdateVehicleComplianceInput) => {
    return await prismaAdapter.vehicleCompliance.update({
      where: {
        id: cID.params.complianceId,
      },
      data: {
        ...complianceDataScheam.body,
      },
    });
  },
  'DB-Call:Compliance',
  'Update Compliance Record'
);

const deleteVehicleComplianceDb = catchService(
  async (cID: ComplianceIdParam) => {
    return await prismaAdapter.vehicleCompliance.delete({
      where: {
        id: cID.params.complianceId,
      },
    });
  },
  'DB-Call:Compliance',
  'Delete Compliance Record'
);

const findVehicleComplianceByIdDb = catchService(
  async (cID: ComplianceIdParam) => {
    return await prismaAdapter.vehicleCompliance.findUnique({
      where: {
        id: cID.params.complianceId,
      },
    });
  },
  'DB-Call:Compliance',
  'Find Compliance By Id'
);

const findVehicleCompliancesDb = catchService(
  async (query: any, customerId?: string) => {
    const { vehicleId, filledBy, page = 1, limit = 10 } = query;
    const where: any = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (filledBy) where.filledBy = filledBy;
    if (customerId) where.vehicle = { customerId };

    return await prismaAdapter.vehicleCompliance.findMany({
      where,
      include: {
        vehicle: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        filledAt: 'desc',
      },
    });
  },
  'DB-Call:Compliance',
  'Find Compliance Records'
);

export {
  createVehicleComplianceDb,
  updateVehicleComplianceDb,
  deleteVehicleComplianceDb,
  findVehicleComplianceByIdDb,
  findVehicleCompliancesDb,
};
