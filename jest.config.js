const nextJest = require('next/jest');

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testEnvironment: 'jest-environment-jsdom',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
	collectCoverageFrom: [
		'app/**/*.{js,jsx,ts,tsx}',
		'components/**/*.{js,jsx,ts,tsx}',
		// 'context/**/*.{js,jsx,ts,tsx}',
		'hooks/**/*.{js,jsx,ts,tsx}',
		'utils/**/*.{js,jsx,ts,tsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
	],
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 60,
			lines: 60,
			statements: 60,
		},
	},
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

// module.exports = {
// 	testEnvironment: 'jsdom',
// 	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
// 	moduleNameMapper: {
// 		'^@/(.*)$': '<rootDir>/$1',
// 	},
// 	testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
// 	transform: {
// 		'^.+\\.(ts|tsx)$': [
// 			'ts-jest',
// 			{
// 				useESM: true,
// 			},
// 		],
// 	},
// 	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
// 	collectCoverageFrom: [
// 		'app/**/*.{js,jsx,ts,tsx}',
// 		'components/**/*.{js,jsx,ts,tsx}',
// 		'context/**/*.{js,jsx,ts,tsx}',
// 		'hooks/**/*.{js,jsx,ts,tsx}',
// 		'utils/**/*.{js,jsx,ts,tsx}',
// 		'!**/*.d.ts',
// 		'!**/node_modules/**',
// 	],
// 	coverageThreshold: {
// 		global: {
// 			branches: 60,
// 			functions: 60,
// 			lines: 60,
// 			statements: 60,
// 		},
// 	},
// };
