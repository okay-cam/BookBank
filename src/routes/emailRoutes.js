const express = require('express');
const router = express.Router();
const transporter = require('../config/transporter');

// Route to send email
router.post('/send-email', async (req, res) => {
    const { email, subject, message } = req.body; // Get dynamic email data from the request body

    const mailOptions = {
        from: 'bookbank@zohomail.com.au',
        to: email,  // Recipient email
        subject: subject,  // Email subject
        text: message,  // Plain text version of the message
        html: `<p>${message}</p>`  // HTML version of the message
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
});

module.exports = router;
