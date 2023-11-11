const project = require('./project.json');

module.exports = {
  collectCoverageFrom: project.tests.source.files,
  coverageReporters: ['html'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },
  moduleNameMapper: {
    '@cli\/(.*)$': `<rootDir>/${project.scripts.cli.source.root}$1`,
    '@data\/(.*)$': `<rootDir>/${project.data.source.root}$1`,
    '@scripts\/(.*)$': `<rootDir>/${project.scripts.webapp.source.root}$1`,
    '@styles\/(.*)$': `<rootDir>/${project.styles.source.root}$1`,
    '@images\/(.*)$': `<rootDir>/${project.images.source.root}$1`,
    '@mocks\/(.*)$': `<rootDir>/${project.mocks.source.root}$1`,
    '^.+\\.css$': '<rootDir>/src/webapp/mocks/raw-files.js',
    '^axios$': '<rootDir>/node_modules/axios/dist/browser/axios.cjs'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(png|svg|styl)$': '<rootDir>/src/webapp/mocks/raw-files.js',
    '^.+\\.js$': 'babel-jest',
    '^.+\\.html$': 'html-loader-jest'
  }
};
