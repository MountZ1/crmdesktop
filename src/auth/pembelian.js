<<<<<<< HEAD
import express from "express";
import db from "../database/config.js";
import { CountRow, Destroy } from "../database/query.js";
=======
const express = require("express");
const db = require("../database/config.js");
const { CountRow, Destroy } = require("../database/query.js");
const { onlyAdmin } = require("../middleware/index.js");
>>>>>>> 7e5e88e (web only)

const pembelian = express.Router();

pembelian.get('/', async (req, res) => {
    res.render('pembelian/index', { user: req.session.user, title: "Pembelian" });
<<<<<<< HEAD
})
=======
});
>>>>>>> 7e5e88e (web only)

pembelian.get('/sp', async (req, res) => {
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
<<<<<<< HEAD
    const pmb = await db('pembelian').join('supplier', 'supplier.id', '=', 'pembelian.supplier_id').select('pembelian.*', 'supplier.name as supplier').where('pembelian.invoice', 'like', `%${name}%`).limit(limit).offset(offset);
=======
    const pmb = await db('pembelian')
        .join('supplier', 'supplier.id', '=', 'pembelian.supplier_id')
        .select('pembelian.*', 'supplier.name as supplier')
        .where('pembelian.invoice', 'like', `%${name}%`)
        .limit(limit)
        .offset(offset);
>>>>>>> 7e5e88e (web only)
    const pmbtotal = await CountRow('pembelian', 'id as count').where('invoice', 'like', `%${name}%`);
    const pgtotal = Math.ceil(pmbtotal[0].count / limit);
    res.json({
        pembelians: pmb,
        currentPage: page,
        totalPage: pgtotal,
        hasNextPage: page < pgtotal,
        hasPreviousPage: page > 1
    });
<<<<<<< HEAD
})

pembelian.get('/create', (req, res) => {
    res.render('pembelian/create', { user: req.session.user, title: "Pembelian" });
})
=======
});

pembelian.get('/create', onlyAdmin('/auth/pembelian/'), (req, res) => {
    res.render('pembelian/create', { user: req.session.user, title: "Pembelian" });
});
>>>>>>> 7e5e88e (web only)

pembelian.post('/create', async (req, res) => {
    const { supplier_id, total, invoice, items } = req.body;

    // Validasi input
    if (!supplier_id || !total || !invoice || !items || !items.length) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        await db.transaction(async trx => {
            // Insert pembelian utama
            const [pembelianId] = await trx('pembelian').insert({
                invoice,
                supplier_id,
                total,
                tanggal_pembelian: trx.fn.now()
            });

            // Insert detail pembelian dan update stok komponen
            for (const item of items) {
                await trx('detail_pembelian').insert({
<<<<<<< HEAD
                    pembelian_id: pembelianId,  // Use the ID directly
=======
                    pembelian_id: pembelianId,
>>>>>>> 7e5e88e (web only)
                    komponen_id: item.komponen_id,
                    jumlah: item.qty,
                    harga_satuan: item.harga_satuan
                });

                // Update stok komponen
                await trx('komponen')
                    .where('id', item.komponen_id)
                    .increment('stock', item.qty);
            }

            await trx.commit();
            return res.status(200).json({ message: 'Pembelian created successfully and stock updated', id: pembelianId });
        });
    } catch (error) {
        console.error('Error creating pembelian:', error);
        return res.status(500).json({ message: 'Error creating pembelian', error: error.message });
    }
});

<<<<<<< HEAD

pembelian.get('/detail/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Fetch the main pembelian record
        const pembelian = await db('pembelian')
=======
pembelian.get('/detail/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the main pembelian record
        const pembelianRecord = await db('pembelian')
>>>>>>> 7e5e88e (web only)
            .join('supplier', 'pembelian.supplier_id', 'supplier.id')
            .where('pembelian.id', id)
            .select(
                'pembelian.id',
                'pembelian.invoice',
                'supplier.name as supplier_name',
                'supplier.id as supplier_id',
                'pembelian.tanggal_pembelian',
                'pembelian.total'
            )
            .first();
<<<<<<< HEAD
        
        if (!pembelian) {
            return res.status(404).json({ message: 'Pembelian not found' });
        }
        
=======

        if (!pembelianRecord) {
            return res.status(404).json({ message: 'Pembelian not found' });
        }

>>>>>>> 7e5e88e (web only)
        // Fetch the detail records
        const details = await db('detail_pembelian')
            .join('komponen', 'detail_pembelian.komponen_id', 'komponen.id')
            .where('detail_pembelian.pembelian_id', id)
            .select(
                'komponen.id as komponen_id',
                'komponen.kd_barang as komponen_kd',
                'komponen.name as komponen_name',
                'detail_pembelian.harga_satuan',
                'detail_pembelian.jumlah'
            );
<<<<<<< HEAD
        
        // Format response
        res.json({
            id: pembelian.id,
            invoice: pembelian.invoice,
            supplier: { name: pembelian.supplier_name, supplier_id: pembelian.supplier_id },
            tanggal_pembelian: pembelian.tanggal_pembelian, // Keep as is for client-side formatting
            total: pembelian.total,
            details: details // Nested details
=======

        // Format response
        res.json({
            id: pembelianRecord.id,
            invoice: pembelianRecord.invoice,
            supplier: { name: pembelianRecord.supplier_name, supplier_id: pembelianRecord.supplier_id },
            tanggal_pembelian: pembelianRecord.tanggal_pembelian,
            total: pembelianRecord.total,
            details: details
>>>>>>> 7e5e88e (web only)
        });
    } catch (error) {
        console.error('Error fetching pembelian detail:', error);
        res.status(500).json({ message: 'Error fetching pembelian detail', error: error.message });
    }
});

<<<<<<< HEAD
pembelian.get('/show/:id', async (req, res) => {
    res.render('pembelian/update', { user: req.session.user, title: "Pembelian" });
})
=======
pembelian.get('/show/:id', onlyAdmin('/auth/pembelian/'), async (req, res) => {
    res.render('pembelian/update', { user: req.session.user, title: "Pembelian" });
});
>>>>>>> 7e5e88e (web only)

pembelian.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { supplier_id, total, komponen_id, qty, harga_satuan, invoice } = req.body;

    if (!supplier_id || !total || !komponen_id || !qty || !harga_satuan || !invoice) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        await db.transaction(async trx => {
            // Update pembelian utama
            await trx('pembelian')
                .where('id', id)
                .update({
                    supplier_id,
                    total,
                    invoice
                });

<<<<<<< HEAD
            
=======
>>>>>>> 7e5e88e (web only)
            for (let i = 0; i < komponen_id.length; i++) {
                const existingDetail = await trx('detail_pembelian')
                    .where('pembelian_id', id)
                    .andWhere('komponen_id', komponen_id[i])
                    .first();

<<<<<<< HEAD
                    await trx('detail_pembelian')
                        .where('pembelian_id', id)
                        .andWhere('komponen_id', komponen_id[i])
                        .update({
                            jumlah: qty[i],
                            harga_satuan: harga_satuan[i]
                        });

                    const qtyDiff = qty[i] - existingDetail.jumlah;
=======
                await trx('detail_pembelian')
                    .where('pembelian_id', id)
                    .andWhere('komponen_id', komponen_id[i])
                    .update({
                        jumlah: qty[i],
                        harga_satuan: harga_satuan[i]
                    });

                const qtyDiff = qty[i] - existingDetail.jumlah;
>>>>>>> 7e5e88e (web only)
                if (qtyDiff !== 0) {
                    await trx('komponen')
                        .where('id', komponen_id[i])
                        .increment('stock', qtyDiff);
                }
            }

            await trx.commit();
<<<<<<< HEAD
            return res.status(200).json({ message: 'Pembelian updated successfully' }).redirect('/auth/pembelian');
=======
            return res.status(200).json({ message: 'Pembelian updated successfully' });
>>>>>>> 7e5e88e (web only)
        });
    } catch (error) {
        console.error('Error updating pembelian:', error);
        return res.status(500).json({ message: 'Error updating pembelian', error: error.message });
    }
});

pembelian.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.transaction(async trx => {
            await trx('detail_pembelian').where('pembelian_id', id).del();
<<<<<<< HEAD

=======
>>>>>>> 7e5e88e (web only)
            await trx('pembelian').where('id', id).del();
        });
        return res.status(200).json({ message: 'Pembelian deleted successfully' });
    } catch (error) {
        console.error('Error deleting pembelian:', error);
        return res.status(500).json({ message: 'Error deleting pembelian', error: error.message });
    }
});

<<<<<<< HEAD

export default pembelian;
=======
module.exports = pembelian; // Export the router
>>>>>>> 7e5e88e (web only)
