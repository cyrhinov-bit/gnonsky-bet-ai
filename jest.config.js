module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        target: 'ES2022',
        module: 'commonjs',
        moduleResolution: 'node',
        esModuleInterop: true,
        skipLibCheck: true
      }
    }]
  },
  moduleNameMapper: {
    '^@football/types$': '<rootDir>/packages/types/src/index.ts',
    '^@football/validation$': '<rootDir>/packages/validation/src/index.ts',
    '^@football/scoring$': '<rootDir>/packages/scoring/src/index.ts',
    '^@football/prompts$': '<rootDir>/packages/prompts/src/index.ts',
    '^@football/ui$': '<rootDir>/packages/ui/src/index.ts'
  }
};

