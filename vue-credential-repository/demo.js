/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');
require('./lib/index');

// load config
require('./configs/demo');

bedrock.start();
