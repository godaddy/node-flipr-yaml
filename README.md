node-flipr-yaml
============

**Stability: 1 - Experimental** 

This project is part of the [flipr family](https://github.com/godaddy/node-flipr).

node-flipr-yaml is a [flipr source](http://todoaddurl) for retrieving flipr configuration data from yaml files.

![node-flipr](/flipr.png?raw=true "node-flipr")

# How does it work?
The examples below are just showing you how to create the flipr yaml source.  A source by itself isn't very useful.  You'll still need to give the source to flipr, so that it can use it to do awesome things.  See the [flipr documentation](https://github.com/godaddy/node-flipr) for how to use a source.

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
var FliprYaml = require('flipr-yaml');
var source = new FliprYaml({
  folderPath: './config',
  fileName: 'simple.yaml'
});
source.getConfig(function(err, config){
  console.dir(config);
});
```
## Here's a more complex example:
```yaml
---
someConfigKey:
  description: >
    This is some config key that has multiple values
    that flipr can select based on the user/request context.
  values:
    - value: someValue
      isUserSpecial: true
      percent: 25
    - value: someOtherValue
      userIds:
        - 1234
        - 5678
      percent: 75
```

```javascript
var FliprYaml = require('flipr-yaml');
var source = new FliprYaml({
  folderPath: './config',
  fileName: 'complex.yaml'
});
source.getConfig(function(err, config){
  console.dir(config);
});
```

# Validating your yaml files
flipr-yaml has the ability to validate your yaml files.  This is very useful if you're storing your yaml files in your repo and using a CICD pipeline to automatically deploy config changes after commiting changes to the yaml files (presumably via github's awesome text editor).  Unit tests are part of any sane CICD pipeline; we don't want to deploy broken code, right?  Well, you can create a unit test that runs flipr-yaml's config validation, thereby catching any breaking changes to the config.  Now you can commit config changes with some confidence that a typo won't blow up your application.  Of course, the validation can't catch all typos, but it will catch syntax errors.  And if you provide flipr-yaml the flipr rules you use in your application, it will catch some logical errors, like the values of a percent rule not adding up to 100%.  Here's an example:

```javascript
var FliprYaml = require('flipr-yaml');

var source = new FliprYaml({
  folderPath: './config',
  fileName: 'simple.yaml',
  rules: [
    {type: 'percent', input: 'someProperty'}
  ]
})
source.validateConfig(function(err, errors){
  if(err)
    return void console.log('Validation did not complete due to an unexpected error.')
  if(errors.length > 0)
    return void console.log('One or more errors found, you need to fix your config!')
  console.log('No errors found, config is clean!')
});

```

# Would you like to know [more](http://i.imgur.com/IOvYPfT.jpg)?
* [Basic example](/sample/basic.js)
* [Environment-aware configuration files](/sample/environment-awareness.js)
* [Validating config files](/sample/validate-config.js)
* [Forcing a preload/cache of YAML file](/sample/preload.js)
* [Flushing cached config](/sample/flush-cache.js)

# Methods

In most cases, you should not need to call flipr-yaml's methods directly, flipr takes care of that.  However, for testing or config validation, it can be necessary.

* `getConfig` - (cb) - Takes a callback that receives the config after it is read from the yaml files.  The first call to this method caches the config, which can be cleared by calling the `flush` method.
* `preload` - (cb) - Does the same thing as getConfig.  It's called preload to fulfill flipr's expectation of a preload method on sources, which caches all data that can be cached.
* `flush` - () - Flushes all cached values in flipr-yaml.  This is not guaranteed to be a synchronous action.  There is a chance you may still receive a cached config for a short time after flushing.
* `validateConfig` - (cb) - Validates the yaml files based on flipr's configuration syntax.  See [flipr-validation](https://github.com/gshively11/node-flipr-validation) for more information.

# Options

* `folderPath` - _required_ - string - The folder path containing the configuration files.  It should be an *absolute* path to the folder holding your config files.  If you pass a relative path, it will default to the CWD of the node process.
  * Defaults to `'lib/config/'`
* `fileName` - _optional_ - string - The name of the file in `folderPath` to use for configuration.  If specified, it will override all environment-based options.
* `envVariable` - _optional_ - string - The name of the environment variable that stores a string identifying the host's environment.
  * Defaults to `'NODE_ENV'`
* `envFileNameMap` - _optional_ - object - A key/value object used to map values from `envVariable` to `envFileNameFormat` placeholders.  See [this sample](/sample/environment-awareness.js) for more details.
  * Default

```javascript
{
  dev: 'dev',
  development: 'development',
  test: 'test',
  staging: 'staging',
  master: 'prod',
  prod: 'prod',
  prodution: 'production'
}
```
* `envFileNameFormat` - _optional_ - string - The util.format string for your environment-based configuration files.  It should contain a single format placeholder (`%s`), which will be replaced by the value selected from `envFileNameMap`.
  * Defaults to `'%s.yaml'`
* `envLocalFileName` - _optional - string - Name of the file that is used to conditionally override the environment-based config file.  If this file exists, flipr will use it instead of the one for the current environment.  Useful for overriding configuration locally.  Typically you would add this file to your .gitignore.
  * Defaults to `'local.yaml'`
* `rules` - _optional_ - array - The rules you will be using with this config.  This is only used by the validateConfig function.  It's recommended to provide any rules you use, because validation becomes much more accurate.
