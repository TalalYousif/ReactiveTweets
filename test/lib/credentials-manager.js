const chai = require('chai');
const expect = chai.expect;
const CredentialsManager = require('../../lib/credentials-manager');
const config = {
  twitterCredentials: {
    consumerKey: 'aconsumerKey',
    consumerSecret: 'aconsumerSecret',
  },
};

const faultyConfig = {
  twitterCredentials: {
    consumerKey: null,
    consumerSecret: null,
  },
};

describe('the credentials manager module', () => {
  let credentialsManager;
  let faultyCredentialsManager;

  before(() => {
    credentialsManager = new CredentialsManager(config.twitterCredentials);
    faultyCredentialsManager = new CredentialsManager(faultyConfig.twitterCredentials);
  });

  it('should return a consumer key', async () => {
    expect(credentialsManager.consumerKey).to.equal('aconsumerKey');
  });

  it('should return a consumer Secret', async () => {
    expect(credentialsManager.consumerSecret).to.equal('aconsumerSecret');
  });

  it('should throw on an invalid consumer key', async () => {
    expect(()=> faultyCredentialsManager.consumerKey)
        .to.throw('Consumer Key not found, please make sure to add it to app.config.json');
  });

  it('should throw on an invalid consumer Secret', async () => {
    expect(()=> faultyCredentialsManager.consumerSecret)
        .to.throw('Consumer Secret not found, please make sure to add it to app.config.json');
  });
});
