import { Router } from "express";
import controllers from "../controllers/auth";
import authMiddleware from "../middleware/authMiddleware";

const authRouter = Router()

authRouter.post('/register', controllers.register)
authRouter.post('/login', controllers.login)
authRouter.post('/me', authMiddleware, controllers.me)
authRouter.post('/verify', authMiddleware, controllers.verify)
authRouter.put('/resendCode', authMiddleware, controllers.resendCode)

export { authRouter }