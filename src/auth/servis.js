<<<<<<< HEAD
import express from "express";
import db from '../database/config.js'
import generateInvoiceNumber from "../lib/invoiceGenerator.js"
import { CountRow, Destroy } from "../database/query.js";
import { authMiddleware, onlyAdmin } from '../middleware/index.js';
=======
const express = require('express');
const db = require('../database/config');
const generateInvoiceNumber = require("../lib/invoiceGenerator");
const { CountRow, Destroy } = require("../database/query");
const { authMiddleware, onlyAdmin } = require('../middleware/index');
>>>>>>> 7e5e88e (web only)

const servis = express.Router();

const createInvoice = () => {
    const invoiceNumber = generateInvoiceNumber();
<<<<<<< HEAD
    return invoiceNumber
}
=======
    return invoiceNumber;
};
>>>>>>> 7e5e88e (web only)

servis.get('/create', (req, res) => {
    res.render('servis/create', { user: req.session.user, title: "Servis" });
});

servis.post('/', async (req, res) => {
    const { customer, customer_nama, kasir, total, device, items, servis, status_bayar, bayar } = req.body;
    let phone = customer.startsWith('0') ? '62' + customer.slice(1) : customer;
    let terutang = 0;
    if (total > bayar){
<<<<<<< HEAD
        terutang = parseInt(total) - parseInt(bayar)
=======
        terutang = parseInt(total) - parseInt(bayar);
>>>>>>> 7e5e88e (web only)
    }

    try {
        await db.transaction(async trx => {
            // 1. Get customer id or create new customer
            let customerResult = await trx('customer')
                .select('id', 'total_service')
                .where('no_telp', phone)
                .first();

            if (!customerResult) {
                const [newCustomerId] = await trx('customer').insert({
                    name: customer_nama,
                    no_telp: phone,
                    total_service: 0
                });
                customerResult = { id: newCustomerId, total_service: 0 };
            }

            const customerId = customerResult.id;
            const currentTotalService = customerResult.total_service || 0;

            // 2. Insert into sales
<<<<<<< HEAD
            const invoice = createInvoice(); // Assume this function exists
=======
            const invoice = createInvoice();
>>>>>>> 7e5e88e (web only)
            const bon = invoice.slice(-5);

            // Check if a sales record with this invoice already exists
            const existingSale = await trx('sales')
                .where('invoice', invoice)
                .first();

            if (existingSale) {
                return res.status(409).json({ error: 'Duplicate invoice. Please try again.' });
            }

            const [salesId] = await trx('sales').insert({
                invoice,
                customer_id: customerId,
                user_id: kasir,
                status_bayar: status_bayar,
                bayar: bayar,
                biaya_total: total,
                terutang: terutang,
                tipe_penjualan: 'servis'
            });

            // 3. Insert into detail_servis_sale
            for (const service of servis) {
                await trx('detail_servis_sale').insert({
                    sales_id: salesId,
                    device,
                    kode_bon: bon,
                    status: 'pending',
                    masalah: service.masalah,
                    biaya_perbaikan: service.biaya
                });
            }

            // 4. Insert into detail_komponen_sale if items exist
            if (items && items.length > 0) {
                for (const item of items) {
<<<<<<< HEAD
                    // Check if item is already inserted
=======
>>>>>>> 7e5e88e (web only)
                    const existingItem = await trx('detail_komponen_sale')
                        .where({
                            sales_id: salesId,
                            komponen_id: item.komponen_id
                        })
                        .first();

                    if (!existingItem) {
                        await trx('detail_komponen_sale').insert({
                            sales_id: salesId,
                            komponen_id: item.komponen_id,
                            jumlah: item.qty,
                            harga_satuan: item.harga_satuan
                        });

<<<<<<< HEAD
                        // 5. Update stock komponen
=======
>>>>>>> 7e5e88e (web only)
                        await trx('komponen')
                            .where('id', item.komponen_id)
                            .decrement('stock', item.qty);
                    }
                }
            }

            // 6. Update customer's total_service
            await trx('customer')
                .where('id', customerId)
                .update({
                    total_service: currentTotalService + 1
                });

            await trx.commit();
        });

        res.status(201).json({ message: 'Service created successfully' });
    } catch (error) {
        console.error('Error creating service:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Duplicate entry. Please try again.' });
        }
        res.status(500).json({ error: 'An error occurred while creating the service' });
    }
});

<<<<<<< HEAD

=======
>>>>>>> 7e5e88e (web only)
servis.get('/', (req, res) => {
    res.render('servis/index', { user: req.session.user, title: "Servis" });
});

servis.get('/history', onlyAdmin('/auth/servis'), (req, res) => {
    res.render('servis/history', { user: req.session.user, title: "Servis History" });
});

servis.get('/srv/hist', onlyAdmin('/auth/servis'), async (req, res) => {
    const name = req.query.name || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const srv = await db('sales')
            .leftJoin('customer', 'sales.customer_id', 'customer.id')
            .leftJoin('users', 'sales.user_id', 'users.id')
            .leftJoin('detail_servis_sale', 'sales.id', 'detail_servis_sale.sales_id')
            .select(
                'sales.id',
                'sales.invoice as invoice',
                'detail_servis_sale.tanggal_selesai as tanggal_selesai',
<<<<<<< HEAD
=======
                'detail_servis_sale.status as status',
>>>>>>> 7e5e88e (web only)
                'customer.name as customer',
                'customer.no_telp as no_telp',
                'sales.created_at as tanggal_servis',
                'sales.status_bayar as status_bayar',
                'sales.bayar as terbayar',
                'sales.terutang as terutang',
                'sales.biaya_total as total'
            )
            .where('sales.tipe_penjualan', 'servis')
<<<<<<< HEAD
            .whereIn('detail_servis_sale.status', ['selesai'])
=======
            .whereIn('detail_servis_sale.status', ['selesai', 'cancel'])
>>>>>>> 7e5e88e (web only)
            .andWhere(function() {
                this.where('customer.name', 'like', `%${name}%`)
                    .orWhere('sales.invoice', 'like', `%${name}%`);
            })
            .orderBy('sales.created_at', 'desc')
<<<<<<< HEAD
            .distinct('sales.id') // Ensure distinct sales IDs
            .limit(limit)
            .offset(offset);

        // Count total records
=======
            .distinct('sales.id')
            .limit(limit)
            .offset(offset);

>>>>>>> 7e5e88e (web only)
        const count = await db('sales')
            .leftJoin('customer', 'sales.customer_id', 'customer.id')
            .join('detail_servis_sale', 'sales.id', 'detail_servis_sale.sales_id')
            .where('sales.tipe_penjualan', 'servis')
            .whereIn('detail_servis_sale.status', ['selesai'])
            .andWhere(function() {
                this.where('customer.name', 'like', `%${name}%`)
                    .orWhere('detail_servis_sale.kode_bon', 'like', `%${name}%`);
            })
            .count('sales.id as count')
            .first();

<<<<<<< HEAD
        // Format the response
=======
>>>>>>> 7e5e88e (web only)
        res.json({
            services: srv,
            currentPage: page,
            totalPage: Math.ceil(count.count / limit),
            hasNextPage: page < Math.ceil(count.count / limit),
            hasPreviousPage: page > 1
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'An error occurred while fetching services' });
    }
});

servis.get('/srv', async (req, res) => {
    const name = req.query.name || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
<<<<<<< HEAD
        // Fetch service records with distinct sales
=======
>>>>>>> 7e5e88e (web only)
        const srv = await db('sales')
            .leftJoin('customer', 'sales.customer_id', 'customer.id')
            .leftJoin('users', 'sales.user_id', 'users.id')
            .leftJoin('detail_servis_sale', 'sales.id', 'detail_servis_sale.sales_id')
            .select(
                'sales.id',
                'detail_servis_sale.kode_bon as bon',
                'detail_servis_sale.status as status',
                'customer.name as customer',
                'customer.no_telp as no_telp',
                'sales.created_at as tanggal_servis',
                'sales.status_bayar as status_bayar',
                'sales.bayar as terbayar',
                'sales.terutang as terutang',
                'sales.biaya_total as total'
            )
            .where('sales.tipe_penjualan', 'servis')
            .whereIn('detail_servis_sale.status', ['pending', 'proses'])
            .andWhere(function() {
                this.where('customer.name', 'like', `%${name}%`)
                    .orWhere('detail_servis_sale.kode_bon', 'like', `%${name}%`);
            })
            .orderBy('sales.created_at', 'desc')
<<<<<<< HEAD
            .distinct('sales.id') // Ensure distinct sales IDs
            .limit(limit)
            .offset(offset);

        // Count total records
=======
            .distinct('sales.id')
            .limit(limit)
            .offset(offset);

>>>>>>> 7e5e88e (web only)
        const count = await db('sales')
            .join('detail_servis_sale', 'sales.id', 'detail_servis_sale.sales_id')
            .where('sales.tipe_penjualan', 'servis')
            .whereIn('detail_servis_sale.status', ['pending', 'proses'])
            .count('sales.id as count')
            .first();

<<<<<<< HEAD
        // Format the response
=======
>>>>>>> 7e5e88e (web only)
        res.json({
            services: srv,
            currentPage: page,
            totalPage: Math.ceil(count.count / limit),
            hasNextPage: page < Math.ceil(count.count / limit),
            hasPreviousPage: page > 1
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'An error occurred while fetching services' });
    }
});

<<<<<<< HEAD

servis.get('/show/:id', async (req, res) => {
    res.render('servis/update', { user: req.session.user, title: "Servis" });
})
=======
servis.get('/show/:id', async (req, res) => {
    res.render('servis/update', { user: req.session.user, title: "Servis" });
});
>>>>>>> 7e5e88e (web only)

servis.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
<<<<<<< HEAD
        // Query sales data with joins
=======
>>>>>>> 7e5e88e (web only)
        const salesData = await db('sales')
            .leftJoin('customer', 'sales.customer_id', 'customer.id')
            .leftJoin('users', 'sales.user_id', 'users.id')
            .leftJoin('detail_servis_sale', 'sales.id', 'detail_servis_sale.sales_id')
            .leftJoin('detail_komponen_sale', 'sales.id', 'detail_komponen_sale.sales_id')
            .leftJoin('komponen', 'detail_komponen_sale.komponen_id', 'komponen.id')
            .select(
                'sales.id as sales_id',
                'sales.invoice',
                'customer.name as customer_name',
                'customer.id as customer_id',
                'customer.no_telp as customer_no_telp',
                'users.name as kasir_name',
                'sales.created_at',
                'sales.status_bayar',
                'sales.terutang',
                'sales.bayar',
                'sales.biaya_total',
                'detail_servis_sale.device',
                'detail_servis_sale.id as servis_id',
                'detail_servis_sale.masalah',
                'detail_servis_sale.biaya_perbaikan',
                'komponen.name as komponen_name',
                'detail_servis_sale.status as status',
                'detail_komponen_sale.komponen_id',
                'detail_komponen_sale.jumlah',
                'detail_komponen_sale.harga_satuan'
            )
            .where('sales.id', id);

        if (salesData.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

<<<<<<< HEAD
        // Initialize containers for items and services
        const items = [];
        const services = [];

        // Process the sales data
        salesData.forEach(row => {
            // Add items
=======
        const items = [];
        const services = [];

        salesData.forEach(row => {
>>>>>>> 7e5e88e (web only)
            if (row.komponen_id) {
                items.push({
                    id: row.komponen_id,
                    komponen: row.komponen_name,
                    jumlah: row.jumlah,
                    harga: row.harga_satuan
                });
            }

<<<<<<< HEAD
            // Add services
=======
>>>>>>> 7e5e88e (web only)
            if (row.servis_id) {
                services.push({
                    id: row.servis_id,
                    device: row.device,
                    masalah: row.masalah,
                    biaya: row.biaya_perbaikan
                });
            }
        });

<<<<<<< HEAD
        // Remove duplicates
=======
>>>>>>> 7e5e88e (web only)
        const uniqueItems = Array.from(new Set(items.map(item => item.id)))
            .map(id => items.find(item => item.id === id));

        const uniqueServices = Array.from(new Set(services.map(service => service.id)))
            .map(id => services.find(service => service.id === id));

<<<<<<< HEAD
        // Format the response
=======
>>>>>>> 7e5e88e (web only)
        const response = {
            id: salesData[0].sales_id,
            invoice: salesData[0].invoice,
            customer: salesData[0].customer_name,
            bayar: salesData[0].bayar,
            customer_no_telp: salesData[0].customer_no_telp,
            device: salesData[0].device,
            status: salesData[0].status,
            kasir: salesData[0].kasir_name,
            created_at: salesData[0].created_at,
            status_bayar: salesData[0].status_bayar,
            biaya_total: salesData[0].biaya_total,
            items: uniqueItems,
            servis: uniqueServices
        };

        return res.json(response);
    } catch (error) {
        console.error('Error fetching service:', error);
        return res.status(500).json({ error: 'An error occurred while fetching the service' });
    }
});

<<<<<<< HEAD

=======
>>>>>>> 7e5e88e (web only)
servis.put('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { servis, items, terutang, total } = req.body;

    try {
        await db.transaction(async trx => {
<<<<<<< HEAD
            // Fetch the invoice and current biaya_total from the sales table
=======
>>>>>>> 7e5e88e (web only)
            const salesRecord = await trx('sales')
                .where('id', id)
                .select('invoice', 'biaya_total', 'status_bayar', 'terutang')
                .first();

            if (!salesRecord) {
                return res.status(404).json({ message: 'Sales record not found' });
            }

            const invoice = salesRecord.invoice;
<<<<<<< HEAD
            const kode_bon = invoice.slice(-5); // Get the last 5 digits of the invoice

            // Fetch existing records before deletion
=======
            const kode_bon = invoice.slice(-5);

>>>>>>> 7e5e88e (web only)
            const existingKomponen = await trx('detail_komponen_sale').where('sales_id', id);
            const existingServis = await trx('detail_servis_sale').where('sales_id', id);
            const device = existingServis[0].device;
            const status = existingServis[0].status;

<<<<<<< HEAD
            // Delete existing komponen and servis details
=======
>>>>>>> 7e5e88e (web only)
            await trx('detail_komponen_sale').where('sales_id', id).del();
            await trx('detail_servis_sale').where('sales_id', id).del();

            // Handle items
<<<<<<< HEAD
            for (const item of items) {
                const existingItem = existingKomponen.find(i => i.komponen_id === item.komponen_id);
                if (!existingItem) {
=======
            if (items && items.length > 0) {
                for (const item of items) {
                    // Insert new komponen detail
>>>>>>> 7e5e88e (web only)
                    await trx('detail_komponen_sale').insert({
                        sales_id: id,
                        komponen_id: item.komponen_id,
                        jumlah: item.qty,
                        harga_satuan: item.harga_satuan,
                    });
<<<<<<< HEAD
                } else {
                    await trx('detail_komponen_sale')
                        .where('sales_id', id)
                        .where('komponen_id', item.komponen_id)
                        .update({
                            jumlah: item.qty,
                            harga_satuan: item.harga_satuan,
                        });
                }

                await trx('komponen').where('id', item.komponen_id).decrement('stock', item.qty);
=======

                    // Find the existing item to calculate stock difference
                    const existingItem = existingKomponen.find(i => i.komponen_id === item.komponen_id);
                    const stockDifference = existingItem ? item.qty - existingItem.jumlah : item.qty;

                    // Update stock only if there's a difference
                    if (stockDifference !== 0) {
                        await trx('komponen')
                            .where('id', item.komponen_id)
                            .decrement('stock', stockDifference);
                    }
                }
>>>>>>> 7e5e88e (web only)
            }

            // Handle servis
            for (const srv of servis) {
                await trx('detail_servis_sale').insert({
                    sales_id: id,
                    masalah: srv.masalah,
                    biaya_perbaikan: srv.biaya,
                    kode_bon: kode_bon,
                    device: device,
                    status: status,
                });
            }

            await trx('sales').where('id', id).update({
                status_bayar: terutang > 0 ? 'Belum lunas' : 'Lunas',
                terutang: terutang,
                biaya_total: total
            });

            await trx.commit();
        });

        res.status(200).json({ message: 'Update successful' });
    } catch (error) {
        console.error('Error updating records:', error);
        res.status(500).json({ message: 'Failed to update records' });
    }
});

servis.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const currentDate = new Date();

    try {
        // Create the update object
<<<<<<< HEAD
        let updateData = { status: status };

        // If the status is "selesai", add the tanggal_selesai field with the current date
        if (status === 'selesai') {
            updateData.tanggal_selesai = currentDate.toISOString().slice(0, 10);

            const tanggalMulai = currentDate.toISOString().slice(0, 10);
            const futureDate = new Date();
            futureDate.setDate(currentDate.getDate() + 30);
            const tanggalSelesai = futureDate.toISOString().slice(0, 10);

            try {
                await db('garansi').insert({
                    sales_id: id,
                    tanggal_mulai: tanggalMulai,
                    tanggal_berakhir: tanggalSelesai,
                    status: 'Belum Dipakai'
                });
            } catch (error) {
                console.error('Error inserting data:', error);
            }
        }
=======
        let updateData = { 
            status: status,
            tanggal_selesai: currentDate.toISOString().slice(0, 10)
        };
>>>>>>> 7e5e88e (web only)

        // Update the database
        await db('detail_servis_sale')
            .where('sales_id', id)
            .update(updateData);

        res.status(200).json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error('Error updating service:', error);
        res.sendStatus(500);
    }
});

servis.put('/lunas/:id', async (req, res) => {
    const id = req.params.id;
<<<<<<< HEAD
    try{
=======
    try {
>>>>>>> 7e5e88e (web only)
        const data = await db('sales').where('id', id).select('biaya_total').first();
        await db('sales').where('id', id).update({
            status_bayar: 'Lunas',
            terutang: 0,
            bayar: data.biaya_total,
        });
        res.status(200).json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error('Error updating service:', error);
        res.sendStatus(500);
    }
<<<<<<< HEAD
})
=======
});
>>>>>>> 7e5e88e (web only)

servis.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await db('sales').where('id', id).del();
        await db('detail_servis_sale').where('sales_id', id).del();
        await db('detail_komponen_sale').where('sales_id', id).del();
<<<<<<< HEAD
        res.sendStatus(200);
=======
        res.status(200).json({ message: 'Data deleted successfully' });
>>>>>>> 7e5e88e (web only)
    } catch (error) {
        console.error('Error deleting service:', error);
        res.sendStatus(500);
    }
});

<<<<<<< HEAD
export default servis;
=======
module.exports = servis;
>>>>>>> 7e5e88e (web only)
