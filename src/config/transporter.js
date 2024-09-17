import dotenv from 'dotenv';
dotenv.config(); // Load environment variables again
// ( dotenv needs to be done here too for some reason, i guess it
//   runs before server.js? )

import nodemailer from 'nodemailer';

// configure host, port, and auth data for the email transporter

// Log environment variables to verify
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com.au', // Your Zoho SMTP server
    port: 465, 
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER, // Zoho email address
        pass: process.env.EMAIL_PASS // Zoho app password
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default transporter;