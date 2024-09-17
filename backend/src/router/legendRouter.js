import { deleteLegend, getLegends, getMyLegends, postLegend, updateLegend } from '../controller/legendController.js'
import {Router} from 'express'
import { authenticate, checkLegendModel, checkLegendOwner } from '../middlewares.js';

const router = Router();

router.get('/', getLegends);
router.get('/mylegends', authenticate, getMyLegends);
router.post('/', authenticate, checkLegendModel, postLegend);
router.put('/:id', authenticate, checkLegendOwner, checkLegendModel, updateLegend);
router.delete('/:id', authenticate, checkLegendOwner, deleteLegend);

export default router;