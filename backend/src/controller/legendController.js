import { Router } from "express";
import sequelize from "../data/sequelize.js";
import { authenticateToken, checkLegendModel, checkLegendOwner } from "../middlewares.js";

const legendRouter = new Router();

legendRouter.get('/', async (req, res) => {
    try{
        const legends = await sequelize.models.Legend.findAll();
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
        const legends = await sequelize.models.Legend.findAll({
            where: {postedBy: login}
        })
        res.status(200).json(legends);
    }
    catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

legendRouter.post('/', authenticateToken, checkLegendModel, async (req, res) => {
    const {title, description, type, location} = req.body;
    const {login} = res.locals;
    try{
        await sequelize.models.Legend.create({title, description, type, location, postedBy: login});
        res.sendStatus(201);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

legendRouter.put('/:id', authenticateToken, checkLegendOwner, checkLegendModel, async (req, res) => {
    const {id} = req.params;
    const {title, description, type, location} = req.body;
    try{
        await sequelize.models.Legend.update(
            {title, description, type, location},
            {where: {id}}
        )
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

legendRouter.delete('/:id', authenticateToken, checkLegendOwner, async (req, res) => {
    const {id} = req.params;
    try{
        await sequelize.models.Legend.destroy({
            where: {id}
        })
        res.sendStatus(200);    
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

export default legendRouter;