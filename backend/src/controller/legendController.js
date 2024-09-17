import { Router } from "express";
import Legend from '../model/mongooseLegend.js'
import { authenticateToken, checkLegendModel, checkLegendOwner } from "../middlewares.js";

const legendRouter = new Router();

legendRouter.get('/', async (req, res) => {
    try{
        const legends = await Legend.find({});
        res.status(200).json(legends);    
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

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

legendRouter.get('/mylegends', authenticateToken, async (req, res) => {
    const {login} = res.locals;
    try{
        const legends = await Legend.find({postedBy: login})
        res.status(200).json(legends);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

legendRouter.post('/', authenticateToken, checkLegendModel, async (req, res) => {
    const {title, description, type, location} = res.locals.legend;
    const {login} = res.locals;
    try{
        await Legend.create({title, description, type, location, postedBy: login});
        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

legendRouter.put('/:id', authenticateToken, checkLegendOwner, checkLegendModel, async (req, res) => {
    const {id} = req.params;
    const legend = res.locals.legend;
    try{
        await Legend.findByIdAndUpdate(id, legend);
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

legendRouter.delete('/:id', authenticateToken, checkLegendOwner, async (req, res) => {
    const {id} = req.params;
    try{
        await Legend.findByIdAndDelete(id);
        res.sendStatus(200);    
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

export default legendRouter;