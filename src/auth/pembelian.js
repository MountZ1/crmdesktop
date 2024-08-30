import express from "express";
import db from "../database/config.js";
import { CountRow, Destroy } from "../database/query.js";

const pembelian = express.Router();

pembelian.get('/', async (req, res) => {
    res.render('pembelian/index', { user: req.session.user, title: "Pembelian" });
})

pembelian.get('/sp', async (req, res) => {
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const pmb = await db('pembelian').join('supplier', 'supplier.id', '=', 'pembelian.supplier_id').select('pembelian.*', 'supplier.name as supplier').where('pembelian.invoice', 'like', `%${name}%`).limit(limit).offset(offset);
    const pmbtotal = await CountRow('pembelian', 'id as count').where('invoice', 'like', `%${name}%`);
    const pgtotal = Math.ceil(pmbtotal[0].count / limit);
    res.json({
        pembelians: pmb,
        currentPage: page,
        totalPage: pgtotal,
        hasNextPage: page < pgtotal,
        hasPreviousPage: page > 1
    });
})

pembelian.get('/create', (req, res) => {
    res.render('pembelian/create', { user: req.session.user, title: "Pembelian" });
})

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
                    pembelian_id: pembelianId,  // Use the ID directly
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


pembelian.get('/detail/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        // Fetch the main pembelian record
        const pembelian = await db('pembelian')
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
        
        if (!pembelian) {
            return res.status(404).json({ message: 'Pembelian not found' });
        }
        
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
        
        // Format response
        res.json({
            id: pembelian.id,
            invoice: pembelian.invoice,
            supplier: { name: pembelian.supplier_name, supplier_id: pembelian.supplier_id },
            tanggal_pembelian: pembelian.tanggal_pembelian, // Keep as is for client-side formatting
            total: pembelian.total,
            details: details // Nested details
        });
    } catch (error) {
        console.error('Error fetching pembelian detail:', error);
        res.status(500).json({ message: 'Error fetching pembelian detail', error: error.message });
    }
});

pembelian.get('/show/:id', async (req, res) => {
    res.render('pembelian/update', { user: req.session.user, title: "Pembelian" });
})

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

            
            for (let i = 0; i < komponen_id.length; i++) {
                const existingDetail = await trx('detail_pembelian')
                    .where('pembelian_id', id)
                    .andWhere('komponen_id', komponen_id[i])
                    .first();

                    await trx('detail_pembelian')
                        .where('pembelian_id', id)
                        .andWhere('komponen_id', komponen_id[i])
                        .update({
                            jumlah: qty[i],
                            harga_satuan: harga_satuan[i]
                        });

                    const qtyDiff = qty[i] - existingDetail.jumlah;
                if (qtyDiff !== 0) {
                    await trx('komponen')
                        .where('id', komponen_id[i])
                        .increment('stock', qtyDiff);
                }
            }

            await trx.commit();
            return res.status(200).json({ message: 'Pembelian updated successfully' }).redirect('/auth/pembelian');
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

            await trx('pembelian').where('id', id).del();
        });
        return res.status(200).json({ message: 'Pembelian deleted successfully' });
    } catch (error) {
        console.error('Error deleting pembelian:', error);
        return res.status(500).json({ message: 'Error deleting pembelian', error: error.message });
    }
});


export default pembelian;