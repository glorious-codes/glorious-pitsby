const _public = {};

_public.parse = code => {
  if(code)
    return JSON.parse(atob(code));
};

_public.format = (template, controller, styles) => {
  return btoa(JSON.stringify({ template, controller, styles }));
};

export default _public;
