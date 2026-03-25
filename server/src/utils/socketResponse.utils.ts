export interface SocketEvent<T = any> {
  event: string;
  data: T;
  timestamp: string;
  success: boolean;
}

export class SocketResponse {
  static format<T>(event: string, data: T, success: boolean = true): SocketEvent<T> {
    return {
      event,
      data,
      timestamp: new Date().toISOString(),
      success,
    };
  }
}
