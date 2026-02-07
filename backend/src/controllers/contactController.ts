import { Request, Response } from 'express';
import Contact from '../models/Contact';
import axios from 'axios';

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!',
      data: contact 
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again.' 
    });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const count = await Contact.countDocuments({ status: 'new' });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const replyToContact = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // Send email using Brevo
    const emailData = {
      sender: {
        name: 'Kab Creative Lab',
        email: process.env.BREVO_EMAIL || 'kablab681@gmail.com',
      },
      to: [
        {
          email: contact.email,
          name: contact.name,
        },
      ],
      subject: `Re: ${contact.subject}`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #A97E50 0%, #C4A86D 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .message { background: white; padding: 20px; border-left: 4px solid #A97E50; margin: 20px 0; border-radius: 5px; }
            .original { background: #f5f5f5; padding: 15px; margin-top: 20px; border-radius: 5px; font-size: 14px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
            .logo { font-size: 24px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Kab Creative Lab</div>
              <p style="margin: 10px 0 0 0;">Thank you for contacting us!</p>
            </div>
            <div class="content">
              <p>Hi ${contact.name},</p>
              <div class="message">
                ${replyMessage.replace(/\n/g, '<br>')}
              </div>
              <div class="original">
                <strong>Your Original Message:</strong><br>
                <em>Subject: ${contact.subject}</em><br>
                <p style="margin-top: 10px;">${contact.message.replace(/\n/g, '<br>')}</p>
              </div>
              <div class="footer">
                <p><strong>Kab Creative Lab</strong></p>
                <p>Email: Kabcreativelab@gmail.com | Phone: +251 983 101 000</p>
                <p>Addis Ababa, Ethiopia</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    // Update contact status to replied
    contact.status = 'replied';
    await contact.save();

    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (error: any) {
    console.error('Reply error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send reply. Please try again.' 
    });
  }
};
