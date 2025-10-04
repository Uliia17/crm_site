import { Router } from "express";
import { authRouter } from "./auth.router";
import { ordersRouter } from "./application.router";

const router = Router();
router.use("/login", authRouter);
router.use("/orders", ordersRouter);

export { router as apiRouter };
