import type { Request } from "express";
import type { JwtPayload } from "../lib/tokens.js";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
