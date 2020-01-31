const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const axios = require('axios');
const TwitterClient = require('../../lib/twitter-client');

chai.use(chaiAsPromised);

describe('the twitter client module', () => {
  let twitterClient;
  before(() => {
    twitterClient = new TwitterClient('aKey', 'aSecret');
  });

  it('should invoke GET APIs', async () => {
    sinon.stub(axios, 'get').resolves({data: 'foo'});
    const response = await twitterClient.get('searchAPI');
    expect(response).to.equal('foo');
    axios.get.restore();
  });

  it('should reject on invalid consumer credentials and or user credentials', async () => {
    sinon.stub(axios, 'get').rejects(new Error('401'));
    await expect(twitterClient.get('searchAPI')).to.be.rejectedWith('Invalid Twitter credentials');
    axios.get.restore();
  });
  it('should reject on rate limit error', async () => {
    sinon.stub(axios, 'get').rejects(new Error('429'));
    await expect(twitterClient.get('searchAPI')).to.be.rejectedWith('Twitter rate limit reached');
    axios.get.restore();
  });
  it('should reject on other errors', async () => {
    sinon.stub(axios, 'get').rejects(new Error('404'));
    await expect(twitterClient.get('searchAPI')).to.be.rejectedWith('Twitter:');
    axios.get.restore();
  });
});
