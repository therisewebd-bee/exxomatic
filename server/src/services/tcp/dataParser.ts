import { TrackerPayload } from '../tracker/tracker.logic.js';

export interface SluParsedData extends TrackerPayload {
  speed: number;
  altitude: number;
  heading: number;
  ignition: boolean;
  batteryVoltage?: number;
}

/**
 * Parser for raw $SLU IoT protocol
 * Format: $SLU<imei>,<type>,<seq>,<time>,<type2>,<time2>,<lat>,<lng>,<speed>,<odo>,<heading>,<alt>,<ign>,...
 */
export const parseRawSluData = (data: string): SluParsedData | null => {
  try {
    const cleanData = data.trim();
    if (!cleanData.startsWith('$SLU')) return null;

    const firstComma = cleanData.indexOf(',');
    if (firstComma === -1) return null;
    
    const imei = cleanData.substring(4, firstComma);
    const parts = cleanData.substring(firstComma + 1).split(',');

    const lat = parseFloat(parts[5]);
    const lng = parseFloat(parts[6]);
    
    if (isNaN(lat) || isNaN(lng)) return null;

    return {
      imei,
      lat,
      lng,
      timestamp: parts[4] ? new Date(parts[4]) : new Date(),
      speed: parseFloat(parts[7]) || 0,
      heading: parseFloat(parts[9]) || 0,
      altitude: parseFloat(parts[10]) || 0,
      ignition: parts[11] === '1',
    };
  } catch (error) {
    return null;
  }
};
