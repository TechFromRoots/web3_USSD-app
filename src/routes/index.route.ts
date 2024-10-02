import { Router, Request, Response, Application } from 'express';
import { OK } from '../utils/statusCodes.util';
const router: Router = Router();
import CustomResponse from "../utils/helpers/response.util";
import ussdRoute from './ussd.route';

/**API base route */
router.get("/", (_req: Request, res: Response) => {
    new CustomResponse(OK, true, "Welcome to web3-ussd-app API ensure to go through the API docs before using this service", res);
});

router.use("/ussd", ussdRoute);

export default router;