import https from 'https';

interface BookingNotificationData {
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

export const sendTelegramBookingNotification = async (
  booking: BookingNotificationData
): Promise<boolean> => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram bot credentials not set, skipping notification.');
    return false;
  }

  const isEvent = booking.packageCategory === 'event';
  const categoryLabel = isEvent ? '🎉 Event Package' : '📱 Social Media Package';

  let message = `🚀 *NEW PACKAGE BOOKING RECEIVED!*\n\n`;
  message += `📦 *Package:* ${booking.packageName}\n`;
  message += `🏷️ *Category:* ${categoryLabel}\n`;
  message += `💰 *Price:* ${booking.packagePrice} ${booking.packageCurrency || 'ETB'}${isEvent ? '' : ' / month'}\n\n`;

  message += `👤 *Client / Brand:* ${booking.clientName || 'Not specified'}\n`;
  if (booking.phone) {
    message += `📞 *Phone:* ${booking.phone}\n`;
  }
  if (booking.email) {
    message += `📧 *Email:* ${booking.email}\n`;
  }

  if (isEvent && booking.eventDate) {
    message += `\n📅 *European Date:* ${booking.eventDate.european || 'N/A'}\n`;
    if (booking.eventDate.ethiopianAmharic) {
      message += `🇪🇹 *Ethiopian Date:* ${booking.eventDate.ethiopianAmharic}`;
      if (booking.eventDate.ethiopianEnglish) {
        message += ` (${booking.eventDate.ethiopianEnglish})`;
      }
      message += `\n`;
    }
  }

  if (booking.notes) {
    message += `\n📝 *Notes:* ${booking.notes}\n`;
  }

  message += `\n👉 *Check out all details on the Dashboard.*`;

  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
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
          if (res.statusCode === 200) {
            resolve(true);
          } else {
            console.error('Telegram API error:', data);
            resolve(false);
          }
        });
      });

      req.on('error', (err) => {
        console.error('Telegram request error:', err.message);
        resolve(false);
      });

      req.write(payload);
      req.end();
    } catch (err: any) {
      console.error('Failed to send Telegram notification:', err.message);
      resolve(false);
    }
  });
};
