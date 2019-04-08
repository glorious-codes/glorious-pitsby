import metricsIdsService from '@data/metrics-ids';
import dateService from '@scripts/services/date';

const GOOGLE_ANALYTICS_BASE_URL = 'https://www.googletagmanager.com/gtag/js';
const _public = {};

_public.init = () => {
  document.head.appendChild(buildGoogleAnalyticsScriptTag());
  configAnalytics(getGoogleAnalyticsId());
};

_public.trackPageView = () => {
  configAnalytics(getGoogleAnalyticsId(), buildPath());
};

function buildGoogleAnalyticsScriptTag(){
  const tag = document.createElement('script');
  tag.setAttribute('async', 'true');
  tag.setAttribute('src', `${GOOGLE_ANALYTICS_BASE_URL}?id=${getGoogleAnalyticsId()}`);
  return tag;
}

function configAnalytics(id, path){
  if(!path)
    gtag('js', dateService.getNow());
  gtag('config', id, {page_path: (path || buildPath())});
}

function buildPath(){
  const path = window.location.hash.replace('#!/','/');
  return path.split('?')[0];
}

function gtag(){
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(arguments);
}

function getGoogleAnalyticsId(){
  return metricsIdsService.get().googleAnalyticsId;
}

export default _public;
