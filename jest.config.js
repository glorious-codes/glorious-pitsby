const project = require('./project.json');

module.exports = {
  "collectCoverageFrom": project.tests.source.files,
  "coverageReporters": ["html"],
  "coverageThreshold": {
    "global": {
      "statements": 100,
      "branches": 100,
      "functions": 100,
      "lines": 100
    }
  },
  "moduleNameMapper": {
    '@environment$': `<rootDir>/${project.environments.source.root}/development.js`,
    '@scripts\/(.*)$': `<rootDir>/${project.scripts.source.root}$1`,
    '@styles\/(.*)$': `<rootDir>/${project.styles.source.root}$1`,
    '@images\/(.*)$': `<rootDir>/${project.images.source.root}$1`,
    '@mocks\/(.*)$': `<rootDir>/${project.mocks.source.root}$1`,
    '^.+\\.css$': '<rootDir>/src/webapp/mocks/raw-files.js'
  },
  "setupTestFrameworkScriptFile": "<rootDir>/src/webapp/mocks/global.js",
  "transform": {
    '^.+\\.(png|styl)$': '<rootDir>/src/webapp/mocks/raw-files.js',
    "^.+\\.js$": "babel-jest",
    "^.+\\.html$": "html-loader-jest"
  }
};
