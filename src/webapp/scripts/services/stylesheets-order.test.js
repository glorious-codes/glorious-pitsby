import stylesheetsOrderService from './stylesheets-order';

describe('Stylesheets Order', () => {
  function buildHead(){
    return document.createElement('head');
  }

  function buildStylesheetLink(href){
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    return link;
  }

  it('should make last stylesheet as the first one', () => {
    const head = buildHead();
    const firstStylesheet = buildStylesheetLink('first.css');
    const lastStylesheet = buildStylesheetLink('last.css');
    head.append(firstStylesheet);
    head.append(lastStylesheet);
    stylesheetsOrderService.makeLestStylesheetAsFirst(head);
    expect(head.firstElementChild).toEqual(lastStylesheet);
  });

  it('should keep things as they are if no more than one stylesheet has been found', () => {
    const head = buildHead();
    const firstStylesheet = buildStylesheetLink('first.css');
    head.append(firstStylesheet);
    stylesheetsOrderService.makeLestStylesheetAsFirst(head);
    expect(head.firstElementChild).toEqual(firstStylesheet);
  });
});
