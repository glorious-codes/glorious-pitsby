/* eslint-disable */
module.exports = {
  name: 'some name',
  examples: [
    {
      controller: function(myLib) {
        const { Tag } = myLib;

        return () => {
          return <Tag>New</Tag>;
        };
      },
      styles: '.some-style { color: red; }'
    }
  ]
};
