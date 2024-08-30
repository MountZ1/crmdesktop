import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import path from 'path';
import router from './auth/index.js'
import { Index, Show } from './database/query.js';
import db from './database/config.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
import { app } from 'electron';

const env = path.join(app.getAppPath(), '.env');
dotenv.config({path: env});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const server = () => {
    const app = express();
    const port = 3000;

    app.use(session({
      secret: process.env.key,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set secure: true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));
    
    app.use(express.json());
    app.set('views', path.join(__dirname, './views'));
    app.set('view engine', 'ejs');
    
    app.use(express.urlencoded({ extended: true }));

    // app.use(flash());
    
    app.get("/", async (req, res) => {
      res.render("index");
    })

    app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      try {
          const user = await db('users').where({ username }).first();
          if (!user || !(await bcrypt.compare(password, user.password))) {
              // req.flash('error', 'Invalid username or password');
              return res.status(400).json({ message: 'Invalid username or password' }); // Return JSON with error message
          }
  
          req.session.user = user; // Set session
          return res.status(200).json({ redirect: '/auth/dashboard' }); // Return JSON with redirect URL
      } catch (error) {
          // req.flash('error', 'An error occurred while logging in');
          return res.status(500).json({ message: 'An error occurred while logging in' }); // Return JSON with error message
      }
    });

    app.use('/auth', router);
    
    app.get('/logout', (req, res) => {
      req.session.destroy(err => {
        if (err) {
          return res.redirect('/dashboard');
        }
        res.redirect('/');
      });
    });
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
}
