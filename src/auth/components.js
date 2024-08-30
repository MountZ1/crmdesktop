import express from "express";
import {  Destroy, CountRow, Store, Update, Join  } from '../database/query.js';
import db from "../database/config.js";

const components = express.Router();

components.get('/', async (req, res) => {
    res.render('components', { user: req.session.user, title: "Components"});
});

components.get('/search/:name', async (req, res) => {
    const param = req.params;
    try{
        const komponen = await db('komponen').select(['id', 'name', 'kd_barang', 'sell_price', 'stock']).where('name', 'like', `%${param.name}%`).andWhere('stock', '>', 0);
        return res.status(200).json(komponen);
    } catch(error){
        console.log(`Error retrieving Komponen: ${error}`);
        return res.status(500).json({ message: 'Error retrieving Komponen' });
    }
});

components.get('/searchkd/:kd', async (req, res) => {
    const param = req.params;
    try{
        const komponen = await db('komponen').select(['id', 'name', 'kd_barang', 'sell_price', 'stock']).where('kd_barang', '=', `${param.kd}`);
        if (komponen.stock == 0) {
            return res.status(404).json({ message: 'Komponen yang dicari tidak tersedia' });
        }
        return res.status(200).json(komponen);
    } catch(error){
        console.log(`Error retrieving Komponen: ${error}`);
        return res.status(500).json({ message: 'Error retrieving Komponen' });
    }
});


components.get('/cmp', async (req, res) => {
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const us = await db('komponen').join('supplier', 'supplier.id', '=', 'komponen.supplier_id').select('komponen.*', 'supplier.name as supplier').where('komponen.name', 'like', `%${name}%`).orWhere('komponen.kd_barang', 'like', `%${name}%`).limit(limit).offset(offset);
    const ustotal = await CountRow('komponen', 'id as count').where('name', 'like', `%${name}%`);
    const pgtotal = Math.ceil(ustotal[0].count / limit);
    res.json({
        komponents: us,
        currentPage: page,
        totalPage: pgtotal,
        hasNextPage: page < pgtotal,
        hasPreviousPage: page > 1
    });
})

components.post('/', async (req, res) => {
    const { name, kd_barang, buy_price, sell_price, stock, supplier_id } = req.body;
    try {
        await Store('komponen', {
            name: name,
            kd_barang: kd_barang,
            buy_price: buy_price,
            sell_price: sell_price,
            stock: stock,
            supplier_id: supplier_id
        });
        return res.status(200).json({ message: 'Komponen created successfully' });
    } catch (error) {
        console.error('Error creating Komponen:', error);
        return res.status(500).json({ message: 'Error creating Komponen' });
    }
});

components.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komponen = await Join(
            'komponen', 
            ['supplier', 'supplier.id', 'supplier_id']).select(['komponen.id', 'komponen.name', 'komponen.kd_barang', 'komponen.buy_price', 'komponen.sell_price', 'komponen.stock', 'komponen.supplier_id', 'supplier.name as supplier']).where('komponen.id', id);
        if (!komponen) {
            return res.status(404).json({ message: 'Komponen not found' });
        }
        return res.status(200).json(komponen);
    }catch(error){
        console.log(`Error retrieving Komponen: ${error}`);
        return res.status(500).json({ message: 'Error retrieving Komponen' });
    }
})

components.put('/:id', async (req, res) => {
    const { name, kd_barang, buy_price, sell_price, stock, supplier_id, id } = req.body;
    try {
        // console.log(req.body);
        await Update('komponen', {
            name: name,
            kd_barang: kd_barang,
            buy_price: buy_price,
            sell_price: sell_price,
            stock: stock,
            supplier_id: supplier_id
        }, { id: id });
        return res.status(200).json({ message: 'Komponen updated successfully' });
    } catch (error) {
        console.error('Error updating Komponen:', error);
        return res.status(500).json({ message: 'Error updating Komponen' });
    }
});

components.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Destroy('komponen', { id: id });
        return res.status(200).json({ message: 'Komponen deleted successfully' });
    } catch (error) {
        console.error('Error deleting Komponen:', error);
        return res.status(500).json({ message: 'Error deleting Komponen' });
    }
})

export default components