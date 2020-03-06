import { transform } from '@babel/standalone';

const _public = {};

_public.build = controller => {
  const Component = eval(transpileController(controller));
  return React.createElement(Component);
};

function transpileController(controller){
  const transpiledCode = transform(wrapControllerInModuleExports(controller), {
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
