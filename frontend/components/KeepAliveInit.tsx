'use client';

import { useEffect } from 'react';
import { startBackendKeepAlive } from '@/lib/keepAlive';

export default function KeepAliveInit() {
  useEffect(() => {
    startBackendKeepAlive();
  }, []);

  return null;
}
