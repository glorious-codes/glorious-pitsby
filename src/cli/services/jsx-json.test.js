const path = require('path');
const service = require('./jsx-json');

describe('JSX JSON Service', () => {
  function buildMockFilepath(suffix){
    return path.resolve(__dirname, `../mocks/jsx-json-function-${suffix}.js`);
  }

  it('should stringify an example containing just a function', () => {
    const filepath = buildMockFilepath('a');
    expect(service.stringifyFunctions(filepath)).toEqual(`/* eslint-disable */
module.exports = {
  name: 'some name',
  examples: [
    {
      controller: \`function(myLib) {
        const { useState } = React;
        const { Button } = myLib;

        const [counter, setCounter] = useState(0);
        const [message, setMessage] = useState('');

        function onClick() {
          setCounter(++counter);
          setMessage(\\\`Clicked \\\${counter} times!\\\`);
        }

        return () => {
          return <Button onClick={onClick}>Send</Button>;
        };
      }\`
    }
  ]
};
`);
  });

  it('should stringify an example containing something more than a function', () => {
    const filepath = buildMockFilepath('b');
    expect(service.stringifyFunctions(filepath)).toEqual(`/* eslint-disable */
module.exports = {
  name: 'some name',
  examples: [
    {
      controller: \`function(myLib) {
        const { Tag } = myLib;

        return () => {
          return <Tag>New</Tag>;
        };
      }\`,
      styles: '.some-style { color: red; }'
    }
  ]
};
`);
  });
});
