/*
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const cc = bedrock.util.config.main.computer();
const {config} = bedrock;
const os = require('os');
const path = require('path');
require('bedrock-server');
require('bedrock-views');

// server info
config.server.port = 14443;
config.server.httpPort = 14080;
config.server.domain = 'example.credential-repository.localhost';

// vue-credential-repository pseudo package
const rootPath = path.join(__dirname, '..');
config.views.system.packages.push({
  path: path.join(rootPath, 'components'),
  manifest: path.join(rootPath, 'package.json')
});

// common paths
config.paths.cache = path.resolve(path.join(rootPath, '.cache'));
config.paths.log = path.join(
  os.tmpdir(), 'example.credential-repository.localhost');

// URLs for Authorization.io
cc('views.vars.authorization-io.baseUri', () =>
//  'https://authorization.localhost:33443');
  'https://demo.authorization.io');
//  config['did-client']['authorization-io'].baseUrl);
