module.exports = {
      preset: 'ts-jest',
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: 'src',
      testRegex: ['.*\\.spec\\.ts$', '.*\\.e2e\\.ts$'],
      transform: {
            '^.+\\.(t|j)s$': 'ts-jest',
            '.(ts|tsx)': 'ts-jest',
      },
      collectCoverageFrom: ['**/*.(t|j)s'],
      globals: {
            'ts-jest': {
                  compiler: 'ttypescript',
            },
      },
      coverageDirectory: '../coverage',
      testEnvironment: 'node',
      coveragePathIgnorePatterns: [
            '<rootDir>/main.ts',
            '<rootDir>/router.ts',
            '<rootDir>/app',
            '<rootDir>/utils/logger',
            '<rootDir>/utils/repository',
            '<rootDir>/utils/validator',
            '<rootDir>/test',
      ],
};
