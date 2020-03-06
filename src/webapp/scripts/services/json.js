import jsonService from '@cli/services/json';

const _public = {};

_public.handleFunctions = (json, { engine } = {}) => {
  return engine == 'react' ? json : jsonService.parseFunctions(json);
};

export default _public;
