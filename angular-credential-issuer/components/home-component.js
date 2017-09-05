/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator, WebCredential */
'use strict';

export default {
  controller: Ctrl,
  templateUrl: 'angular-credential-issuer/home-component.html'
};

/* @ngInject */
function Ctrl($scope) {
  const self = this;
  self.loading = false;

  self.login = async () => {
    self.loading = true;
    const credential = await navigator.credentials.get({
      web: {
        VerifiableProfile: {
          '@context': 'https://w3id.org/identity/v1',
          id: '',
          publicKey: ''
        }
      }
    });
    if(credential) {
      self.userDid = credential.data.id;
    }
    self.loading = false;
    $scope.$apply();
  };

  self.store = async () => {
    self.loading = true;
    try {
      const credential = new WebCredential(
        'VerifiableProfile', createDemoProfile(self.userDid));
      self.credential = await navigator.credentials.store(credential);
      if(self.credential) {
        console.log('credential stored', self.credential);
        self.done = true;
      }
    } catch(e) {
      console.error(e);
    }
    self.loading = false;
    $scope.$apply();
  };
}

function uuid(a){return a?(0|Math.random()*16).toString(16):(""+1e7+-1e3+-4e3+-8e3+-1e11).replace(/1|0/g,uuid)};

const CONTEXT = [
  'https://w3id.org/identity/v1',
  'https://w3id.org/credentials/v1',
  {'br': 'urn:bedrock:'}
];

function createDemoProfile(did) {
  return {
    '@context': CONTEXT,
    id: did,
    credential: [{
      "@graph": {
        "@context": CONTEXT,
        "id": 'urn:uuid:' + uuid(),
        "type": ["Credential", "br:test:PassportCredential"],
        "name": "Passport",
        "issued": new Date().toJSON(),
        "issuer": "urn:issuer:test",
        "image": "http://simpleicon.com/wp-content/uploads/global_1-128x128.png",
        "claim": {
          "id": did,
          "name": "Pat Doe",
          "image": "http://simpleicon.com/wp-content/uploads/business-woman-2-128x128.png",
          "schema:birthDate": {
            "@value": "1980-01-01T00:00:00Z",
            "@type": "xsd:dateTime"
          },
          "schema:gender": "female",
          "schema:height": "65in",
          "br:test:eyeColor": "blue",
          "schema:nationality": {
            "name": "United States"
          },
          "address": {
            "type": "PostalAddress",
            "streetAddress": "1 Main St.",
            "addressLocality": "Blacksburg",
            "addressRegion": "Virginia",
            "postalCode": "24060",
            "addressCountry": "US"
          },
          "br:test:passport": {
            "type": "br:test:Passport",
            "name": "Test Passport",
            "br:test:documentId": Date.now().toString(),
            "issuer": "https://example.gov/",
            "issued": "2010-01-07T01:02:03Z",
            "expires": "2020-01-07T01:02:03Z"
          }
        },
        "signature": {
          "type": "RsaSignature2017",
          "created": "2017-08-09T01:02:03Z",
          "creator": "did:" + uuid() + '/keys/1',
          "signatureValue": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM=="
        }
      }
    }]
  };
}
