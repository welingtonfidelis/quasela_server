import { Router } from "express";

import { httpMessageController } from "../../controllers/httpMessages";

const httpMessageRouter = Router();
const { list } = httpMessageController;

httpMessageRouter.get('/http-messages', list);

export { httpMessageRouter };