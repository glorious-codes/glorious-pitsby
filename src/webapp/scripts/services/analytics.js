import Staly from '@compilorama/staly';
import googleAnalyticsAdapter from '@compilorama/staly/dist/adapters/google-analytics';
import externalGlobalDataService from '@scripts/services/external-global-data';
import windowService from '@scripts/services/window';

const TYPE_GOOGLE = 'google';
const TYPE_PLAUSIBLE = 'plausible';

const _public = {};

let analytics;

_public.init = () => {
  const data = getMetricsData();
  if(data.id) instantiateAnalytics(data);
};

_public.trackPageView = () => {
  analytics && setTimeout(() => {
    analytics.trackPageview(analytics._getPageViewOptions());
  });
};

function instantiateAnalytics({ id, type, options, getPageViewOptions }){
  analytics = new Staly();
  analytics.init(id, options);
  analytics._type = type;
  analytics._getPageViewOptions = getPageViewOptions;
}

function getMetricsData(){
  const { metrics } = externalGlobalDataService.get();
  return metrics ? parseMetricsData(metrics) : {};
}

function parseMetricsData({ googleAnalyticsId, plausibleId, plausibleOptions }){
  if(googleAnalyticsId) {
    return {
      type: TYPE_GOOGLE,
      id: googleAnalyticsId,
      options: { adapter: googleAnalyticsAdapter },
      getPageViewOptions: () => ({ path: buildPath() })
    };
  }
  return {
    type: TYPE_PLAUSIBLE,
    id: plausibleId,
    options: { ...plausibleOptions },
    getPageViewOptions: () => ({ url: buildPath() })
  };
}

function buildPath(){
  const pathname = windowService.getHash();
  return pathname.replace('#!/','/').split('?')[0];
}

export default _public;
