import { GLOBAL_DATA_KEY } from '@scripts/constants/global-data';

const _public = {};

_public.mockExternalGlobalData = data => {
  window[GLOBAL_DATA_KEY] = data;
};

_public.clearExternalGlobalData = () => {
  delete window[GLOBAL_DATA_KEY];
};

export default _public;
