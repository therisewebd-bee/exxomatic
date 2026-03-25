import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

/**
 * Strictly Typed Express Request
 * T: The Zod generated type representing the entire validated object { body?, params?, query? }
 */
export interface ValidatedRequest<
  T,
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  validated: T;
}
