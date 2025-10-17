import { Router } from "express";
import paymentRouter from "./payment.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import courseRouter from "./course.js";
import enrollmentRouter from "./enrollment.js";

const router = Router();

router.get("/", (req, res) => res.json({ message: "API index route" }));
router.use("/payment", paymentRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/courses", courseRouter);
router.use("/enrollments", enrollmentRouter);

export default router;
