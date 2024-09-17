import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import emailRoutes from './routes/emailRoutes.js';

const app = express();
const PORT = process.env.BACKEND_PORT || '3000';

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow running frontend and backend at the same time
app.use(cors()); 

// Use email routes
app.use('/', emailRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
