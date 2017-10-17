/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = global.bedrock;
const EC = protractor.ExpectedConditions;

const api = {};
module.exports = api;

const cv = bedrock.sites['credential-verifier'];

api.btnProvidePassport = () => element(by.buttonText('Provide Passport'));

api.check = () => {
  browser.wait(EC.visibilityOf($('cv-home')), 3000);
  api.btnProvidePassport().isDisplayed().should.eventually.be.true;
};

api.get = () => {
  bedrock.get(cv.url);
};
