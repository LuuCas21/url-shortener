import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import connectDB from './database/connectDB.js';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { router, redirRouter } from './routes/urlRoutes.js';

dotenv.config({ path: './config.env' });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SETUP VIEW
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = process.env.PORT;
const DB_URL = process.env.DATABASE_URL.replace('<password>', process.env.DATABASE_PASSWORD);

app.use('/', redirRouter);
app.use('/api', router);

connectDB(DB_URL);

app.listen(port, () => console.log(`App is running on port ${port}`));