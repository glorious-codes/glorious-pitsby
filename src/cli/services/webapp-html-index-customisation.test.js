const webappHtmlIndexCustomisation = require('./webapp-html-index-customisation');

describe('Webapp HTML Index Customisation', () => {
  function buildTemplateMock(){
    return `
<html>
  <head>
  <title>{{ title }}</title>
  <link href="{{ faviconHref }}" rel="shortcut icon">
  </head>
  <body></body>
</html>`;
  }

  beforeEach(() => {
    Date.now = jest.fn(() => 123);
  });

  it('should set Pitsby favicon href on template by default', () => {
    const template = webappHtmlIndexCustomisation.init(buildTemplateMock());
    expect(template.includes('<link href="images/favicon-pitsby.png?t=123" rel="shortcut icon">')).toEqual(true);
  });

  it('should set custom favicon href on template if custom favicon href has been given', () => {
    const template = webappHtmlIndexCustomisation.init(buildTemplateMock(), {
      favicon: { filepath: './dist/images/favicon.png' }
    });
    expect(template.includes('<link href="external/dist/images/favicon.png?t=123" rel="shortcut icon">')).toEqual(true);
  });

  it('should set custom favicon external href on template if it has been given', () => {
    const template = webappHtmlIndexCustomisation.init(buildTemplateMock(), {
      favicon: { filepath: 'https://some.other.domain/images/favicon.png' }
    });
    expect(template.includes('<link href="https://some.other.domain/images/favicon.png?t=123" rel="shortcut icon">')).toEqual(true);
  });

  it('should set Pitsby window title on template by default', () => {
    const template = webappHtmlIndexCustomisation.init(buildTemplateMock());
    expect(template.includes('<title>Pitsby</title>')).toEqual(true);
  });

  it('should set custom window title on template if custom window title has been given', () => {
    const template = webappHtmlIndexCustomisation.init(buildTemplateMock(), { windowTitle: 'Taslonic' });
    expect(template.includes('<title>Taslonic</title>')).toEqual(true);
  });
});
