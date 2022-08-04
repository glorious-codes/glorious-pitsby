import { GLOBAL_DATA_KEY } from '@scripts/constants/global-data';

const _public = {};

_public.get = () => window[GLOBAL_DATA_KEY] || {};

export default _public;
