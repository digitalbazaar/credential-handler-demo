/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const config = bedrock.config;
const path = require('path');
require('bedrock-server');

// only run application on HTTP port
bedrock.events.on('bedrock-express.ready', function(app) {
  // attach express to regular http
  require('bedrock-server').servers.http.on('request', app);
  // cancel default behavior of attaching to HTTPS
  return false;
});

// server info
config.server.port = 18081;
config.server.httpPort = 18080;
config.server.domain = 'credential-issuer.demo.digitalbazaar.com';
config.server.host = 'credential-issuer.demo.digitalbazaar.com';
config.server.baseUri = 'https://' + config.server.host;

// angular-credential-issuer pseudo package
const rootPath = path.join(__dirname, '..');
config.views.system.packages.push({
  path: path.join(rootPath, 'components'),
  manifest: path.join(rootPath, 'package.json')
});
