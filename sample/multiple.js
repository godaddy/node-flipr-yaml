// This example merges multiple yaml files into a single config.
// This is useful when you have environment-based config, but want
// to share some common config across environments

const FliprYaml = require('../lib/flipr-yaml');

const source = new FliprYaml({
  filePath: [
    'sample/config/multiple/common.yaml',
    'sample/config/multiple/dev.yaml',
  ],
});

source.getConfig().then(
  config => console.log(JSON.stringify(config, null, 2)),
  err => console.dir(err),
);
