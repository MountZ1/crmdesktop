<<<<<<< HEAD
import express from "express";
import db from '../database/config.js'
=======
const express = require("express");
const db = require('../database/config.js');
>>>>>>> 7e5e88e (web only)

const warranty = express.Router();

warranty.get('/', (req, res) => {
    res.render('garansi', { user: req.session.user, title: "Garansi" });
<<<<<<< HEAD
})
=======
});

warranty.get('/trx', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const rawQuery = db('sales')
            .leftJoin('garansi', 'sales.id', 'garansi.sales_id')
            .leftJoin('detail_servis_sale', 'sales.id', 'detail_servis_sale.sales_id')
            .leftJoin('customer', 'sales.customer_id', 'customer.id')
            .whereNull('garansi.sales_id')
            .where(function() {
                this.where('sales.tipe_penjualan', '!=', 'servis')
                    .orWhere(function() {
                        this.where('sales.tipe_penjualan', 'servis')
                            .andWhere('detail_servis_sale.status', 'selesai');
                    });
            });

        const counter = await rawQuery.clone().count('sales.id as total').first();
        const invoices = await rawQuery
            .distinct('sales.id')
            .select(
                'sales.id',
                'sales.invoice as invoice',
                'sales.created_at as tanggal_servis',
                'customer.name as customer',
                'sales.tipe_penjualan as tipe_penjualan'
            ).limit(limit).offset(offset);

        res.json({
            invoices,
            currentPage: page,
            totalPages: Math.ceil(counter.total / limit),
            hasNextPage: page < Math.ceil(counter.total / limit),
            hasPreviousPage: page > 1
        });
    } catch (error) {
        console.error(`Error retrieving sales data: ${error}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
>>>>>>> 7e5e88e (web only)

warranty.get('/wr', async (req, res) => {
    const name = req.query.name || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
<<<<<<< HEAD
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
=======

    try {
        await db('garansi')
            .where('tanggal_berakhir', '<', db.fn.now())
            .andWhere('status', '=', 'Belum Dipakai')
            .update({ status: 'Invalid' });

        const warrantyData = await db('garansi')
            .leftJoin('sales', 'garansi.sales_id', 'sales.id')
            .leftJoin('customer', 'sales.customer_id', 'customer.id')
            .select(
                'sales.invoice',
                'customer.name as customer',
                'garansi.id as id',
                'garansi.tanggal_mulai as tanggal_mulai',
                'garansi.tanggal_berakhir as tanggal_selesai',
                'garansi.status as status'
            )
            .where('sales.invoice', 'like', `%${name}%`)
            .orWhere('customer.name', 'like', `%${name}%`)
            .limit(limit)
            .offset(offset);

        const count = await db('sales')
            .leftJoin('customer', 'sales.customer_id', 'customer.id')
            .leftJoin('garansi', 'sales.id', 'garansi.sales_id')
            .where('sales.invoice', 'like', `%${name}%`)
            .orWhere('customer.name', 'like', `%${name}%`)
            .count('sales.id as count')
            .first();

        res.json({
            warranty: warrantyData,
            currentPage: page,
            totalPage: Math.ceil(count.count / limit),
            hasNextPage: page < Math.ceil(count.count / limit),
            hasPreviousPage: page > 1
>>>>>>> 7e5e88e (web only)
        });
    } catch (error) {
        console.error('Error Retrieving warranty:', error);
        res.status(500).json({ message: 'Error Retrieving warranty' });
    }
});

<<<<<<< HEAD
=======
warranty.post('/', async (req, res) => {
    const { sales_id, lama } = req.body;
    const startDate = new Date();
    
    // Convert months to days
    const days = Math.floor(lama * 30.44);
    
    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days);

    try {
        await db('garansi').insert({
            sales_id: sales_id,
            tanggal_mulai: startDate.toISOString().slice(0, 10),
            tanggal_berakhir: endDate.toISOString().slice(0, 10),
            status: 'Belum Dipakai'
        });

        return res.status(201).json({ message: 'Warranty created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Error creating warranty: ${error}` });
    }
});

>>>>>>> 7e5e88e (web only)
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
<<<<<<< HEAD
})

export default warranty;
=======
});

module.exports = warranty; // Export the router
>>>>>>> 7e5e88e (web only)
