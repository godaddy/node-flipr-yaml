const FliprYaml = require('../lib/flipr-yaml');

const source = new FliprYaml({
  filePath: 'sample/config/basic.yaml',
});

source.getConfig().then(
  config => console.log(JSON.stringify(config, null, 2)),
  err => console.dir(err),
);
