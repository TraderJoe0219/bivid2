'use client';

import { useEffect } from 'react';
import { initializeClientErrorHandling } from '@/lib/clientErrorHandler';

export default function ClientErrorHandler() {
  useEffect(() => {
    initializeClientErrorHandling();
  }, []);

  return null; // このコンポーネントは何もレンダリングしない
}
