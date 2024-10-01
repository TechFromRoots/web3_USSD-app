import express from 'express';
import UssdController from '../controllers/ussd.controller';
const router = express.Router();
const { ussd } = new UssdController();

// ussd gateway
router.post("/", ussd);

export default router;