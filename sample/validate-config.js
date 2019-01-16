const FliprYaml = require('../lib/flipr-yaml');

const rules = [
  {
    type: 'equal',
    input: 'foo',
    property: 'someFlag'
  },
  {
    type: 'list',
    input: 'foo',
    property: 'userIds'
  },
  {
    type: 'percent',
    input: 'foo'
  }
];

const source = new FliprYaml({
  filePath: 'sample/config/validate-config.yaml',
});

source.validateConfig(rules).then(
  (errors) => {
    if (errors.length) {
      console.log('Errors detected in config');
      console.log(errors);
    } else {
      console.log('Config is valid');
    }
  },
  (err) => {
    console.log('Unexpected error encountered during validation');
    console.log(err);
  },
);
