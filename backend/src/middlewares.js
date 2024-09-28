import jwt from 'jsonwebtoken';
import Legend from './model/mongooseLegend.js';

export async function checkLegendOwner(req, res, next){
    const {id} = req.params;
    const {login} = res.locals;
    try{
        const legend = await Legend.findById(id);
        if(legend.postedBy != login){
            res.sendStatus(401);
            return;
        }

        next();
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
};

export function authenticate(req, res, next){
    const token = req.header('Authorization');
    if(!token)
        res.sendStatus(403);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err){
            return res.sendStatus(403);
        }
        res.locals.login = user.data;
        next();
    });
}

export function checkLoginModel(req, res, next){
    const {login, password} = req.body;
    if(!login || !password || password.length < 6)
        res.sendStatus(400);
    else{
        res.locals.user = {login, password};
        next();
    }
}

export function checkLegendModel(req, res, next){
    const {title, description, type, location} = req.body;
    if(!title || !description || !type || !location || !location.type || location.type != 'Point' || !location.coordinates || location.coordinates.length < 2 || location.coordinates.length > 2)
        res.sendStatus(400);
    else{
        res.locals.legend = {title, description, type, location};
        next();
    }

}