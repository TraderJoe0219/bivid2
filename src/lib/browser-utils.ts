/**
 * ブラウザ環境での安全なナビゲーション・リダイレクト用ユーティリティ
 * SSRコンテキストでのエラーを防ぐ
 */

/**
 * SSR安全なリダイレクト
 * @param url - リダイレクト先URL
 */
export function safeRedirect(url: string): void {
  if (typeof window !== 'undefined') {
    window.location.href = url;
  }
}

/**
 * SSR安全なページ更新
 */
export function safeReload(): void {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

/**
 * SSR安全な現在のURL取得
 * @returns 現在のURLまたはundefined（SSRの場合）
 */
export function getCurrentUrl(): string | undefined {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return undefined;
}

/**
 * SSR安全なパスネーム取得
 * @returns 現在のpathnameまたは'/'（SSRの場合）
 */
export function getCurrentPathname(): string {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '/';
}

/**
 * SSR安全なクエリパラメータ取得
 * @returns URLSearchParamsまたはnull（SSRの場合）
 */
export function getSearchParams(): URLSearchParams | null {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return null;
}