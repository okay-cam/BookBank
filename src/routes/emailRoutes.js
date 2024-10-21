import { Router } from 'express';
import transporter from '../config/transporter.js';

const router = Router();

// Route to send email
router.post('/send-email', async (req, res) => {
    const { email, subject, message, bcc } = req.body; // Get dynamic email data from the request body

    if (!email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'Email, subject, and message are required.' });
    }

    const mailOptions = {
        from: 'BookBank <bookbank@zohomail.com.au>',
        to: email,
        subject: subject,
        html: message,
        ...(bcc && { bcc }) // Conditionally include the bcc field if it exists
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

export default router;
