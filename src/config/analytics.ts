// src/config/analytics.ts
export interface AnalyticsConfig {
  gaId: string;
  enabled: boolean;
  debug: boolean;
}

export const getAnalyticsConfig = (): AnalyticsConfig => {
  const gaId = import.meta.env.PUBLIC_GA_ID;

  // デバッグ用のログ（開発環境のみ）
  if (import.meta.env.DEV) {
    console.log('Analytics Config:', {
      gaId: gaId ? `${gaId.substring(0, 7)}...` : 'undefined',
      enabled: !!gaId,
      isProd: import.meta.env.PROD
    });
  }

  return {
    gaId: gaId || '',
    enabled: !!gaId && gaId.startsWith('G-'),
    debug: import.meta.env.DEV
  };
};
