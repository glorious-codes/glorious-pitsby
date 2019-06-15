const _public = {};

_public.makeLestStylesheetAsFirst = headElement => {
  const stylesheets = getStylesheetLinks(headElement);
  if(stylesheets.length > 1)
    stylesheets[0].before(stylesheets[stylesheets.length - 1]);
};

function getStylesheetLinks(headElement){
  return Array.from(headElement.querySelectorAll('link')).filter(link => {
    return link.getAttribute('rel') == 'stylesheet';
  });
}

export default _public;
