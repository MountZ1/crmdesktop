<<<<<<< HEAD
import express from "express";
import db from "../database/config.js";
import generateInvoiceNumber from "../lib/invoiceGenerator.js"
import { authMiddleware, onlyAdmin } from '../middleware/index.js';
import { CountRow, Destroy } from "../database/query.js";

const createInvoice = () => {
    const invoiceNumber = generateInvoiceNumber();
    return invoiceNumber
=======
const express = require("express");
const db = require("../database/config.js");
const generateInvoiceNumber = require("../lib/invoiceGenerator.js");
const { authMiddleware, onlyAdmin } = require('../middleware/index.js');
const { CountRow, Destroy } = require("../database/query.js");

const createInvoice = () => {
    const invoiceNumber = generateInvoiceNumber();
    return invoiceNumber;
>>>>>>> 7e5e88e (web only)
}

const penjualan = express.Router();

penjualan.get('/create', (req, res) => {
    res.render('penjualan/create', { user: req.session.user, title: "Penjualan" });
});

penjualan.post('/', async (req, res) => {
    const { customer_id, user_id, biaya_total, items } = req.body;
    const currentDate = new Date();
    const tanggalMulai = currentDate.toISOString().slice(0, 10);
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 7);
    const tanggalSelesai = futureDate.toISOString().slice(0, 10);

    if (!customer_id || !user_id || !biaya_total || !items || !items.length) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
<<<<<<< HEAD
    try{
        await db.transaction(async trx => {
            // Insert penjualan utama
            const [penjualanId] = await trx('sales').insert({
                invoice : createInvoice(),
                customer_id : customer_id,
                user_id : user_id,
                status_bayar : 'Lunas',
                biaya_total : biaya_total,
                tipe_penjualan : 'penjualan'
=======
    
    try {
        await db.transaction(async trx => {
            // Insert penjualan utama
            const [penjualanId] = await trx('sales').insert({
                invoice: createInvoice(),
                customer_id: customer_id,
                user_id: user_id,
                status_bayar: 'Lunas',
                biaya_total: biaya_total,
                tipe_penjualan: 'penjualan'
>>>>>>> 7e5e88e (web only)
            });

            // Insert detail penjualan dan update stok komponen
            for (const item of items) {
                await trx('detail_komponen_sale').insert({
                    sales_id: penjualanId,  // Use the ID directly
                    komponen_id: item.komponen_id,
                    jumlah: item.jumlah,
                    harga_satuan: item.harga_satuan
                });

                // Update stok komponen
                await trx('komponen')
                    .where('id', item.komponen_id)
                    .decrement('stock', item.qty);
            }

            await trx('garansi').insert({
                sales_id: penjualanId,
                tanggal_mulai: tanggalMulai,
                tanggal_berakhir: tanggalSelesai,
                status: 'Belum Dipakai'
<<<<<<< HEAD
            })
=======
            });
>>>>>>> 7e5e88e (web only)

            await trx.commit();
            return res.status(200).json({ message: 'Penjualan created successfully and stock updated', id: penjualanId });
        });
    } catch (error) {
        console.error('Error creating penjualan:', error);
        return res.status(500).json({ message: 'Error creating penjualan', error: error.message });
    }
<<<<<<< HEAD
})

penjualan.get('/', async (req, res) => {
    res.render('penjualan/index', { user: req.session.user, title: "Penjualan" });
})
=======
});

penjualan.get('/', async (req, res) => {
    res.render('penjualan/index', { user: req.session.user, title: "Penjualan" });
});
>>>>>>> 7e5e88e (web only)

penjualan.get('/pj', async (req, res) => {
    const name = req.query.name || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const pnj = await db('sales')
<<<<<<< HEAD
                .leftJoin('customer', 'sales.customer_id', 'customer.id')
                .leftJoin('users', 'sales.user_id', 'users.id')
                .join('detail_komponen_sale', 'sales.id', 'detail_komponen_sale.sales_id')
                .select(
                    'sales.id',
                    'sales.invoice',
                    'customer.name as customer',
                    'sales.created_at as tanggal_pembelian',
                    'sales.tipe_penjualan as tipe_penjualan',
                    'sales.biaya_total as total',
                    'users.name as kasir'
                )
                .groupBy('sales.id', 'sales.invoice', 'customer.name', 'sales.created_at', 'sales.biaya_total', 'users.name')
                .where('sales.invoice', 'like', `%${name}%`)
                .orderBy('sales.created_at', 'desc')
                .limit(limit)
                .offset(offset);
=======
        .leftJoin('customer', 'sales.customer_id', 'customer.id')
        .leftJoin('users', 'sales.user_id', 'users.id')
        .join('detail_komponen_sale', 'sales.id', 'detail_komponen_sale.sales_id')
        .select(
            'sales.id',
            'sales.invoice',
            'customer.name as customer',
            'sales.created_at as tanggal_pembelian',
            'sales.tipe_penjualan as tipe_penjualan',
            'sales.biaya_total as total',
            'users.name as kasir'
        )
        .groupBy('sales.id', 'sales.invoice', 'customer.name', 'sales.created_at', 'sales.biaya_total', 'users.name')
        .where('sales.invoice', 'like', `%${name}%`)
        .orderBy('sales.created_at', 'desc')
        .limit(limit)
        .offset(offset);
>>>>>>> 7e5e88e (web only)

    const pnjtotal = await db('sales')
        .where('invoice', 'like', `%${name}%`)
        .count('id as count')
        .first();

    const pgtotal = Math.ceil(pnjtotal.count / limit);

    res.json({
        penjualans: pnj,
        currentPage: page,
        totalPage: pgtotal,
        hasNextPage: page < pgtotal,
        hasPreviousPage: page > 1
    });
});

penjualan.get('/:id', async (req, res) => {
    const id = req.params.id;
    
    // Query utama untuk penjualan
<<<<<<< HEAD
    const penjualan = await db('sales')
=======
    const penjualanRecord = await db('sales')
>>>>>>> 7e5e88e (web only)
        .leftJoin('customer', 'sales.customer_id', 'customer.id')
        .join('users', 'sales.user_id', 'users.id')
        .select(
            'sales.id',
            'sales.invoice',
            'customer.name as customer',
            'sales.created_at as tanggal_pembelian',
            'sales.biaya_total as total',
            'sales.tipe_penjualan as tipe_penjualan',
            'users.name as kasir'
        )
        .where('sales.id', id)
        .first();

    // Query untuk detail item
    const items = await db('detail_komponen_sale')
        .join('komponen', 'detail_komponen_sale.komponen_id', 'komponen.id')
        .select(
            'komponen.name as komponen_name',
            'detail_komponen_sale.jumlah',
            'detail_komponen_sale.harga_satuan',
        )
        .where('detail_komponen_sale.sales_id', id);

    // Gabungkan data penjualan dengan detail item
<<<<<<< HEAD
    penjualan.items = items;

    res.json(penjualan);
});


=======
    penjualanRecord.items = items;

    res.json(penjualanRecord);
});

>>>>>>> 7e5e88e (web only)
penjualan.delete('/:id', onlyAdmin('/auth/penjualan'), async (req, res) => {
    const id = req.params.id;
    try {
        await db.transaction(async trx => {
            await trx('sales').where('id', id).del();
            await trx('detail_komponen_sale').where('sales_id', id).del();
            return res.status(200).json({ message: 'Penjualan deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting penjualan:', error);
        return res.status(500).json({ message: 'Error deleting penjualan' });
    }
});

<<<<<<< HEAD
export default penjualan;
=======
module.exports = penjualan; // Export the router
>>>>>>> 7e5e88e (web only)
