export interface EmailData {
    email: string;
    subject: string;
    message: string;
}

export const sendEmail = async (emailData: EmailData): Promise<string> => {
    try {
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),  // Send dynamic email data
        });

        const result = await response.json();

        if (result.success) {
            return 'Email sent successfully!';
        } else {
            throw new Error(result.message || 'Failed to send email');
        }
    } catch (error: any) {
        throw new Error(error.message || 'Failed to send email');
    }
};