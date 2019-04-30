import codeIndentationService from '@scripts/services/code-indentation';

const _public = {};

_public.normalize = stringifiedController => {
  if(!stringifiedController)
    return '';
  const spacesToRemove = getNumerOfLeadingSpacesToRemove(stringifiedController.split('\n'));
  return codeIndentationService.normalize(stringifiedController, spacesToRemove);
};

function getNumerOfLeadingSpacesToRemove(lines){
  const referenceLine = getReferenceLine(lines);
  const firstLineToContainExceedingLeadingSpaces = lines[referenceLine.subsequentLineIndex];
  return  countLeadingSpaces(firstLineToContainExceedingLeadingSpaces)
          - countLeadingSpaces(referenceLine.text)
          - referenceLine.spacesToRemove;
}

function getReferenceLine(lines){
  const dataMethodLine = getLineContainingText(lines, 'data() {');
  const methodsAttributeLine = getLineContainingText(lines, '"methods":');
  return dataMethodLine ? {
    text: dataMethodLine.text,
    subsequentLineIndex: dataMethodLine.index + 1,
    spacesToRemove: codeIndentationService.TAB_SIZE
  } : {
    text: methodsAttributeLine.text,
    subsequentLineIndex: methodsAttributeLine.index + 2,
    spacesToRemove: codeIndentationService.TAB_SIZE * 2
  };
}

function getLineContainingText(lines, text){
  for (var i = 0; i < lines.length; i++) {
    if(lines[i].includes(text))
      return { index: i, text: lines[i] };
  }
}

function countLeadingSpaces(lineText){
  return codeIndentationService.countLeadingSpaces(lineText);
}

export default _public;
