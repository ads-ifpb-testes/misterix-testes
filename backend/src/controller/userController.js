import { Router } from "express";
import sequelize from "../data/sequelize.js";
import { generateAccessToken } from "../service/jwtService.js";
import { checkLoginModel } from "../middlewares.js";

const userRouter = new Router();

userRouter.post('/login', checkLoginModel, async (req, res) => {
    const {login, password} = req.body;
    try{
        const user = await sequelize.models.User.findByPk(login);
        if(user){
            if(password == user.password)
                res.status(200).json(generateAccessToken(login));
            else
                res.sendStatus(401);
        }
        else{
            await sequelize.models.User.create({login, password});
            const token = generateAccessToken(login);
            res.status(201).json(token);
        }
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

export default userRouter;