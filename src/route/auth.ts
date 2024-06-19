import { Router } from "express";
import { createUser, loginUser } from "src/controller/auth";

const authRouter = Router()

authRouter.post('/create', createUser)
authRouter.post('/login', loginUser)

export default authRouter;