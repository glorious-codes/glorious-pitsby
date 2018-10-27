import dateService from '@scripts/services/date';
import baseResource from '@scripts/resources/base';

const _public = {};
const BASE_DATA_URI = '/data';

_public.get = (uri, query = {}) => {
  const url = [BASE_DATA_URI, `${uri}.json`].join('');
  query.t = dateService.getNow().getTime();
  return baseResource.get(url, query).then(response => {
    return response.data;
  });
};

export default _public;
