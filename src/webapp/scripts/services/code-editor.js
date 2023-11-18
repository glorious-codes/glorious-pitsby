const _public = {};

_public.load = () => {
  return import(/* webpackChunkName: 'brace' */ 'brace').then(ace => {
    return Promise.all([
      import(/* webpackChunkName: 'brace-js-mode' */ 'brace/mode/javascript'),
      import(/* webpackChunkName: 'brace-jsx-mode' */ 'brace/mode/jsx'),
      import(/* webpackChunkName: 'brace-html-mode' */ 'brace/mode/html'),
      import(/* webpackChunkName: 'brace-css-mode' */ 'brace/mode/css'),
      import(/* webpackChunkName: 'code-editor-styles' */ '@styles/code-editor.styl')
    ]).then(() => ace);
  });
};

export default _public;
