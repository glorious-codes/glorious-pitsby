export const buildPitsbyConfigMock = ({ custom, ...rest } = {}) => ({
  projects: [
    {
      engine: 'vue',
      collectDocsFrom: './src/vue',
      libraryName: 'vueComponents',
    },
    {
      engine: 'angular',
      collectDocsFrom: './src/angular',
      moduleName: 'external'
    }
  ],
  styles: ['./dist/styles.css'],
  scripts: ['dist/bundle.js'],
  other: ['./images/'],
  outputDirectory: './docs',
  metrics: {
    googleAnalyticsId: '123'
  },
  custom,
  ...rest
});
