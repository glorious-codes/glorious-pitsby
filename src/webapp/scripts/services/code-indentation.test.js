import codeIndentationService from './code-indentation';

describe('Code Indentation Service', () => {
  it('should normalize indentation when first line is blank', () => {
    const markup = `
      <div class="parent">
        <div class="child"></div>
      </div>`;
    expect(codeIndentationService.normalize(markup)).toEqual(`<div class="parent">
  <div class="child"></div>
</div>`);
  });

  it('should normalize indentation when first line is not blank', () => {
    const controller = `function (){
      const vm = this;
      vm.greet = () => {
        console.log('Hello!');
      };
    }`;
    expect(codeIndentationService.normalize(controller)).toEqual(`function (){
  const vm = this;
  vm.greet = () => {
    console.log('Hello!');
  };
}`);
  });

  it('should do nothing when indentation is already normalized', () => {
    const markup = '<p>Hello</p>';
    expect(codeIndentationService.normalize(markup)).toEqual(markup);
  });

  it('should count the number of leading spaces', () => {
    const code = '    function () {}';
    expect(codeIndentationService.countLeadingSpaces(code)).toEqual(4);
  });

  it('should return zero if the line of code has no leading spaces', () => {
    const code = 'function () {}';
    expect(codeIndentationService.countLeadingSpaces(code)).toEqual(0);
  });
});
