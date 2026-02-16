import axios from 'axios';

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

export const startKeepAlive = () => {
  const backendUrl = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL;
  
  if (!backendUrl) {
    console.log('No backend URL configured for keep-alive');
    return;
  }

  setInterval(async () => {
    try {
      await axios.get(`${backendUrl}/api/health`);
      console.log('Keep-alive ping sent');
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
    }
  }, PING_INTERVAL);
};
