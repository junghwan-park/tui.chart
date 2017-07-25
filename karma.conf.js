'use strict';

var path = require('path');
var pkg = require('./package.json');

var webdriverConfig = {
    hostname: 'fe.nhnent.com',
    port: 4444,
    remoteHost: true
};

/* eslint no-process-env: 0, camelcase: 0 */

function setConfig(defaultConfig, server, browser) {
    if (server === 'ne') {
        defaultConfig.customLaunchers = {
            IE8: {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: 8
            },
            IE9: {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: 9
            },
            IE10: {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: 10
            },
            IE11: {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: 11
            },
            'Chrome-WebDriver': {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'chrome'
            }
        };

        defaultConfig.concurrency = 5;

        defaultConfig.reporters = [
            'dots',
            'coverage',
            'junit'
        ];

        defaultConfig.browsers = browser || [/* 'IE8', */'IE9', 'IE10', 'IE11', 'Chrome-WebDriver'];
    } else if (server === 'sl') {
        defaultConfig.sauceLabs = {
            testName: pkg.name + ' ::: ' + pkg.version + ' ::: ' + new Date().toLocaleDateString('en-US'),
            username: process.env.SAUCE_USERNAME,
            accessKey: process.env.SAUCE_ACCESS_KEY,
            startConnect: true,
            tags: [pkg.name, pkg.version],
            build: pkg.version,
            passed: true,
            recordVideo: true,
            recordScreenshots: true,
            recordLogs: true,
            webdriverRemoteQuietExceptions: true
        };

        defaultConfig.customLaunchers = {
            sl_chrome: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'Linux',
                version: '48'
            },
            sl_ie_10: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8',
                version: '10'
            },
            sl_ie_11: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8.1',
                version: '11'
            }
        };
        defaultConfig.reporters = ['saucelabs', 'junit'];

        defaultConfig.browsers = browser || ['sl_chrome', 'sl_ie_10', 'sl_ie_11'];

        defaultConfig.browserNoActivityTimeout = 30000;
    } else {
        defaultConfig.browsers = ['PhantomJS'];
        defaultConfig.singleRun = false;

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        defaultConfig.reporters = ['narrow'];
    }
}

module.exports = function(config) {
    var defaultConfig = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        captureTimeout: 100000,
        browserDisconnectTimeout: 60000,
        browserNoActivityTimeout: 60000,

        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-junit-reporter',
            'karma-webpack',
            'karma-sourcemap-loader',
            'karma-webdriver-launcher',
            'karma-phantomjs-launcher',
            'karma-sauce-launcher',
            'karma-narrow-reporter'
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            {
                pattern: 'lib/tui-code-snippet/code-snippet.js',
                watched: false
            },
            {
                pattern: 'lib/raphael/raphael.js',
                watched: false
            },
            'test/test.bundle.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/test.bundle.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: '#inline-source-map',
            resolve: {
                root: [path.resolve('./src/js')]
            },
            module: {
                loaders: [{
                    test: /\.less$/,
                    loader: 'css-loader!less?paths=src/less/'
                }]
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true,
            stats: {
                colors: true
            }
        },

        // optionally, configure the reporter
        coverageReporter: {
            dir: 'report/coverage/',
            reporters: [
                {
                    type: 'html',
                    subdir: function(browser) {
                        return 'report-html/' + browser;
                    }
                },
                {
                    type: 'cobertura',
                    subdir: function(browser) {
                        return 'report-cobertura/' + browser;
                    },
                    file: 'cobertura.txt'
                }
            ]
        },

        junitReporter: {
            outputDir: 'report/junit',
            suite: ''
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
        // config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        autoWatchBatchDelay: 100,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    };

    setConfig(defaultConfig, process.env.SERVER, process.env.BROWSER);
    config.set(defaultConfig);
};
