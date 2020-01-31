const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const axios = require('axios');
const GithubClient = require('../../lib/github-client');

chai.use(chaiAsPromised);

describe('the github client module', () => {
  it('should invoke GET APIs', async () => {
    sinon.stub(axios, 'get').resolves({data: 'foo'});
    const response = await GithubClient.get('search for a repo');
    expect(response).to.equal('foo');
    axios.get.restore();
  });

  it('should reject an error', async () => {
    sinon.stub(axios, 'get').rejects(new Error('404'));
    await expect(GithubClient.get('searchAPI')).to.be.rejectedWith('Error retrieving repository data from github');
    axios.get.restore();
  });
});
