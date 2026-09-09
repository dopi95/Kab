import https from 'https';

export interface BookingNotificationData {
  packageName: string;
  packageCategory: 'event' | 'social_media';
  packagePrice: string;
  packageCurrency?: string;
  clientName?: string;
  phone?: string;
  email?: string;
  eventDate?: {
    european?: string;
    ethiopianAmharic?: string;
    ethiopianEnglish?: string;
  };
  notes?: string;
}

export interface ContactNotificationData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const escapeHtml = (str?: string): string => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

const sendTelegramRaw = (
  token: string,
  chatId: string,
  text: string,
  parseMode?: string
): Promise<{ ok: boolean; response: string }> => {
  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify({
        chat_id: chatId,
        text,
        ...(parseMode ? { parse_mode: parseMode } : {}),
      });

      const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ ok: res.statusCode === 200, response: data });
        });
      });

      req.on('error', (err) => {
        console.error('Telegram request error:', err.message);
        resolve({ ok: false, response: err.message });
      });

      req.write(payload);
      req.end();
    } catch (err: any) {
      console.error('Failed to send Telegram request:', err.message);
      resolve({ ok: false, response: err.message });
    }
  });
};

const sendTelegramMessage = async (
  token: string,
  chatId: string,
  htmlText: string
): Promise<boolean> => {
  // Attempt sending in HTML format
  const res = await sendTelegramRaw(token, chatId, htmlText, 'HTML');
  if (res.ok) {
    return true;
  }

  console.warn('HTML Telegram send failed, falling back to plain text:', res.response);
  // Plain text fallback (strip tags)
  const plainText = htmlText.replace(/<[^>]*>/g, '');
  const fallbackRes = await sendTelegramRaw(token, chatId, plainText);
  return fallbackRes.ok;
};

export const sendTelegramBookingNotification = async (
  booking: BookingNotificationData
): Promise<boolean> => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram bot credentials not set, skipping booking notification.');
    return false;
  }

  const isEvent = booking.packageCategory === 'event';
  const categoryLabel = isEvent ? '🎉 Event Package' : '📱 Social Media Package';

  let message = `🚀 <b>NEW PACKAGE BOOKING / SELECTION!</b>\n\n`;
  message += `📦 <b>Package:</b> ${escapeHtml(booking.packageName)}\n`;
  message += `🏷️ <b>Category:</b> ${categoryLabel}\n`;
  message += `💰 <b>Price:</b> ${escapeHtml(booking.packagePrice)} ${escapeHtml(booking.packageCurrency || 'ETB')}${isEvent ? '' : ' / month'}\n\n`;

  message += `👤 <b>Client / Brand:</b> ${escapeHtml(booking.clientName || 'Not specified')}\n`;
  if (booking.phone) {
    message += `📞 <b>Phone:</b> ${escapeHtml(booking.phone)}\n`;
  }
  if (booking.email) {
    message += `📧 <b>Email:</b> ${escapeHtml(booking.email)}\n`;
  }

  if (isEvent && booking.eventDate) {
    message += `\n📅 <b>European Date:</b> ${escapeHtml(booking.eventDate.european || 'N/A')}\n`;
    if (booking.eventDate.ethiopianAmharic) {
      message += `🇪🇹 <b>Ethiopian Date:</b> ${escapeHtml(booking.eventDate.ethiopianAmharic)}`;
      if (booking.eventDate.ethiopianEnglish) {
        message += ` (${escapeHtml(booking.eventDate.ethiopianEnglish)})`;
      }
      message += `\n`;
    }
  }

  if (booking.notes) {
    message += `\n📝 <b>Notes:</b> ${escapeHtml(booking.notes)}\n`;
  }

  message += `\n👉 <b>Check out all details on the Dashboard.</b>`;

  return sendTelegramMessage(token, chatId, message);
};

export const sendTelegramContactNotification = async (
  contact: ContactNotificationData
): Promise<boolean> => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram bot credentials not set, skipping contact notification.');
    return false;
  }

  let message = `📬 <b>NEW CONTACT MESSAGE RECEIVED!</b>\n\n`;
  message += `👤 <b>From:</b> ${escapeHtml(contact.name)}\n`;
  message += `📧 <b>Email:</b> ${escapeHtml(contact.email)}\n`;
  message += `📌 <b>Subject:</b> ${escapeHtml(contact.subject)}\n\n`;
  message += `💬 <b>Message:</b>\n${escapeHtml(contact.message)}\n\n`;
  message += `👉 <b>Check the Admin Dashboard to reply.</b>`;

  return sendTelegramMessage(token, chatId, message);
};

