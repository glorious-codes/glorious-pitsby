const _public = {};

_public.improve = (code = '') => {
  let improvedText = removeBreaklineMarks(code);
  improvedText = removeCharacterEscaping(improvedText);
  improvedText = deduplicateFunctionNames(improvedText);
  improvedText = removeQuotesAroundFunctions(improvedText);
  return shorthandFunctions(improvedText);
};

function removeBreaklineMarks(text){
  return text.replace(/\\n/g, '\n');
}

function removeCharacterEscaping(text){
  return text.replace(/\\"/g, '"');
}

function deduplicateFunctionNames(text){
  return text.replace(/"(.*)": "(.*)\((.*){/g, '"$1": "function ($3{');
}

function removeQuotesAroundFunctions(text){
  return  text.replace(/"function/g, 'function')
    .replace(/}"/g, '}');
}

function shorthandFunctions(text){
  return text.replace(/"(.*)": function \(/g, '$1(');
}

export default _public;
