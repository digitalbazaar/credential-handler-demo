/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
const config = bedrock.config;
const path = require('path');

const protractor = config.protractor.config;
let prepare;

// this file contains the url and other options related to target systems
prepare = path.join(__dirname, 'protractor', 'demo.prepare.js');
protractor.params.config.onPrepare.push(prepare);

prepare = path.join(__dirname, 'protractor', 'prepare.js');
protractor.params.config.onPrepare.push(prepare);

protractor.suites['payment-handler-demo-test'] =
  path.join(__dirname, 'protractor', 'tests', '**', '*.js');

const localCaps = {
  chrome61: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '61.0'
  },
  chrome60: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '60.0'
  },
  chrome59: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '59.0'
  },
  chrome58: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '58.0'
  },
  chrome57: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '57.0'
  },
  chrome56: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '56.0'
  },
  chrome53: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '53.0'
  },
  chrome52: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '52.0'
  },
  chrome51: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '51.0'
  },
  chrome50: {
    browserName: 'chrome',
    platform: 'Windows 10',
    version: '50.0'
  },
  firefox56: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '56.0'
  },
  firefox55: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '55.0'
  },
  firefox54: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '54.0'
  },
  firefox53: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '53.0'
  },
  firefox52: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '52.0'
  },
  firefox51: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '51.0'
  },
  firefox44: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '44.0'
  },
  firefox43: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '43.0'
  },
  firefox42: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '42.0'
  },
  firefox41: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '41.0'
  },
  firefox40: {
    browserName: 'firefox',
    platform: 'Windows 10',
    version: '40.0'
  },
  edge13: {
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '13.10586'
  },
  edge14: {
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '14.14393'
  },
  edge15: {
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '15.15063'
  }
};

const localGroups = {
  chrome: [
    localCaps.chrome61,
    localCaps.chrome60,
    localCaps.chrome59,
    localCaps.chrome58,
    localCaps.chrome57,
    localCaps.chrome56,
    localCaps.chrome53,
    localCaps.chrome52,
    localCaps.chrome51,
    localCaps.chrome50,
  ],
  edge: [
    // Edge 13 fails due to webdriver issues
    // localCaps.edge13,
    localCaps.edge14,
    localCaps.edge15,
  ],
  firefox: [
    localCaps.firefox56,
    localCaps.firefox55,
    localCaps.firefox54,
    localCaps.firefox53,
    localCaps.firefox52,
    localCaps.firefox51,
    localCaps.firefox44,
    localCaps.firefox43,
    localCaps.firefox42,
    localCaps.firefox41,
    localCaps.firefox40,
  ]
};

config.sauceLabs.multiCapabilities = localGroups.chrome;
