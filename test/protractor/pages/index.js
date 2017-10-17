/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const pages = global.bedrock.pages || {};
module.exports = pages;

pages['credential-respository'] = {
  base: require('./credential-repository-base')
};
pages['credential-issuer'] = {
  base: require('./credential-issuer-base')
};
pages['credential-verifier'] = {
  base: require('./credential-verifier-base')
};
