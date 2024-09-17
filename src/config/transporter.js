import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// configure host, port, and auth data for the email transporter

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