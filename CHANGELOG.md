## v2.0.0 (January 28, 2019)

### Features and Improvements

- ES6+ rewrite
- Now supports async/await
- Now supports globs and multiple file paths
- Lots of cleanup and prep work for more features
- `jest` for testing
- `eslint` for linting

### Breaking Changes

- Drop support for node < v8.3
- Default export is now a `FliprYaml` class
- Removed most options, now just has `filePath` (string, array), and `duplicateKeysOverride` (bool)

## v1.0.1 (March 12, 2015)

Bug Fixes:

  - Fixed dependency on flipr-validation

## v1.0.0 (March 12, 2015)

Initial release.

Features:

  - Read flipr configuration from yaml files
  - Can be aware of different environments and use the appropriate configuration file
  - Validates configuration files to ensure correct syntax
