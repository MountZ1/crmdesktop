import express from 'express';
import { authMiddleware, onlyAdmin } from '../middleware/index.js';
import db from '../database/config.js';
import users from './users.js';
import customers from './customers.js';
import components from './components.js';
import supplier from './supplier.js';
import pembelian from './pembelian.js';
import penjualan from './penjualan.js';
import servis from './servis.js';
import report from './report.js';
import warranty from './garansi.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/dashboard', async (req, res) => {
    const terlaris = await db('detail_komponen_sale'). leftJoin('komponen', 'detail_komponen_sale.komponen_id', 'komponen.id').select('komponen.name as komponen_name', 'komponen.kd_barang as kode', db.raw('sum(detail_komponen_sale.jumlah) as total')).groupBy('komponen.id').orderBy('total', 'desc').limit(5);
    const stockSedikit = await db('komponen').select('name as komponen_name', 'kd_barang as kode', 'stock').orderBy('stock', 'asc').limit(5);
    res.render('dashboard', { user: req.session.user, title: "Dashboard", terlaris, stockSedikit });
})

router.use('/users',onlyAdmin('/auth/dashboard'), users)
router.use('/customers', customers)
router.use('/components', components)
router.use('/supplier', supplier)
router.use('/pembelian', pembelian)
router.use('/penjualan', penjualan)
router.use('/servis', servis)
router.use('/report', report)
router.use('/warranty', warranty)

export default router;