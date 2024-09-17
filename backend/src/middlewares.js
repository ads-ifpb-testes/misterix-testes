import jwt from 'jsonwebtoken';
import sequelize from './data/sequelize.js'

export async function checkLegendOwner(req, res, next){
    const {id} = req.params;
    const {login} = res.locals;
    try{
        const legend = await sequelize.models.Legend.findByPk(id);
        if(legend.postedBy != login)
            res.sendStatus(401);

        next();
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};

export function authenticateToken(req, res, next){
    const token = req.header('Authorization');
    if(!token)
        res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err){
            console.log(err);
            return res.sendStatus(403);
        }
        res.locals.login = user.data;
        next();
    });
}

export function checkLoginModel(req, res, next){
    const {login, password} = req.body;
    if(!login || !password)
        res.sendStatus(400);
    else
        next();
}

export function checkLegendModel(req, res, next){
    const {title, description, type, location} = req.body;
    if(!title || !description || !type || !location)
        res.sendStatus(400);
    else
        next();
}