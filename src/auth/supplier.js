import express from 'express';
import {  Destroy, Index, Show, Store, Update, Search, CountRow  } from '../database/query.js';

const supplier= express.Router();


supplier.get('/', async (req, res) => {
    const supplier = await Index('supplier', ['id', 'name', 'kontak']);
    res.render('supplier', 
        { user: req.session.user, 
        title: "supplier",
        suppliers: supplier
     });
});
supplier.get('/sp', async (req, res) => {
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const sp = await Search('supplier', ['name', 'like', `%${name}%`], limit, offset);
    const sptotal = await CountRow('supplier', 'id as count');
    const pgtotal = Math.ceil(sptotal[0].count / limit);
    res.json({
        suppliers: sp,
        currentPage: page,
        totalPage: pgtotal,
        hasNextPage: page < pgtotal,
        hasPreviousPage: page > 1
    });
})

supplier.get('/cmpinput', async (req, res) => {
    const supplier = await Index('supplier', ['id', 'name']);
    return res.json(supplier);
});

supplier.post('/', async (req, res) => {
    let { name, kontak } = req.body;

    if (kontak.startsWith('0')) {
        kontak = '62' + kontak.slice(1);
    }

    try {
        await Store('supplier', {
            name: name,
            kontak: kontak,
        });
        return res.status(200).json({ message: 'Supplier created successfully' });
    } catch (error) {
        console.error('Error creating Supplier:', error);
        return res.status(500).json({ message: 'Error creating Supplier' });
    }
});

supplier.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const supplier = await Show('supplier', { id: id }, ['id', 'name', 'kontak']);
        if (!supplier) {
            return res.status(404).json({ message: 'supplier not found' });
        }
        return res.status(200).json(supplier);
    }catch(error){
        console.log(`Error retrieving supplier: ${error}`);
        return res.status(500).json({ message: 'Error retrieving supplier' });
    }
})

supplier.put('/:id', async (req, res) => {
    const { name, kontak, id } = req.body;
    if (kontak.startsWith('0')) {
        kontak = '62' + kontak.slice(1);
    }
    try {
        // console.log(req.body);
        await Update('supplier', {
            name: name,
            kontak: kontak
        }, { id: id });
        return res.status(200).json({ message: 'supplier updated successfully' });
    } catch (error) {
        console.error('Error updating supplier:', error);
        return res.status(500).json({ message: 'Error updating supplier' });
    }
})

supplier.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Destroy('supplier', { id: id });
        return res.status(200).json({ message: 'supplier deleted successfully' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        return res.status(500).json({ message: 'Error deleting supplier' });
    }
})

export default supplier;