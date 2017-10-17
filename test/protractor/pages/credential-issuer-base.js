/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = global.bedrock;
const EC = protractor.ExpectedConditions;

const api = {};
module.exports = api;

const ci = bedrock.sites['credential-issuer'];

api.btnLogin = () => element(by.buttonText('Login'));

api.btnStorePassport = () => element(by.buttonText('Store Passport'));

api.check = () => {
  browser.wait(EC.visibilityOf($('ci-home')), 30000);
  api.btnLogin().isDisplayed().should.eventually.be.true;
};

api.get = () => {
  bedrock.get(ci.url);
};
