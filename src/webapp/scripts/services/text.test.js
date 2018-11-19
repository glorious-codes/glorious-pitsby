import textService from './text';

describe('Text Service', () => {
  it('should remove first line when it\'s empty', () => {
    const text = `
second line
third line`;
    expect(textService.removeBlankFirstLine(text)).toEqual(`second line
third line`);
  });

  it('should not remove first line when it\'s not empty', () => {
    const text = 'first line';
    expect(textService.removeBlankFirstLine(text)).toEqual('first line');
  });

  it('should normalize indentation', () => {
    const markup = `
      <div class="parent">
        <div class="child"></div>
      </div>`;
    expect(textService.normalizeIndentation(markup)).toEqual(`<div class="parent">
  <div class="child"></div>
</div>`);
  });

  it('should do nothing when indentation is already normalized', () => {
    const markup = '<p>Hello</p>';
    expect(textService.normalizeIndentation(markup)).toEqual(markup);
  });
});
