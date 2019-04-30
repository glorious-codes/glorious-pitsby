import textService from '@scripts/services/text';

const _public = {};

_public.TAB_SIZE = 2;

_public.normalize = (code, numberOfSpacesToRemove) => {
  const text = textService.removeBlankFirstLine(code);
  const numberOfExceedingSpaces = numberOfSpacesToRemove || getNumberOfLeadingSpaces(text);
  return removeExceedingLeadingSpaces(text, numberOfExceedingSpaces);
};

_public.countLeadingSpaces = lineText => {
  const spaces = lineText && lineText.match(/^[\s]+/g);
  return spaces ? spaces[0].length : 0;
};

function getNumberOfLeadingSpaces(text){
  const lines = getTextLines(text);
  const firstLineLeadingSpaces = _public.countLeadingSpaces(lines[0]);
  if(firstLineLeadingSpaces)
    return firstLineLeadingSpaces;
  return _public.countLeadingSpaces(lines[1]) - _public.TAB_SIZE;
}

function getTextLines(text){
  return text.split('\n');
}

function removeExceedingLeadingSpaces(text, numberOfSpacesToRemove){
  return text.split('\n').map(line => {
    return handleExceedingLeadingSpacesRemotionForALine(line, numberOfSpacesToRemove);
  }).join('\n');
}

function handleExceedingLeadingSpacesRemotionForALine(line, numberOfSpacesToRemove) {
  const regex = new RegExp(`^[\\s]{${numberOfSpacesToRemove}}`, 'g');
  return _public.countLeadingSpaces(line) >= numberOfSpacesToRemove ?
    line.replace(regex, '') :
    line;
}

export default _public;
