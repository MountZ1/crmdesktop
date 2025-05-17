<<<<<<< HEAD
import express from 'express';
import {  CountRow, Destroy, Search, Show, Store, Update  } from '../database/query.js';
import db from '../database/config.js';

const customers = express.Router();


customers.get('/', async (req, res) => {
    res.render('customers', {title: "Customers", user: req.session.user});
=======
const express = require('express');
const { CountRow, Destroy, Search, Show, Store, Update } = require('../database/query.js');
const db = require('../database/config.js');

const customers = express.Router();

customers.get('/', async (req, res) => {
    res.render('customers', { title: "Customers", user: req.session.user });
>>>>>>> 7e5e88e (web only)
});

customers.get('/cust', async (req, res) => {
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const cs = await Search('customer', ['name', 'like', `%${name}%`], limit, offset);
    const cstotal = await CountRow('customer', 'id as count').where('name', 'like', `%${name}%`);
    const pgtotal = Math.ceil(cstotal[0].count / limit);
<<<<<<< HEAD
=======
    
>>>>>>> 7e5e88e (web only)
    res.json({
        customers: cs,
        currentPage: page,
        totalPage: pgtotal,
        hasNextPage: page < pgtotal,
        hasPreviousPage: page > 1
    });
<<<<<<< HEAD
})
=======
});
>>>>>>> 7e5e88e (web only)

customers.get('/get', async (req, res) => {
    db('customer').select(['id', 'name', 'no_telp', 'total_service']).then((customers) => {
        return res.status(200).json(customers);
<<<<<<< HEAD
    })
})
=======
    });
});
>>>>>>> 7e5e88e (web only)

customers.post('/', async (req, res) => {
    let { name, no_telp } = req.body;
    if (no_telp.startsWith('0')) {
        no_telp = '62' + no_telp.slice(1);
    }

    try {
        await Store('customer', {
            name: name,
            no_telp: no_telp,
            total_service: 1
        });
        return res.status(200).json({ message: 'Customer created successfully' });
    } catch (error) {
        console.error('Error creating customer:', error);
        return res.status(500).json({ message: 'Error creating customer' });
    }
});

customers.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const customer = await Show('customer', { id: id }, ['name', 'no_telp']);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        return res.status(200).json(customer);
<<<<<<< HEAD
    }catch(error){
        console.log(`Error retrieving customer: ${error}`);
        return res.status(500).json({ message: 'Error retrieving customer' });
    }
})
=======
    } catch (error) {
        console.log(`Error retrieving customer: ${error}`);
        return res.status(500).json({ message: 'Error retrieving customer' });
    }
});
>>>>>>> 7e5e88e (web only)

customers.put('/:id', async (req, res) => {
    let { name, no_telp, id } = req.body;
    if (no_telp.startsWith('0')) {
        no_telp = '62' + no_telp.slice(1);
    }
    try {
        await Update('customer', {
            name: name,
            no_telp: no_telp
        }, { id: id });
        return res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error('Error updating customer:', error);
        return res.status(500).json({ message: 'Error updating customer' });
    }
<<<<<<< HEAD
})
=======
});
>>>>>>> 7e5e88e (web only)

customers.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Destroy('customer', { id: id });
        return res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return res.status(500).json({ message: 'Error deleting customer' });
    }
<<<<<<< HEAD
})

export default customers;
=======
});

module.exports = customers; // Export the router
>>>>>>> 7e5e88e (web only)
