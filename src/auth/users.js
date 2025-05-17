<<<<<<< HEAD
import express from 'express';
import { Destroy, Show, Store, Update, Search, CountRow } from '../database/query.js';
import bcrypt from 'bcryptjs';
import db from '../database/config.js';

const users = express.Router();

users.get('/', async (req, res) => {
    res.render('users', { user: req.session.user, title: "Users"});
=======
const express = require('express');
const { Destroy, Show, Store, Update, Search, CountRow } = require('../database/query.js');
const { authMiddleware, onlyAdmin } = require('../middleware/index.js');
const bcrypt = require('bcryptjs');
const db = require('../database/config.js');

const users = express.Router();

users.get('/', onlyAdmin('/auth/dashboard'), async (req, res) => {
    res.render('users', { user: req.session.user, title: "Users" });
>>>>>>> 7e5e88e (web only)
});

users.get('/get', async (req, res) => {
    db('users').select(['id', 'name']).then((users) => {
        return res.status(200).json(users);
<<<<<<< HEAD
    })
})
=======
    });
});
>>>>>>> 7e5e88e (web only)

users.get('/usr', async (req, res) => {
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const us = await Search('users', ['name', 'like', `%${name}%`], limit, offset);
    const ustotal = await CountRow('users', 'id as count').where('name', 'like', `%${name}%`);
    const pgtotal = Math.ceil(ustotal[0].count / limit);
    res.json({
        users: us,
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

users.post('/', async (req, res) => {
    const { name, username, password, role } = req.body;
    try {
        await Store('users', { 
            name: name,
            username: username,
            password: await bcrypt.hash(password, 10), 
            role: role, 
        });
        return res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Error creating user' });
    }
});

<<<<<<< HEAD

=======
>>>>>>> 7e5e88e (web only)
users.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Show('users', { id: id }, ['id', 'name', 'username', 'role']);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        return res.status(500).json({ message: 'Error retrieving user' });
    }
});

<<<<<<< HEAD
users.put('/:name', async (req, res) => {
    const { name, username, role, id } = req.body;
    try{
=======
users.put('/:id', async (req, res) => { // changed ':name' to ':id'
    const { name, username, role } = req.body;
    const id = req.params.id; // Use id from params
    try {
>>>>>>> 7e5e88e (web only)
        await Update('users', {
            name: name,
            username: username,
            role: role,
        }, { id: id });
        return res.status(200).json({ message: 'User updated successfully' });
<<<<<<< HEAD
    } catch(error){
=======
    } catch (error) {
>>>>>>> 7e5e88e (web only)
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Error updating user' });
    }
});

users.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Destroy('users', { id: id });
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Error deleting user' });
    }
<<<<<<< HEAD
})

export default users;
=======
});

module.exports = users;
>>>>>>> 7e5e88e (web only)
