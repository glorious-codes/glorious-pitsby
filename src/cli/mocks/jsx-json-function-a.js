/* eslint-disable */
module.exports = {
  name: 'some name',
  examples: [
    {
      controller: function(myLib) {
        const { useState } = React;
        const { Button } = myLib;

        const [counter, setCounter] = useState(0);
        const [message, setMessage] = useState('');

        function onClick() {
          setCounter(++counter);
          setMessage(`Clicked ${counter} times!`);
        }

        return () => {
          return <Button onClick={onClick}>Send</Button>;
        };
      }
    }
  ]
};
