import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}


// export interface CustomRequest extends Request {
// userId?:string;
//}