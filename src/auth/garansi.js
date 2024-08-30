import express from "express";
import db from '../database/config.js'

const warranty = express.Router();

warranty.get('/', (req, res) => {
    res.render('garansi', { user: req.session.user, title: "Garansi" });
})

warranty.get('/wr', async (req, res) => {
    const name = req.query.name || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    try {
        const warranty = await db('garansi')
                                 .leftJoin('sales', 'garansi.sales_id', 'sales.id')
                                 .leftJoin('customer', 'sales.customer_id', 'customer.id')
                                 .select(
                                    'sales.invoice',
                                    'customer.name as customer',
                                    'garansi.id as id',
                                    'garansi.tanggal_mulai as tanggal_mulai',
                                    'garansi.tanggal_berakhir as tanggal_selesai',
                                    'garansi.status as status',
                                 )
                                 .where('sales.invoice', 'like', `%${name}%`)
                                 .orWhere('customer.name', 'like', `%${name}%`)
                                 .limit(limit)
                                 .offset(offset)

        const count = await db('sales')
                                .leftJoin('customer', 'sales.customer_id', 'customer.id')
                                .leftJoin('garansi', 'sales.id', 'garansi.sales_id')
                                .where('sales.invoice', 'like', `%${name}%`)
                                .orWhere('customer.name', 'like', `%${name}%`)
                                .count('sales.id as count')
                                .first();

        res.json({ 
            warranty, 
            currentPage: page, 
            totalPage: Math.ceil(count.count / limit), 
            hasNextPage: page < Math.ceil(count.count / limit), 
            hasPreviousPage: page > 1 
        });
    } catch (error) {
        console.error('Error Retrieving warranty:', error);
        res.status(500).json({ message: 'Error Retrieving warranty' });
    }
});

warranty.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await db('garansi').where('id', id).update({
            status: 'Dipakai'
        });
        return res.status(200).json({ message: 'Garansi updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error updating garansi' });
    }
})

export default warranty;