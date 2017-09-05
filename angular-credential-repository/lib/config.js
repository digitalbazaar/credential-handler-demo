/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const cc = bedrock.util.config.main.computer();
const config = bedrock.config;
const path = require('path');
require('bedrock-server');
require('bedrock-views');
require('bedrock-did-client');

// server info
config.server.port = 14443;
config.server.httpPort = 14080;
config.server.domain = 'example.credential-repository.dev';

// angular-credential-repository pseudo package
const rootPath = path.join(__dirname, '..');
config.views.system.packages.push({
  path: path.join(rootPath, 'components'),
  manifest: path.join(rootPath, 'package.json')
});

// URLs for Authorization.io
cc('views.vars.authorization-io.baseUri', () =>
  config['did-client']['authorization-io'].baseUrl);
