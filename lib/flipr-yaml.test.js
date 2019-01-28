const memoize = require('p-memoize');
const fliprValidation = require('flipr-validation');
const FliprYaml = require('./flipr-yaml');

jest.mock('flipr-validation');

describe('constructor', () => {
  it('throws if options.filePath does not exist', () => {
    expect(() => new FliprYaml()).toThrow();
  });
});

describe('getConfig', () => {
  it('reads a basic yaml file', async () => {
    const source = new FliprYaml({ filePath: 'test/fixtures/1.yaml' });
    const config = await source.getConfig();
    expect(config).toEqual({
      key1: {
        description: 'Some description\n',
        value: 'someValue1',
      },
      key11: {
        description: 'Some description\n',
        value: 'someValue11',
      },
    });
  });
  it('merges two configs provided via array', async () => {
    const source = new FliprYaml({ filePath: ['test/fixtures/1.yaml', 'test/fixtures/2.yaml'] });
    const config = await source.getConfig();
    expect(config).toEqual({
      key1: {
        description: 'Some description\n',
        value: 'someValue1',
      },
      key11: {
        description: 'Some description\n',
        value: 'someValue11',
      },
      key2: {
        description: 'Some description\n',
        value: 'someValue2',
      },
      key22: {
        description: 'Some description\n',
        value: 'someValue22',
      },
    });
  });
  it('globs multiple config files across nested directories', async () => {
    const source = new FliprYaml({
      filePath: ['test/fixtures/**/!(invalid).yaml'],
      duplicateKeysOverride: true,
    });
    const config = await source.getConfig();
    expect(config).toEqual({
      key1: {
        description: 'Some description\n',
        value: 'someValue3',
      },
      key11: {
        description: 'Some description\n',
        value: 'someValue11',
      },
      key2: {
        description: 'Some description\n',
        value: 'someValue2',
      },
      key22: {
        description: 'Some description\n',
        value: 'someValue22',
      },
      key33: {
        description: 'Some description\n',
        value: 'someValue33',
      },
    });
  });
  it('throws an error for duplicate keys when duplicateKeysOverride is false (by default)', async () => {
    const source = new FliprYaml({
      filePath: ['test/fixtures/**/!(invalid).yaml'],
    });
    await expect(source.getConfig()).rejects.toThrow();
  });
  it('throws an error for invalid yaml', async () => {
    const source = new FliprYaml({
      filePath: 'test/fixtures/invalid.yaml',
    });
    await expect(source.getConfig()).rejects.toThrow();
  });
  it('throws an when no yaml files are found', async () => {
    const source = new FliprYaml({
      filePath: 'test/fixtures/doesnotexist.yaml',
    });
    await expect(source.getConfig()).rejects.toThrow();
  });
});

describe('preload', () => {
  it('calls getConfig to cache config in memoizer', async () => {
    const source = new FliprYaml({ filePath: 'test/fixtures/1.yaml' });
    source.getConfig = jest.fn();
    await source.preload();
    expect(source.getConfig).toHaveBeenCalled();
  });
});

describe('flush', () => {
  it('clears the memoized config', async () => {
    const source = new FliprYaml({ filePath: 'test/fixtures/1.yaml' });
    const clearSpy = jest.spyOn(memoize, 'clear');
    await source.flush();
    expect(clearSpy).toHaveBeenCalled();
  });
});

describe('validateConfig', () => {
  it('passes config and rules to flipr-validation', async () => {
    const rules = ['some', 'rules'];
    const config = { some: 'config' };
    const source = new FliprYaml({ filePath: 'test/fixtures/1.yaml' });
    source.getConfig = () => config;
    await source.validateConfig(rules);
    expect(fliprValidation).toHaveBeenCalledWith({ rules, config });
  });
});
