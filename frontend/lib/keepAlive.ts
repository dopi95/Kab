'use client';

const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes
let intervalId: NodeJS.Timeout | null = null;

export function startBackendKeepAlive() {
  if (intervalId) return;

  const ping = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`, {
        method: 'GET',
        cache: 'no-store',
      });
    } catch (error) {
      console.error('Backend ping failed:', error);
    }
  };

  ping();
  intervalId = setInterval(ping, PING_INTERVAL);
}

export function stopBackendKeepAlive() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
