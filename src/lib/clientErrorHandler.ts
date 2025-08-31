'use client';

// クライアントサイドエラーハンドリング
export function initializeClientErrorHandling() {
  if (typeof window === 'undefined') return;

  // グローバルエラーハンドラー
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    // Firebase関連のエラーは警告レベルに下げる
    if (error?.message?.includes('Firebase') || 
        error?.message?.includes('auth') ||
        error?.message?.includes('firestore')) {
      console.warn('Firebase関連の警告:', error.message);
      event.preventDefault(); // エラーの伝播を停止
      return;
    }

    // その他の重要でないエラーも無視
    const ignorableErrors = [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      'Script error',
      'Network request failed'
    ];

    if (ignorableErrors.some(msg => error?.message?.includes(msg))) {
      console.warn('無視可能なエラー:', error?.message);
      event.preventDefault();
      return;
    }

    // 重要なエラーのみログ出力
    console.error('重要なエラー:', error);
  });

  // Promise rejection ハンドラー
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    
    // Firebase関連のPromise rejectionを処理
    if (reason?.message?.includes('Firebase') || 
        reason?.message?.includes('auth') ||
        reason?.code?.includes('auth/')) {
      console.warn('Firebase認証警告:', reason.message || reason);
      event.preventDefault();
      return;
    }

    // ネットワークエラーを処理
    if (reason?.message?.includes('fetch') || 
        reason?.message?.includes('network') ||
        reason?.name === 'TypeError') {
      console.warn('ネットワーク警告:', reason.message || reason);
      event.preventDefault();
      return;
    }

    console.error('未処理のPromise rejection:', reason);
  });

  console.log('✅ クライアントエラーハンドリング初期化完了');
}

// Firebase初期化エラーの安全な処理
export function safeFirebaseInit(initFunction: () => void) {
  try {
    initFunction();
  } catch (error) {
    console.warn('Firebase初期化警告:', error);
    // エラーを投げずに継続
  }
}

// API呼び出しの安全なラッパー
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallbackValue?: T
): Promise<T | undefined> {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API呼び出し警告:', error);
    return fallbackValue;
  }
}
