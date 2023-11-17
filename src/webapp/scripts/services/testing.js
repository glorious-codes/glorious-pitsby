import { GLOBAL_DATA_KEY } from '@scripts/constants/global-data';

const _public = {};

_public.mockExternalGlobalData = data => {
  window[GLOBAL_DATA_KEY] = data;
};

_public.clearExternalGlobalData = () => {
  delete window[GLOBAL_DATA_KEY];
};

_public.pause = async timeout => {
  return await new Promise(resolve => setTimeout(resolve, timeout));
};

export default _public;
