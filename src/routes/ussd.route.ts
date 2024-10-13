import express, { Request, Response } from 'express';
import UssdController from '../controllers/ussd.controller';
const router = express.Router();
const { ussd } = new UssdController();

// ussd gateway
router.post("/", ussd);

// base endpoint
router.get("/", (_req: Request, res: Response) => {
    res.send("App up and running...");
});

export default router;