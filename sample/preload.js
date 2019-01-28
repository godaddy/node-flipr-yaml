const FliprYaml = require('../lib/flipr-yaml');

const source = new FliprYaml({
  filePath: 'sample/config/basic.yaml',
});

source.preload()
  .then(() => {
    console.log('Config file has been read and cached. Useful to call during app warmup.');
  });
