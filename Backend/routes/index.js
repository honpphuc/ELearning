import { Router } from "express";
import paymentRouter from "./payment.js";
import authRouter from "./auth.js";
const router = Router();

router.get("/", (req, res) => res.json({ message: "API index route" }));
router.use("/payment", paymentRouter);
router.use("/auth", authRouter);

export default router;
