// src/utils/analytics.ts
import { getAnalyticsConfig } from '../config/analytics';

export class AnalyticsManager {
  private config = getAnalyticsConfig();

  private gtag(...args: any[]) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag(...args);
    }
  }

  trackPageView(url?: string) {
    if (!this.config.enabled) return;

    this.gtag('config', this.config.gaId, {
      page_title: document.title,
      page_location: url ? new URL(url, window.location.origin).href : window.location.href
    });
  }

  trackEvent(eventName: string, parameters: Record<string, any> = {}) {
    if (!this.config.enabled) return;

    this.gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label,
      value: parameters.value,
      ...parameters
    });
  }
}

// シングルトンインスタンス
export const analytics = new AnalyticsManager();

// 型定義の拡張
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
