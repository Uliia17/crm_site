import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { applicationController } from "../controllers/application.controller";
import { userController } from "../controllers/user.controller";

const router = Router();

// ---------------------
// Юзери спочатку!
// GET /orders/users — повертає всіх користувачів
router.get(
    "/users",
    authMiddleware.checkAccessToken, // можна прибрати, якщо зовсім без авторизації
    userController.getAllUsers,
);

// ---------------------
// Динамічні замовлення
router.get("/", authMiddleware.checkAccessToken, applicationController.getAll);
router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    applicationController.getById,
);
router.post(
    "/:id/comment",
    authMiddleware.checkAccessToken,
    applicationController.addComment,
);
router.put(
    "/:id",
    authMiddleware.checkAccessToken,
    applicationController.updateById,
);

// ---------------------
// Управління менеджерами
router.post(
    "/users",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    userController.createManager,
);
router.post(
    "/users/:userId/toggle-ban",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    userController.toggleBan,
);

export { router as ordersRouter };
