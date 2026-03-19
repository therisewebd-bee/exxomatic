import { TrackerPayload } from '../tracker/tracker.logic.ts';

export interface SluParsedData extends TrackerPayload {
  speed: number;
  altitude: number;
  heading: number;
  ignition: boolean;
  batteryVoltage?: number;
}

export const parseRawSluData = (data: string): SluParsedData | null => {
  try {
    const cleanData = data.trim();
    // Support the format provided in the assignment: $1,AEPL,0.0.1,NR,...
    if (!cleanData.startsWith('$1,AEPL')) return null;

    const parts = cleanData.split(',');
    
    // Safety check for basic array length
    if (parts.length < 16) return null;

    const imei = parts[6];
    
    // Parse Date (DDMMYYYY) and Time (HHMMSS)
    const dateStr = parts[9]; // e.g. '24022026'
    const timeStr = parts[10]; // e.g. '085610'
    let timestamp = new Date();
    if (dateStr && timeStr && dateStr.length === 8 && timeStr.length === 6) {
        const day = dateStr.substring(0, 2);
        const month = dateStr.substring(2, 4);
        const year = dateStr.substring(4, 8);
        const hr = timeStr.substring(0, 2);
        const min = timeStr.substring(2, 4);
        const sec = timeStr.substring(4, 6);
        timestamp = new Date(`${year}-${month}-${day}T${hr}:${min}:${sec}Z`);
    }

    const lat = parseFloat(parts[11]);
    const latDir = parts[12];
    const finalLat = latDir === 'S' ? -lat : lat;

    const lng = parseFloat(parts[13]);
    const lngDir = parts[14];
    const finalLng = lngDir === 'W' ? -lng : lng;

    if (isNaN(finalLat) || isNaN(finalLng)) return null;

    const speed = parseFloat(parts[15]) || 0;
    const heading = parseFloat(parts[16]) || 0;
    const altitude = parseFloat(parts[17]) || 0;
    // IGN might be index 8 (which is '1') or another metric. We'll derive it from speed or default to true for the assignment
    const ignition = speed > 0 || parts[8] === '1';

    return {
      imei,
      lat: finalLat,
      lng: finalLng,
      timestamp,
      speed,
      heading,
      altitude,
      ignition,
    };
  } catch (error) {
    return null;
  }
};
