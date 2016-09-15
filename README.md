# validate-licenses

> Validate licenses of npm modules and fail builds if unapproved licenses exist.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install validate-licenses --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('validate-licenses');
```

## The "validate_licenses" task

### Overview
In your project's Gruntfile, add a section named `validate_licenses` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  validate_licenses: {
    options: {
      // Task-specific options go here.
    },
    out: // name and path to report.json
  }
});
```

### Options

#### options.blacklist
Type: `Array`
Default value: `[]`

An array regexs that specifies a list of unacceptable or unapproved licenses.

```js
options: {
  blacklist: ['bad-license-name', 'regex-of-partial-bad-license-name']
}
```

#### options.whitelist
Type: `Object`
Default value: `[]`

An object listing all of the approved licenses which may appear on the blacklisted report.

```js
options: {
  whitelist: {
    "module@version": {
        "approvedby": "approvers name",
        "approvedon": "date of approval",
        "comment": "reason for approval"
    }
  }
}
```

#### out
Type: `String`
Default value: `[]`
Required: true

A string containing the path of where we will output the json results file.

```js
out: 'path/to/save/output.json'
```


### Usage Examples

#### Default Options
In this example, the default options are used to generate a json report of all production licenses for your project.

```js
grunt.initConfig({
  validate_licenses: {
    options: {},
    out: 'build/licenses.json'
  }
});
```

#### Custom Options
In this example, custom options are used to specify that all GPL related licenses are bad.

```js
grunt.initConfig({
  validate_licenses: {
    options: {
      blacklist: [ '.*GPL.*' ]
    },
    out: 'build/licenses.json'
  }
});
```

In this example, custom options are used to specify that all GPL related licenses are bad, yet xmldom@0.1.22 has been approved for release.

```js
grunt.initConfig({
  validate_licenses: {
    options: {
      blacklist: [ '.*GPL.*' ],
      whitelist: {
        "xmldom@0.1.22": {
          "approvedby": "Daniel Moran",
          "approvedon": "2016-09-14",
          "comment": "Module allows you to choose between MIT or LGPL."
        }
      }
    },
    out: 'build/licenses.json'
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2016-09-15 v0.1.1 Fixing pathing to license-checker sub-module
* 2016-09-14 v0.1.0 Release validate licenses from helper Run on Grunt v0.4
