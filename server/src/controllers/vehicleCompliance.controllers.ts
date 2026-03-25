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

import { prismaAdapter } from '../dbQuery/dbInit.ts';

const logComplianceHandler = AsyncHandler(async (req: ValidatedRequest<CreateVehicleComplianceInput> | any, res: Response) => {
  const { body } = req.validated;

  if (req.user?.role !== 'Admin') {
    const vehicle = await prismaAdapter.vehicleInfo.findUnique({ where: { id: body.vehicleId } });
    if (!vehicle || vehicle.customerId !== req.user.id) {
      throw new ApiError(403, 'Permission denied: Cannot log petrol receipts for vehicles you do not own');
    }
  }

  const logged = await createVehicleComplianceDb({ body });

  return res
    .status(201)
    .json(new ApiResponse(201, logged, 'Compliance record logged successfully'));
});

const getCompliances = AsyncHandler(async (req: ValidatedRequest<FindVehicleComplianceQueryInput> | any, res: Response) => {
  const { query } = req.validated;
  const customerId = req.user?.role !== 'Admin' ? req.user?.id : undefined;

  const result = await findVehicleCompliancesDb(query, customerId);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Compliance records retrieved successfully'));
});

const getCompliance = AsyncHandler(async (req: ValidatedRequest<ComplianceIdParam> | any, res: Response) => {
  const { params } = req.validated;

  const record = await findVehicleComplianceByIdDb({ params });
  if (!record) {
    throw new ApiError(404, 'Compliance record not found');
  }

  if (req.user?.role !== 'Admin') {
    const vehicle = await prismaAdapter.vehicleInfo.findUnique({ where: { id: record.vehicleId } });
    if (!vehicle || vehicle.customerId !== req.user.id) {
      throw new ApiError(403, 'Permission denied: You do not own this report');
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, 'Compliance record retrieved successfully'));
});

const updateComplianceHandler = AsyncHandler(async (req: ValidatedRequest<UpdateVehicleComplianceInput & ComplianceIdParam> | any, res: Response) => {
  const { body, params } = req.validated;

  if (Object.keys(body).length === 0) {
    throw new ApiError(400, 'At least one field must be provided for update');
  }

  if (req.user?.role !== 'Admin') {
    const record = await findVehicleComplianceByIdDb({ params });
    if (!record) throw new ApiError(404, 'Compliance record not found');
    const vehicle = await prismaAdapter.vehicleInfo.findUnique({ where: { id: record.vehicleId } });
    if (!vehicle || vehicle.customerId !== req.user.id) {
      throw new ApiError(403, 'Permission denied: You do not own this report');
    }
  }

  const updated = await updateVehicleComplianceDb({ params }, { body });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, 'Compliance record updated successfully'));
});

const deleteComplianceHandler = AsyncHandler(async (req: ValidatedRequest<ComplianceIdParam> | any, res: Response) => {
  const { params } = req.validated;

  if (req.user?.role !== 'Admin') {
    const record = await findVehicleComplianceByIdDb({ params });
    if (!record) throw new ApiError(404, 'Compliance record not found');
    const vehicle = await prismaAdapter.vehicleInfo.findUnique({ where: { id: record.vehicleId } });
    if (!vehicle || vehicle.customerId !== req.user.id) {
      throw new ApiError(403, 'Permission denied: You do not own this report');
    }
  }

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

  // Multiple provider URLs with best-effort scraping
  const providerUrls = [
    `https://www.goodreturns.in/petrol-price-in-${city}.html`,
    `https://www.ndtv.com/fuel-prices/petrol-price-in-${city}-city`,
    `https://www.mypetrolprice.com/${city}-petrol-price.aspx`
  ];

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  };

  // Regex patterns to match Indian fuel prices (₹80-130 range)
  const pricePatterns = [
    /₹\s*([0-9]{2,3}\.[0-9]{1,2})/,
    /&#8377;\s*([0-9]{2,3}\.[0-9]{1,2})/,
    /Rs\.?\s*([0-9]{2,3}\.[0-9]{1,2})/i,
    /petrol.*?([89][0-9]\.[0-9]{1,2}|1[0-2][0-9]\.[0-9]{1,2})/i,
    />\s*(8[5-9]\.[0-9]{1,2}|9[0-9]\.[0-9]{1,2}|1[0-2][0-9]\.[0-9]{1,2})\s*</
  ];

  for (const url of providerUrls) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { method: 'GET', headers, signal: controller.signal });
      clearTimeout(timeout);
      
      if (!response.ok) continue;
      const text = await response.text();
      
      for (const pattern of pricePatterns) {
        const match = text.match(pattern);
        if (match?.[1]) {
          const rate = parseFloat(match[1]);
          if (rate >= 70 && rate <= 150) { // Sanity check for valid INR fuel price
            finalRate = match[1];
            break;
          }
        }
      }
      if (finalRate) break;
    } catch (err) {
      continue;
    }
  }

  // Fallback: Use average national rate if scraping fails
  if (!finalRate) {
    // Use a reasonable default based on current Indian petrol prices
    const fallbackRates: Record<string, string> = {
      'delhi': '94.72', 'mumbai': '103.44', 'bangalore': '101.94',
      'chennai': '100.76', 'kolkata': '104.95', 'hyderabad': '107.41',
      'pune': '103.02', 'gurgaon': '94.27'
    };
    finalRate = fallbackRates[city] || '96.72';
    return res.status(200).json(new ApiResponse(200, { rate: finalRate, city, source: 'fallback' }, `Using cached rate for ${city} (live scraping temporarily unavailable)`));
  }
  
  return res.status(200).json(new ApiResponse(200, { rate: finalRate, city, source: 'live' }, `Live fuel rate for ${city} dynamically fetched`));
});

export {
  logComplianceHandler,
  getCompliances,
  getCompliance,
  updateComplianceHandler,
  deleteComplianceHandler,
  getLiveFuelRate,
};
