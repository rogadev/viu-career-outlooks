# Testing Guidelines

## Test Setup

This project uses Jest and React Testing Library for testing. The tests are written in JavaScript rather than TypeScript to avoid the need for `ts-node` in CI/CD environments.

### Why JavaScript for Tests?

While the main application is written in TypeScript, we've chosen to write tests in JavaScript (`.jsx` files) for the following reasons:

1. **Simplicity in CI/CD Pipelines**: Using JavaScript test files allows tests to run without requiring `ts-node` as a dependency. This makes our GitHub Actions workflows simpler and more reliable.

2. **Faster CI Builds**: Not having to transpile TypeScript test files results in slightly faster CI builds.

3. **Reduced Dependencies**: Fewer dependencies means less potential for dependency-related issues in our CI/CD pipeline.

### Test File Structure

- Test files are located in the `__tests__` directory
- Test files use the `.jsx` extension
- Jest configuration is in `jest.config.js`
- Test setup code is in `jest.setup.js`

## Writing Tests

When writing new tests, please follow these guidelines:

1. **Use JavaScript Syntax**: Create `.jsx` files, not `.tsx` files.

2. **Use React.createElement Instead of JSX Syntax**:

   ```javascript
   // Do this:
   render(React.createElement('div', { 'data-testid': 'test-element' }, 'Test'))

   // Instead of this:
   render(<div data-testid='test-element'>Test</div>)
   ```

3. **Use CommonJS-style Imports**:

   ```javascript
   // Do this:
   const { render, screen } = require('@testing-library/react')
   const React = require('react')

   // Instead of this:
   import { render, screen } from '@testing-library/react'
   import React from 'react'
   ```

4. **Follow Testing Best Practices**:
   - Test component behavior, not implementation details
   - Use data-testid attributes for element selection
   - Write small, focused test cases
   - Use descriptive test and assertion names

## Running Tests

- **Run all tests**: `npm test` or `pnpm test`
- **Run tests in watch mode**: `npm test:watch` or `pnpm test:watch`

## Continuous Integration

Our GitHub Actions workflows automatically run tests for every pull request and push to the main branch. Tests must pass before code can be merged.

The workflow files are configured to use `npm test` to run the tests without requiring `ts-node`.
