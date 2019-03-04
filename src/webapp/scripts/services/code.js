const _public = {};

_public.improveStringifiedCodeSyntax = (code = '', language) => {
  let improvedText = removeBreaklineMarks(code);
  improvedText = removeCharacterEscaping(improvedText);
  improvedText = deduplicateFunctionNames(improvedText);
  improvedText = removeQuotesAroundFunctions(improvedText, language);
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

function removeQuotesAroundFunctions(text, language){
  if(language == 'javascript')
    return  text.replace(/"function/g, 'function')
      .replace(/}"/g, '}');
  return text;
}

function shorthandFunctions(text){
  return text.replace(/"(.*)": function \(/g, '$1(');
}

export default _public;
