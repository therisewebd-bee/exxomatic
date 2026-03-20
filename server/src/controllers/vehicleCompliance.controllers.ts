import { Request, Response } from 'express';
import AsyncHandler from '../utils/asyncHandler.utils.ts';
import { ApiResponse } from '../utils/apiResponse.utils.ts';
import { ApiError } from '../utils/apiError.utils.ts';
import {
  createVehicleComplianceDb,
  updateVehicleComplianceDb,
  deleteVehicleComplianceDb,
  findVehicleComplianceByIdDb,
  findVehicleCompliancesDb,
} from '../dbQuery/vehicleCompliance.dbquery.ts';
import {
  CreateVehicleComplianceInput,
  UpdateVehicleComplianceInput,
  FindVehicleComplianceQueryInput,
  ComplianceIdParam,
} from '../dto/vehicleCompliance.dto.ts';
import { ValidatedRequest } from '../types/request.ts';

const logComplianceHandler = AsyncHandler(async (req: ValidatedRequest<CreateVehicleComplianceInput>, res: Response) => {
  const { body } = req.validated;

  const logged = await createVehicleComplianceDb({ body });

  return res
    .status(201)
    .json(new ApiResponse(201, logged, 'Compliance record logged successfully'));
});

const getCompliances = AsyncHandler(async (req: ValidatedRequest<FindVehicleComplianceQueryInput>, res: Response) => {
  const { query } = req.validated;

  const result = await findVehicleCompliancesDb({ query });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Compliance records retrieved successfully'));
});

const getCompliance = AsyncHandler(async (req: ValidatedRequest<ComplianceIdParam>, res: Response) => {
  const { params } = req.validated;

  const record = await findVehicleComplianceByIdDb({ params });
  if (!record) {
    throw new ApiError(404, 'Compliance record not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, 'Compliance record retrieved successfully'));
});

const updateComplianceHandler = AsyncHandler(async (req: ValidatedRequest<UpdateVehicleComplianceInput & ComplianceIdParam>, res: Response) => {
  const { body, params } = req.validated;

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, 'At least one field must be provided for update');
  }

  const updated = await updateVehicleComplianceDb({ params }, { body });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, 'Compliance record updated successfully'));
});

const deleteComplianceHandler = AsyncHandler(async (req: ValidatedRequest<ComplianceIdParam>, res: Response) => {
  const { params } = req.validated;

  const result = await deleteVehicleComplianceDb({ params });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Compliance record deleted successfully'));
});

const normalizeCity = (rawInfo: string) => {
  const c = rawInfo.toLowerCase().replace(/\s+/g, '-');
  if (c.includes('bengaluru') || c.includes('bangalore')) return 'bangalore';
  if (c.includes('gurugram') || c.includes('gurgaon')) return 'gurgaon';
  if (c.includes('mumbai')) return 'mumbai';
  if (c.includes('chennai')) return 'chennai';
  if (c.includes('kolkata')) return 'kolkata';
  if (c.includes('hyderabad')) return 'hyderabad';
  if (c.includes('pune') || c.includes('pimpri') || c.includes('chinchwad')) return 'pune';
  if (c.includes('thane') || c.includes('navi-mumbai')) return 'mumbai';
  
  // If the front-end sends a completely blank or unknown GPS payload, default to a known working URL structure to guarantee parsing
  if (c.includes('unknown') || c.includes('no-gps')) return 'delhi';
  return c; // allow dynamic passthrough from OSM
};

const getLiveFuelRate = AsyncHandler(async (req: Request, res: Response) => {
  const rawCity = (req.query.city as string) || 'delhi';
  const city = normalizeCity(rawCity);
  let finalRate: string | null = null;

  // An array of the most reliable free Indian fuel price platforms 
  const providerUrls = [
    `https://www.goodreturns.in/petrol-price-in-${city}.html`,
    `https://www.ndtv.com/fuel-prices/petrol-price-in-${city}-city`,
    `https://m.economictimes.com/wealth/fuel-prices/petrol/${city}`
  ];

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive'
  };

  // Sequentially try each provider. If a provider blocks us, silently jump to the next one over.
  for (const url of providerUrls) {
    try {
      const response = await fetch(url, { method: 'GET', headers });
      if (!response.ok) continue;
      
      const text = await response.text();
      // Scrape exact Indian Rupee symbol OR capture the first prominent Petrol rate number 
      const match = text.match(/₹\s*([0-9.]+)/) || text.match(/&#8377;\s*([0-9.]+)/) || text.match(/>\s*(8[0-9]\.[0-9]+|9[0-9]\.[0-9]+|1[0-2][0-9]\.[0-9]+)\s*</);
      
      if (match && match[1]) {
        finalRate = match[1];
        break; // Successfully scraped the live price, break out of the loop
      }
    } catch (err) {
      continue;
    }
  }

  if (finalRate) {
    return res.status(200).json(new ApiResponse(200, { rate: finalRate, city }, `Live fuel rate for ${city} dynamically fetched`));
  }
  
  // If literally every single provider is down or actively blocking network packets, properly surface the 500 error to the client instead of providing a shadow hardcoded value
  return res.status(500).json(new ApiResponse(500, { city }, 'All fuel providers completely blocked the request. Network may be isolated.'));
});

export {
  logComplianceHandler,
  getCompliances,
  getCompliance,
  updateComplianceHandler,
  deleteComplianceHandler,
  getLiveFuelRate,
};
