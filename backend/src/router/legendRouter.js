import { deleteLegend, getLegends, getMyLegends, postLegend, searchLegends, updateLegend } from '../controller/legendController.js'
import {Router} from 'express'
import { authenticate, checkLegendModel, checkLegendOwner } from '../middlewares.js';

const router = Router();

router.get('/', getLegends);
router.get('/mylegends', authenticate, getMyLegends);
router.post('/', authenticate, checkLegendModel, postLegend);
router.post('/search', searchLegends);
router.put('/:id', authenticate, checkLegendOwner, checkLegendModel, updateLegend);
router.delete('/:id', authenticate, checkLegendOwner, deleteLegend);

export default router;