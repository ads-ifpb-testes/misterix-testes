import Legend from '../model/mongooseLegend.js'
import redisClient from '../data/redis.js'

export async function getLegends(req, res){
    try{
        const cache = await redisClient.get('LEGENDS');
        if(cache){
            res.status(200).json(JSON.parse(cache));
            return;
        }

        const legends = await Legend.find({});
        await redisClient.set('LEGENDS', JSON.stringify(legends));
        res.status(200).json(legends);    
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

export async function searchLegends(req, res){
    try{
        const {query} = req.query;
        const legends = await Legend.find({$text:{$search: query}});
        res.status(200).json(legends);
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

// legendRouter.get('/:id', async (req, res) => {
//     const {id} = req.params;
//     try{
//         const legend = await sequelize.models.Legend.findByPk(id);
//         res.status(200).json(legend);    
//     }catch(err){
//         console.log(err);
//         res.sendStatus(500);
//     }
// })

export async function getMyLegends(req, res){
    const {login} = res.locals;
    try{
        const legends = await Legend.find({postedBy: login})
        res.status(200).json(legends);
    }
    catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

export async function postLegend(req, res){
    const {title, description, type, location} = res.locals.legend;
    const {login} = res.locals;
    try{
        await Legend.create({title, description, type, location, postedBy: login});
        await redisClient.del('LEGENDS');
        res.sendStatus(201);
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

export async function updateLegend(req, res){
    const {id} = req.params;
    const legend = res.locals.legend;
    try{
        const legendExist = await Legend.findById(id);
        if(!legendExist)
            return res.sendStatus(404);

        await Legend.findByIdAndUpdate(id, legend);
        await redisClient.del('LEGENDS');
        res.sendStatus(200);
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}

export async function deleteLegend(req, res){
    const {id} = req.params;
    try{
        const legendExist = await Legend.findById(id);
        if(!legendExist)
            return res.sendStatus(404);

        await Legend.findByIdAndDelete(id);
        await redisClient.del('LEGENDS');
        res.sendStatus(200);    
    }catch(err){
        console.error(err);
        res.sendStatus(500);
    }
}