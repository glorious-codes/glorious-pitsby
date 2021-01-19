const _public = {};

_public.parse = code => {
  if(code) {
    const decodedCode = decodeURIComponent(code);
    return JSON.parse(atob(decodedCode));
  }
};

_public.stringify = (template, controller, styles) => {
  const stringifiedCode = JSON.stringify({ template, controller, styles });
  return encodeURIComponent(btoa(stringifiedCode));
};

export default _public;
