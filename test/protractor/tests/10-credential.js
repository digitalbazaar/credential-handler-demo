/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = global.bedrock;
const crBase = bedrock.pages['credential-respository'].base;
const ciBase = bedrock.pages['credential-issuer'].base;
const cvBase = bedrock.pages['credential-verifier'].base;
const EC = protractor.ExpectedConditions;

describe('Payment Handler Tests', () => {
  it('installs the credential handler', () => {
    crBase.get();
    crBase.check();
    crBase.btnInstall().click();
    browser.wait(EC.visibilityOf($('iframe')), 30000);
    const iframeElement = browser.driver.findElement(by.tagName('iframe'));
    browser.switchTo().frame(iframeElement);
    browser.wait(EC.visibilityOf($('aio-mediator')), 5000);
    element(by.buttonText('Allow')).click();
    browser.switchTo().defaultContent();
    browser.wait(EC.invisibilityOf($('iframe')), 5000);
    const issuerLink = element(by.linkText('Example Credential Issuer'));
    browser.wait(EC.visibilityOf(issuerLink), 5000);
  });
  it('logs in at the credential issuer', () => {
    ciBase.get();
    ciBase.check();
    ciBase.btnLogin().click();
    browser.wait(EC.visibilityOf($('iframe')), 30000);
    const iframeElement = browser.driver.findElement(by.tagName('iframe'));
    browser.switchTo().frame(iframeElement);
    browser.wait(EC.visibilityOf($('aio-mediator')), 5000);
    const identityList = element.all(by.repeater('hint in $ctrl.hints'));
    browser.wait(() => identityList.then(i => i.length === 3), 5000);
    const personalIdentity = identityList.filter(i =>
      i.getText().then(t => t.includes('My personal identity'))).get(0);
    personalIdentity.click();
    browser.switchTo().defaultContent();
    browser.wait(EC.invisibilityOf($('iframe')), 5000);
  });
  it('stores a passport credential', () => {
    browser.wait(EC.elementToBeClickable(ciBase.btnStorePassport()), 5000);
    ciBase.btnStorePassport().click();
    browser.wait(EC.visibilityOf($('iframe')), 30000);
    const iframeElement = browser.driver.findElement(by.tagName('iframe'));
    browser.switchTo().frame(iframeElement);
    browser.wait(EC.visibilityOf($('aio-mediator')), 5000);
    const identityList = element.all(by.repeater('hint in $ctrl.hints'));
    browser.wait(() => identityList.then(i => i.length === 1), 5000);
    const personalIdentity = identityList.get(0);
    personalIdentity.click();
    browser.wait(EC.visibilityOf($('iframe')), 5000);
    browser.waitForAngularEnabled(false);
    // NOTE: this is a non-angular page and has 2 child iframes
    browser.switchTo().frame(0);
    // NOTE: this page is angular
    browser.switchTo().frame(1);
    browser.wait(EC.visibilityOf($('cw-credential-store')), 5000);
    element(by.buttonText('Yes')).click();
    browser.switchTo().defaultContent();
  });
  it('confirms credential details', () => {
    browser.wait(EC.visibilityOf($('ci-home')), 5000);
    element.all(by.linkText('here')).get(0).click();
    $('pre').getText().then(credentialText => {
      const credentialDetails = JSON.parse(credentialText);
      credentialDetails.data.credential[0]['@graph'].claim.name
        .should.equal('Pat Doe');
    });
  });
  it('presents credential to a verifier', () => {
    cvBase.get();
    cvBase.check();
    cvBase.btnProvidePassport().click();
    browser.wait(EC.visibilityOf($('iframe')), 30000);
    const iframeElement = browser.driver.findElement(by.tagName('iframe'));
    browser.switchTo().frame(iframeElement);
    browser.wait(EC.visibilityOf($('aio-mediator')), 5000);
    const identityList = element.all(by.repeater('hint in $ctrl.hints'));
    browser.wait(() => identityList.then(i => i.length === 3), 5000);
    const personalIdentity = identityList.filter(i =>
      i.getText().then(t => t.includes('My personal identity'))).get(0);
    personalIdentity.click();
    browser.wait(EC.visibilityOf($('iframe')), 5000);
    // NOTE: this is a non-angular page and has 2 child iframes
    browser.switchTo().frame(0);
    // NOTE: this page is angular
    browser.switchTo().frame(1);
    browser.wait(EC.visibilityOf($('cw-credential-request')), 5000);
    const yesButton = element(by.buttonText('Yes'));
    browser.wait(EC.elementToBeClickable(yesButton), 5000);
    yesButton.click();
    browser.switchTo().defaultContent();
  });
  it('confirms credential details', () => {
    browser.wait(EC.visibilityOf($('cv-home')), 5000);
    const hereLink = element.all(by.linkText('here')).get(0);
    browser.wait(EC.visibilityOf(hereLink, 5000));
    hereLink.click();
    // element.all(by.linkText('here')).get(0).click();
    $('pre').getText().then(credentialText => {
      const credentialDetails = JSON.parse(credentialText);
      credentialDetails.data.credential[0]['@graph'].claim.name
        .should.equal('Pat Doe');
    });
  });
});
