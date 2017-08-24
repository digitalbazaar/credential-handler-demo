/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const config = bedrock.config;
const path = require('path');
require('bedrock-server');
require('bedrock-express');
require('bedrock-views');

// only run application on HTTP port
bedrock.events.on('bedrock-express.ready', app => {
  // attach express to regular http
  require('bedrock-server').servers.http.on('request', app);
  // cancel default behavior of attaching to HTTPS
  return false;
});

// server info
config.server.port = 19081;
config.server.httpPort = 19080;
config.server.domain = 'credential-mediator.demo.digitalbazaar.com';
config.server.host = 'credential-mediator.demo.digitalbazaar.com';
config.server.baseUri = 'https://' + config.server.host;

config.views.vars.minify = true;

config.express.staticOptions.maxAge = '15m';

// common paths
config.paths.cache = path.join(__dirname, '..', '.cache');
config.paths.log = path.join('/var', 'log', 'credential-mediator');

// core configuration
config.core.workers = 1;
config.core.worker.restart = true;

// master process while starting
config.core.starting.groupId = 'adm';
config.core.starting.userId = 'root';

// master and workers after starting
config.core.running.groupId = 'bedrock';
config.core.running.userId = 'bedrock';

// logging
config.loggers.app.bedrock.enableChownDir = true;
config.loggers.access.bedrock.enableChownDir = true;
config.loggers.error.bedrock.enableChownDir = true;
