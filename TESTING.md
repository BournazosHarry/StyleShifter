# StyleShifter Test Suite

## Overview

Comprehensive test suite using **Vitest** - a modern, fast, and future-proof testing framework.

## Test Results

✅ **118 tests passing** across 5 test suites

### Test Coverage

- **Overall Coverage**: ~74% statements, ~91% branch coverage
- **Theme.ts**: 95.9% coverage
- **ThemeRegistry.ts**: 100% coverage ✨
- **Utils.ts**: 97% coverage
- **Built-in Functions**: 95% coverage
- **CSSProcessor.ts**: 61% coverage (complex parsing logic with many edge cases)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Files

- `Theme.test.ts` - 13 tests for core Theme class
  - Constructor initialization
  - DOM element manipulation (applyTo/removeFrom)
  - Property getters/setters
  - Image preloading
  - Completion callbacks
  - Font management

- `ThemeRegistry.test.ts` - 18 tests for theme cascading
  - Cascade registration
  - Cascade application and inheritance
  - Namespace handling
  - Name sanitization

- `utils.test.ts` - 16 tests for color utilities
  - Hex to RGBA conversion
  - RGB/RGBA parsing
  - Color format round-trip conversions
  - Edge cases and invalid inputs

- `functions.test.ts` - 38 tests for built-in API functions
  - url() wrapper
  - toPx() / toRem() unit conversion
  - opacify() color opacity
  - tint() color mixing
  - invert() color inversion
  - printf() string formatting

- `CSSProcessor.test.ts` - 33 tests for CSS processing
  - Function registration
  - Expression evaluation
  - Selector formatting
  - Rule extraction
  - Local/global variables
  - Style injection
  - Integration tests

## Test Philosophy

- **Unit tests**: Focus on individual functions and methods
- **Integration tests**: Verify component interactions
- **Edge cases**: Test boundary conditions and error handling
- **Async handling**: Proper promise-based testing (no deprecated done() callbacks)
- **DOM testing**: Uses happy-dom environment for fast DOM testing

## Future Improvements

Areas for additional coverage:
- More CSSProcessor integration tests with real CSS files
- Browser-specific CSS parsing edge cases
- Performance benchmarks
- Error handling for malformed CSS
- Additional custom function scenarios
