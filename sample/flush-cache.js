const FliprYaml = require('../lib/flipr-yaml');

const source = new FliprYaml({
  filePath: 'sample/config/basic.yaml',
});

source.preload()
  .then(() => {
    console.log('Config file has been read and cached.  Any changes to the .yaml file will not be read by flipr-yaml.');
  })
  .then(() => source.flush())
  .then(() => {
    console.log('Cache has been flushed. The next call to flipr-yaml will result in the file being read and cached again.');
  });
