import { TrackerPayload } from '../tracker/tracker.logic.ts';

export interface SluParsedData extends TrackerPayload {
  speed: number;
  altitude: number;
  heading: number;
  ignition: boolean;
  // Extended fields from new $SLU format
  odometer?: number;
  engine?: boolean;
  driving?: boolean;
  rpm?: number;
  engineDuration?: string;
  totalEngineDuration?: number;
  start?: number;
  stop?: string;
  idleTime?: string;
  batteryVoltage?: number;
  inputVoltage?: number;
  batteryHealth?: number;
  batteryCharge?: number;
  gpsFix?: number;
  digitalInput1?: boolean;
  digitalInput2?: boolean;
  digitalOutput1?: boolean;
  temperature?: number;
}

/**
 * Field indices within the data portion of the $SLU packet.
 * Packet layout: $SLU{IMEI},{CMD_ID},{SERIAL},{EDI},{EID},{LDI},{LTDD},{LGDD},...
 * After splitting by comma, the header token "$SLU{IMEI}" is index 0.
 */
const enum SLU {
  HEADER   = 0,  // $SLU{IMEI}
  CMD_ID   = 1,  // Command ID (06 = data)
  SERIAL   = 2,  // Message serial number
  EDI      = 3,  // Event timestamp (ISO 8601)
  EID      = 4,  // Event ID
  LDI      = 5,  // Location timestamp (ISO 8601)
  LTDD     = 6,  // Latitude
  LGDD     = 7,  // Longitude
  SPDK     = 8,  // Speed (km/h)
  ODOD     = 9,  // Odometer (km)
  HEAD     = 10, // Heading (degrees)
  ALTD     = 11, // Altitude (metres)
  IGN      = 12, // Ignition 0/1
  ENG      = 13, // Engine 0/1
  DRV      = 14, // Driving started
  RPM      = 15, // RPM
  DUR      = 16, // Engine duration
  TDUR     = 17, // Total engine duration
  STRT     = 18, // Start
  STP      = 19, // Stop
  IDL      = 20, // Idle time
  VBAT     = 21, // Battery voltage (V)
  VIN      = 22, // Input voltage (V)
  BATH     = 23, // Battery health (%)
  BATC     = 24, // Battery charge (%)
  V3       = 25, // V3
  CFL      = 26, // CFL
  SATN     = 27, // Satellites
  FIX      = 28, // GPS Fix (3 = 3D fix)
  IN1      = 29, // Digital input 1
  IN2      = 30, // Digital input 2
  OUT1     = 31, // Digital output 1
  TVI      = 32, // Temperature (°C)
  TI1      = 33, // Temp input 1
  TV1      = 34, // Temp value 1
  TH1      = 35, // Temp high 1
  TV2_1    = 36, // Temp value 2 (Dup in spec)
  TI2      = 37, // Temp input 2
  TV2_2    = 38, // Temp value 2 (Dup in spec)
  TH2      = 39, // Temp high 2 
  CV1      = 40, // Custom value 1
  EXT1     = 41, // Extra 1
  EXT2     = 42, // Extra 2
}

/**
 * Parse the new $SLU device-to-server packet format.
 *
 * Example input:
 * $SLU352353081356070,06,567923,2026-03-23T12:59:23+00:00,01,...,0,2*A7
 *
 * Returns null for any unparseable or non-$SLU packet.
 */
export const parseRawSluData = (data: string): SluParsedData | null => {
  try {
    const cleanData = data.trim();

    // ── Guard: must start with $SLU ────────────────────────────
    if (!cleanData.startsWith('$SLU')) return null;

    // Strip checksum suffix (e.g. "*A7") before splitting
    const checksumIdx = cleanData.lastIndexOf('*');
    const body = checksumIdx > 0 ? cleanData.substring(0, checksumIdx) : cleanData;

    const parts = body.split(',');

    // Minimum viable field count: need at least up to IGN (index 12)
    if (parts.length < 13) return null;

    // ── Extract IMEI from header token "$SLU{IMEI}" ───────────
    const imei = parts[SLU.HEADER].substring(4); // strip "$SLU"
    if (!imei || imei.length < 10) return null;

    // ── Core location fields ──────────────────────────────────
    const lat = parseFloat(parts[SLU.LTDD]);
    const lng = parseFloat(parts[SLU.LGDD]);
    if (isNaN(lat) || isNaN(lng)) return null;

    const speed    = parseFloat(parts[SLU.SPDK]) || 0;
    const heading  = parseFloat(parts[SLU.HEAD]) || 0;
    const altitude = parseFloat(parts[SLU.ALTD]) || 0;
    const ignition = parts[SLU.IGN] === '1';

    // ── Timestamp: prefer Location timestamp, fall back to Event timestamp ──
    let timestamp = new Date();
    const ldiStr = parts[SLU.LDI];
    const ediStr = parts[SLU.EDI];
    if (ldiStr) {
      const parsed = new Date(ldiStr);
      if (!isNaN(parsed.getTime())) timestamp = parsed;
    } else if (ediStr) {
      const parsed = new Date(ediStr);
      if (!isNaN(parsed.getTime())) timestamp = parsed;
    }

    // ── Extended fields (safe optional parsing) ───────────────
    const odometer          = safeFloat(parts[SLU.ODOD]);
    const engine            = parts.length > SLU.ENG ? parts[SLU.ENG] === '1' : undefined;
    const driving           = parts.length > SLU.DRV ? parts[SLU.DRV] === '1' : undefined;
    const rpm               = safeFloat(parts[SLU.RPM]);
    const engineDuration    = parts[SLU.DUR] || undefined;
    const totalEngineDuration = safeFloat(parts[SLU.TDUR]);
    const start             = safeFloat(parts[SLU.STRT]);
    const stop              = parts[SLU.STP] || undefined;
    const idleTime          = parts[SLU.IDL] || undefined;
    const batteryVoltage    = safeFloat(parts[SLU.VBAT]);
    const inputVoltage      = safeFloat(parts[SLU.VIN]);
    const batteryHealth     = safeFloat(parts[SLU.BATH]);
    const batteryCharge     = safeFloat(parts[SLU.BATC]);
    const gpsFix            = safeFloat(parts[SLU.FIX]);
    const digitalInput1     = parts.length > SLU.IN1 ? parts[SLU.IN1] === '1' : undefined;
    const digitalInput2     = parts.length > SLU.IN2 ? parts[SLU.IN2] === '1' : undefined;
    const digitalOutput1    = parts.length > SLU.OUT1 ? parts[SLU.OUT1] === '1' : undefined;
    const temperature       = safeFloat(parts[SLU.TVI]);

    return {
      imei,
      lat,
      lng,
      timestamp,
      speed,
      heading,
      altitude,
      ignition,
      odometer,
      engine,
      driving,
      rpm,
      engineDuration,
      totalEngineDuration,
      start,
      stop,
      idleTime,
      batteryVoltage,
      inputVoltage,
      batteryHealth,
      batteryCharge,
      gpsFix,
      digitalInput1,
      digitalInput2,
      digitalOutput1,
      temperature,
    };
  } catch (error) {
    return null;
  }
};

/** Safe parseFloat — returns undefined for empty/NaN values */
function safeFloat(val: string | undefined): number | undefined {
  if (!val || val === '') return undefined;
  const n = parseFloat(val);
  return isNaN(n) ? undefined : n;
}
