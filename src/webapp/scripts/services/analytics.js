import GAnalytics from '@glorious/analytics';
import googleAnalyticsAdapter from '@glorious/analytics/dist/adapters/google-analytics';
import externalGlobalDataService from '@scripts/services/external-global-data';
import windowService from '@scripts/services/window';

const _public = {};

let analytics;

_public.init = () => {
  const googleAnalyticsId = getGoogleAnalyticsId();
  if(googleAnalyticsId) {
    analytics = new GAnalytics();
    analytics.init(googleAnalyticsId, { adapter: googleAnalyticsAdapter });
  }
};

_public.trackPageView = () => {
  analytics && analytics.trackPageview({ path: buildPath() });
};

function getGoogleAnalyticsId(){
  const { metrics } = externalGlobalDataService.get();
  return metrics && metrics.googleAnalyticsId;
}

function buildPath(){
  const pathname = windowService.getHash();
  return pathname.replace('#!/','/').split('?')[0];
}

export default _public;
