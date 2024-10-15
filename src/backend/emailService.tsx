// Email data must contain an email, subject and message
export interface EmailData {
    email: string; // recipient email
    subject: string;
    message: string;
    bcc?: string;
}


export const prepareSendingEmail = async (toEmail : string, subjectText : string, formattedMessage : string, bccString? : string) => {
    const emailData: EmailData = {
      email: toEmail, // send email to the testbook owner's email
      subject: subjectText,
      message: formattedMessage,
    };

    if (bccString) {
        emailData.bcc = bccString; // Assign bccString if it exists
    }  

    console.log("email data: ", emailData);

    try {
      await sendEmail(emailData);
      return true;
    } catch (error: any) {
    throw new Error(`Email failed: ${error.message}`);
      return false;
    }
  };

  

export const sendEmail = async (emailData: EmailData): Promise<string> => {

    // prevent emails if disabled in the .env
    const isEmailEnabled: boolean = import.meta.env.VITE_SEND_EMAILS === 'true';
    if (!isEmailEnabled) {
        return 'Email is disabled in the .env file';
    }

    try {
        const backendPort = import.meta.env.VITE_BACKEND_PORT || '3000';
        const response = await fetch(`http://localhost:${backendPort}/send-email`, {
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