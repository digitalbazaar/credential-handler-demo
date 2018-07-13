<template>
  <div class="row" style="margin: 0;">
    <div class="br-card-id-1 br-card-id-1-border" xstyle="cardStyle">
      <div class="br-credential-card-header" align="center">
        {{credential.name | uppercase}}
      </div>
      <div class="br-credential-card-body">
        <div class="br-credential-card-body-col-1">
          <div class="br-credential-card-picture">
            <img :src="credential.image">
          </div>
        </div>
        <div class="br-credential-card-body-col-2">
          <div class="br-passport-row-1-col-1">
            <dl class="br-credential-card-attr">
              <dt>Name</dt>
              <dd>{{credential.claim.name | uppercase}}</dd>
              <dt>Gender</dt>
              <dd>
                {{credential.claim['schema:gender'] | uppercase}}
              </dd>
              <dt>Date of birth</dt>
              <dd>
                {{credential.claim['schema:birthDate']['@value'] | date:'MM/dd/yyyy'}}
              </dd>
              <dt>Nationality</dt>
              <dd>{{credential.claim['schema:nationality'].name | uppercase}}</dd>
            </dl>
          </div>
          <div class="br-passport-row-1-col-2">
            <dl class="br-credential-card-attr">
              <dt>Height</dt>
              <dd>{{credential.claim['schema:height']}}</dd>
              <dt>Eye Color</dt>
              <dd>
                {{credential.claim['urn:bedrock:test:eyeColor'] | uppercase}}
              </dd>
            </dl>
          </div>
          <div class="br-passport-row-1-col-3">
            <img :src="credential.claim.image">
          </div>
          <div class="br-passport-row-2">
            <dl class="br-credential-card-attr">
              <dt>Address</dt>
              <dd>
                <div>{{credential.claim.address.streetAddress | uppercase}}</div>
                <div>{{credential.claim.address.addressLocality | uppercase}},
                  {{credential.claim.address.addressRegion | uppercase}}
                  {{credential.claim.address.postalCode | uppercase}} {{credential.claim.address.addressCountry | uppercase}}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/*!
 * New BSD License (3-clause)
 * Copyright (c) 2017-2018, Digital Bazaar, Inc.
 * All rights reserved.
 */
'use strict';

export default {
  name: 'CredentialCard',
  props: {
    credential: {
      type: Object,
      required: true
    },
    cardWidth: {
      type: String,
      default: '300px'
    },
    cardBackgroundColor: String,
    cardBackgroundImage: String
  },
  /*data() {
    return {
      credential2: { "@context": [ "https://w3id.org/identity/v1", "https://w3id.org/credentials/v1", { "br": "urn:bedrock:" } ], "id": "did:method1:1234-1234-1234-1234", "credential": [ { "@graph": { "@context": [ "https://w3id.org/identity/v1", "https://w3id.org/credentials/v1", { "br": "urn:bedrock:" } ], "id": "urn:uuid:a4cbc46c-19bf-4966-8db6-2f164ec97fb9", "type": [ "Credential", "br:test:PassportCredential" ], "name": "Passport", "issued": "2018-07-13T19:48:48.965Z", "issuer": "urn:issuer:test", "image": "http://simpleicon.com/wp-content/uploads/global_1-128x128.png", "claim": { "id": "did:method1:1234-1234-1234-1234", "name": "Pat Doe", "image": "http://simpleicon.com/wp-content/uploads/business-woman-2-128x128.png", "schema:birthDate": { "@value": "1980-01-01T00:00:00Z", "@type": "xsd:dateTime" }, "schema:gender": "female", "schema:height": "65in", "br:test:eyeColor": "blue", "schema:nationality": { "name": "United States" }, "address": { "type": "PostalAddress", "streetAddress": "1 Main St.", "addressLocality": "Blacksburg", "addressRegion": "Virginia", "postalCode": "24060", "addressCountry": "US" }, "br:test:passport": { "type": "br:test:Passport", "name": "Test Passport", "br:test:documentId": "1531511328965", "issuer": "https://example.gov/", "issued": "2010-01-07T01:02:03Z", "expires": "2020-01-07T01:02:03Z" } }, "signature": { "type": "RsaSignature2017", "created": "2017-08-09T01:02:03Z", "creator": "did:db0f0ccd-2062-4b7b-8cbd-bb14d50769b0/keys/1", "signatureValue": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGHIJKLM==" } } } ] }
    };
  },*/
  computed: {
    cardStyle() {
      return computeCardStyle({width: this.cardWidth});
    },
    /*
    // FIXME: remove me
    credential() {
      console.log('this.credential2', this.credential2)
      return this.credential2.credential[0]['@graph'];
    }*/
  },
  filters: {
    uppercase: value => (value || '').toUpperCase()
  }
};

/**
 * Computes the CSS style for a ISO/IEC 7810 ID-1 card based on the given
 * displayer options.
 *
 * @param type the type of card (default: 'id-1').
 * @param [width] the width for the card component.
 * @param [background] an object with the background style to use.
 *
 * @return the computed style.
 */
function computeCardStyle({type = 'id-1', width = '300px', background}) {
  const style = {};

  if(type !== 'id-1') {
    throw new TypeError(
      'Unsupported card type: "' + type +
      '". Supported types are: "id-1".');
  }

  if(typeof width === 'string') {
    const width = parseCssValue(width);
    style.width = width;
    // id-1 dimensions are 85.60mm x 53.98mm
    style.height = (width.value * 53.98 / 85.60) + width.unit;
    // default CSS is coded based on a 1/100 width:fontsize ratio
    style['font-size'] = (width.value * 1 / 100) + width.unit;
  }

  // TODO: need to be able to support different backgrounds for card header
  // vs. card body
  if(background && typeof background === 'object') {
    Object.assign(style, computeBackground(background));
  }

  return style;
}

/**
 * Computes the CSS style for an element's background.
 *
 * @param [color] the CSS color.
 * @param [image] the image as a URL.
 * @param [linearGradient] true for a default linear gradient.
 * @param [radialGradient] true for a default radial gradient.
 *
 * @return the computed style.
 */
function computeBackground({color, image, linearGradient, radialGradient}) {
  const style = {};

  if(color) {
    style['background-color'] = color;
  }

  const backgroundImages = [];
  if(image) {
    backgroundImages.push('url("' + image + '")');
  }

  if(radialGradient === true) {
    // create default radial gradient
    radialGradient = 'radial-gradient(' +
      'circle at -25% -25%, ' +
      'rgba(255, 255, 255, 0.75) 0%, ' +
      'transparent 70%, ' +
      'rgba(0, 0, 0, 0.2) 90%)';
    /* radialGradient = 'radial-gradient(' +
      'ellipse at center, #fff 0%, transparent 80%)';*/
  }
  if(radialGradient) {
    backgroundImages.push(radialGradient);
  }

  if(linearGradient === true) {
    // create default linear gradient
    linearGradient = 'linear-gradient(' +
      'to bottom right, ' +
      'rgba(255, 255, 255, 0.5) 0%, ' +
      'transparent 40%, ' +
      'rgba(0, 0, 0, 0.2) 80%)';
    backgroundImages.push(linearGradient);
  }

  if(backgroundImages.length > 0) {
    style['background-image'] = backgroundImages.join(', ');
  }

  return style;
}

function parseCssValue(value) {
  const parsed = {};
  const matches = value.toString().trim().match(/^(-?[\d+\.\-]+)([a-z]+|%)$/i);
  if(matches) {
    parsed.value = parseFloat(matches[1]);
    parsed.unit = matches[2];
  } else {
    parsed.value = 0;
    parsed.unit = value;
  }
  return parsed;
}
</script>
<style>
</style>
