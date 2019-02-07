import dataResource from '@scripts/resources/data';

const _public = {};
const BASE_URI = '/projects';

_public.get = () => {
  return dataResource.get(BASE_URI);
};

export default _public;
