import { Router } from "express";
<<<<<<< HEAD
const router = Router();

router.get("/", (req, res) => res.json({ message: "API index route" }));
=======
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
>>>>>>> 44066f8 (update)

export default router;
