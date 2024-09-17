import { Router } from "express";
import { checkLoginModel } from "../middlewares.js";
import { logIn } from "../controller/userController.js";

const router = Router();

router.post('/login', checkLoginModel, logIn);

export default router;