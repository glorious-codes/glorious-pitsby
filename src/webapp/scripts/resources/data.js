import dateService from '@scripts/services/date';
import baseResource from '@scripts/resources/base'

const _public = {};
const BASE_DATA_URI = '/data';

_public.get = (uri, query = {}) => {
  query.t = dateService.getNow().getTime();
  return baseResource.get([BASE_DATA_URI, uri].join(''), query);
};

export default _public;
