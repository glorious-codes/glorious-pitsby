const _public = {};

_public.build = controller => {
  const Component = eval(transpileController(controller));
  return React.createElement(Component);
};

_public.unbuild = container => {
  ReactDOM.unmountComponentAtNode(container);
};

function transpileController(controller){
  const transpiledCode = Babel.transform(wrapControllerInModuleExports(controller), {
    presets: ['env', 'react']
  }).code;
  return convertExportedModuleToIIFE(transpiledCode);
}

function wrapControllerInModuleExports(controller){
  return controller.replace('function()', 'module.exports = function controller()');
}

function convertExportedModuleToIIFE(transpiledCode){
  const code = transpiledCode
    .replace('"use strict";', '')
    .replace('module.exports = ', 'return ')
    .trim();
  return `(function(){${removeLastCharFromString(code)}()}())`;
}

function removeLastCharFromString(string){
  return string.substring(0, string.length - 1);
}

export default _public;
