import React from 'react';
import ReactDOM from 'react-dom';
import reactComponentBuilder from './react-component-builder';

describe('React Component Builder', () => {
  beforeEach(() => {
    window.React = React;
  });

  afterEach(() => {
    delete window.React;
  });

  it('should build a react component from a strigified controller', () => {
    const container = document.createElement('div');
    const controller = `function(){
      return function(){
        return <h1>Hello!</h1>;
      }
    }`;
    const builtComponent = reactComponentBuilder.build(controller);
    ReactDOM.render(builtComponent, container);
    expect(container.querySelector('h1').textContent).toEqual('Hello!');
  });
});
