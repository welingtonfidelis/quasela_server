import { Request, Response, NextFunction } from "express";
import { parseToBoolean } from "../../../../../shared/utils";

const createAssembler = (req: Request, res: Response, next: NextFunction) => {
  req.body = {
    ...req.body,
    is_blocked: parseToBoolean(req.body.is_blocked),
  };

  next();
};

export { createAssembler };
