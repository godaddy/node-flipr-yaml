const fs = require('fs');
const { promisify } = require('util');
const memoize = require('p-memoize');
const globby = require('globby');
const yaml = require('js-yaml');
const fliprValidation = require('flipr-validation');

const readFile = promisify(fs.readFile);

const defaultOptions = {
  duplicateKeysOverride: false,
};

class FliprYaml {
  constructor(options) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
    if (!this.options.filePath) {
      throw new Error('options.filePath is required');
    }
    this.getConfig = memoize(this.getConfig);
  }

  async getConfig() {
    const paths = await globby(this.options.filePath);
    if (!paths || paths.length === 0) {
      throw new Error(`flipr-yaml failed to locate any configs files at ${this.options.filePath}`);
    }
    const readPromises = paths.map(async path => readFile(path, { encoding: 'utf-8' }));
    return Promise.all(readPromises)
      .then((files) => {
        const combinedFile = files.reduce((memo, file) => `${memo}\n${file.replace(/^---/, '')}`, '');
        return yaml.safeLoad(combinedFile, { json: this.options.duplicateKeysOverride });
      });
  }

  async preload() {
    // getConfig is memoized, calling it will prime the cache
    await this.getConfig();
  }

  async flush() {
    memoize.clear(this.getConfig);
  }

  async validateConfig(rules) {
    const config = await this.getConfig();
    return fliprValidation({
      rules,
      config,
    });
  }
}

module.exports = FliprYaml;
