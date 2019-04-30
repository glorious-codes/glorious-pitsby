const _public = {};

_public.removeBlankFirstLine = text => {
  const lines = text.split('\n');
  if(hasMoreThanOneLine(lines) && isFirstLineEmpy(lines))
    lines.splice(0,1);
  return lines.join('\n');
};

function hasMoreThanOneLine(lines){
  return lines.length > 1;
}

function isFirstLineEmpy(lines){
  return lines[0].trim() === '';
}

export default _public;
