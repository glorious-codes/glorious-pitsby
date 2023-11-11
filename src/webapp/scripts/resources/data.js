import dateService from '@scripts/services/date';
import baseResource from '@scripts/resources/base';

const _public = {};
const BASE_DATA_URI = '/data';

const cache = new Map();

_public.get = (uri, query = {}) => {
  const response = cache.get(buildCacheKey(uri, query));
  return response ? Promise.resolve(response) : fetch(uri, query);
};

_public.flushCache = () => cache.clear();

function fetch(uri, query){
  const url = [BASE_DATA_URI, `${uri}.json`].join('');
  query.t = dateService.getNow().getTime();
  return baseResource.get(url, query).then(({ data }) => {
    cache.set(buildCacheKey(uri, query), deepClone(data));
    return data;
  });
}

function buildCacheKey(uri, query){
  // eslint-disable-next-line no-unused-vars
  const { t, ...queryRest } = query;
  return `${uri}-${JSON.stringify(queryRest)}`;
}

function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
}

export default _public;
