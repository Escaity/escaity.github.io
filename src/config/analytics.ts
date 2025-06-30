// src/config/analytics.ts
export interface AnalyticsConfig {
  gaId: string;
  enabled: boolean;
  debug: boolean;
}

export const getAnalyticsConfig = (): AnalyticsConfig => {
  const gaId = import.meta.env.PUBLIC_GA_ID;

  return {
    gaId,
    enabled: !!gaId && import.meta.env.PROD,
    debug: import.meta.env.DEV
  };
};
