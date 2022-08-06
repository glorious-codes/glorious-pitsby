const _public = {};

_public.msg = (msg, options) => console.log(`${getTemplate(options)}`, msg);

function getTemplate({ theme = 'default' } = {}){
  return {
    'default': buildBaseTemplate(6, 'i'),
    'success': buildBaseTemplate(2, '✔︎'),
    'error': buildBaseTemplate(1, '✗').replace(':\x1b[0m %s', ': %s\x1b[0m')
  }[theme];
}

function buildBaseTemplate(color, symbol){
  return `\x1b[3${color}m ${symbol} [pitsby]:\x1b[0m %s`;
}

module.exports = _public;
