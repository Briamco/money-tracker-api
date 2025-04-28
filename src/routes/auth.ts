import { Router } from "express";
import controllers from "../controllers/auth";
import authMiddleware from "../middleware/authMiddleware";

const authRouter = Router()

authRouter.post('/register', controllers.register)
authRouter.post('/login', controllers.login)
authRouter.post('/verify/:code', authMiddleware, controllers.verify)
authRouter.put('/resendCode', authMiddleware, controllers.resendCode)

export { authRouter }