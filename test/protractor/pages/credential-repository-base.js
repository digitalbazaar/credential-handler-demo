/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = global.bedrock;
const EC = protractor.ExpectedConditions;

const api = {};
module.exports = api;

const cr = bedrock.sites['credential-repository'];

api.btnInstall = () => element(by.buttonText('Install'));

api.check = () => {
  browser.wait(EC.visibilityOf($('cw-home')), 30000);
  api.btnInstall().isDisplayed().should.eventually.be.true;
};

api.get = () => {
  bedrock.get(cr.url);
};
