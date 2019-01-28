// This example globs multiple yaml files into a single config.
// This is useful when you want to split config into multiple
// files based on responsibility.

const FliprYaml = require('../lib/flipr-yaml');

const source = new FliprYaml({
  filePath: 'sample/config/glob/*.yaml',
});

source.getConfig().then(
  config => console.log(JSON.stringify(config, null, 2)),
  err => console.dir(err),
);
