module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../../',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/apps/api/tsconfig.json' }]
  },
  moduleNameMapper: {
    '^@football/types$': '<rootDir>/packages/types/src',
    '^@football/validation$': '<rootDir>/packages/validation/src',
    '^@football/scoring$': '<rootDir>/packages/scoring/src',
    '^@football/prompts$': '<rootDir>/packages/prompts/src',
    '^@football/ui$': '<rootDir>/packages/ui/src'
  }
};
