import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/sign-in", authController.signIn);
router.get("/me", authMiddleware.checkAccessToken, authController.me);
router.post(
    "/refresh",
    authMiddleware.checkRefreshToken,
    authController.refresh,
);
router.post(
    "/activate/:userId",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    authController.generateActivationLink,
);
router.get("/activate/:token", authController.confirmActivation);
router.post("/recovery", authController.sendRecoveryLink);
router.post("/recovery/confirm", authController.confirmRecovery);

export { router as authRouter };
