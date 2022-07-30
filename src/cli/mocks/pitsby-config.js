export const buildPitsbyConfigMock = ({ custom } = {}) => ({
  projects: [
    {
      engine: 'angular',
      collectFrom: './src/angular',
      moduleName: 'external'
    }
  ],
  styles: ['./dist/styles.css'],
  scripts: ['./dist/bundle.js'],
  other: ['./images/'],
  outputDirectory: './docs',
  metrics: {
    googleAnalyticsId: '123'
  },
  custom
});
