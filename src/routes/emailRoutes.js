import { Router } from 'express';
import transporter from '../config/transporter.js';

const router = Router();

// Route to send email
router.post('/send-email', async (req, res) => {
    const { email, subject, message } = req.body; // Get dynamic email data from the request body

    if (!email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'Email, subject, and message are required.' });
    }

    // Using personal email for now, since our test accounts aren't our own emails
    const mailOptions = {
        from: 'BookBank <bookbank@zohomail.com.au>',
        to: "camoarrow4586@gmail.com",  // Recipient email
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

export default router;
