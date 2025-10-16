import { Router } from "express";
import { createPaymentUrl } from "../controllers/payment.controller.js";

const router = Router();

router.post("/create", createPaymentUrl);

export default router;
