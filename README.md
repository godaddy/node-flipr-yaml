# node-flipr-yaml

[![NPM](https://nodei.co/npm/flipr-yaml.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/flipr-yaml/)

[![Build Status](https://travis-ci.org/godaddy/node-flipr-yaml.svg)](https://travis-ci.org/godaddy/node-flipr-yaml)

This project is part of the [flipr family](https://github.com/godaddy/node-flipr).

node-flipr-yaml is a [flipr source](https://github.com/godaddy/node-flipr#what-is-a-flipr-source) for retrieving flipr configuration data from yaml files.

![node-flipr](/flipr.png?raw=true "node-flipr")

# How does it work?
The examples below show you how to create the flipr yaml source.  A source by itself isn't very useful.  You'll still need to give the source to flipr, so that it can use it to do awesome things.  See the [flipr documentation](https://github.com/godaddy/node-flipr) for how to use a source.

## Here's the simplest example:
```yaml
---
# Here's a basic YAML config file. Assume it exists at config/simple.yaml
someConfigKey:
  description: >
    This is some config key that has some value.
  value: someValue
```

```javascript
const FliprYaml = require('flipr-yaml');
const source = new FliprYaml({
  filePath: 'config/simple.yaml',
});
source.getConfig().then(
  config => console.log(config),
  err => console.log(err),
);
```

# Validating your yaml files
`flipr-yaml` has the ability to validate your yaml files.  This is very useful if you're storing your yaml files alongside your app code and using a CICD pipeline to automatically deploy changes. You can create a unit test that runs `flipr-yaml`'s config validation, thereby catching any breaking changes to the config before they are released. The validation only catches syntax errors in the config. If you provide flipr-yaml the flipr rules you use in your application, it will catch some logical errors as well, like the values of a percent rule not adding up to 100%. [See here](sample/validate-config.js) for an example.

# Would you like to know [more](http://i.imgur.com/IOvYPfT.jpg)?
* [Basic example](sample/basic.js)
* [Environment/shared config example](sample/multiple.js)
* [Glob example](sample/glob.js)
* [Validating config files](sample/validate-config.js)
* [Forcing a preload/cache of YAML file(s)](sample/preload.js)
* [Flushing cached config](sample/flush-cache.js)

# Methods

In most cases, you should not need to call flipr-yaml's methods directly, flipr takes care of that.  However, it can be useful for testing and config validation.

* `async getConfig()` - Returns yaml config as an object. The first call to this method caches the config, which can be cleared by calling the `async flush()` method.
* `async preload()` - Loads the config into cache. Does the same thing as getConfig. It's called preload to fulfill flipr's source contract.
* `async flush()` - Flushes all cached values in flipr-yaml.
* `async validateConfig(rules)` - Validates the yaml files based on flipr's configuration syntax.  See [flipr-validation](https://github.com/godaddy/node-flipr-validation) for more information.

# Constructor Options

* `filePath` - _required_ - string, array - The yaml config file path(s) relative to the process's cwd. Supports glob patterns based on [minimatch patterns](https://github.com/isaacs/minimatch#usage).
* `duplicateKeysOverride` - bool - If true, duplicate keys in a multi-file scenario will be overridden by whichever is read last. Default is false, which results in an error thrown.
