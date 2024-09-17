const nodemailer = require('nodemailer');

// configure host, port, and auth data for the email transporter

const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com.au', // Your Zoho SMTP server
    port: 465, 
    secure: true, 
    auth: {
        user: import.meta.env.VITE_EMAIL_USER, // Zoho email address
        pass: import.meta.env.VITE_EMAIL_PASS // Zoho app password
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;