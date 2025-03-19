import { Request, Response } from "express";

const authCheckController = {
  authCheck(req: Request, res: Response) {
    return res.json({ authenticated: true });
  },
};

export { authCheckController };
