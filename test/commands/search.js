const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const search = require('../../commands/search');
const TwitterClient = require('../../lib/twitter-client');
const GithubClient = require('../../lib/github-client');

const twitterCredentials = {
  consumerKey: 'aconsumerKey',
  consumerSecret: 'aconsumerSecret',
};

chai.use(chaiAsPromised);

describe('the search module', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, 'log');
  });

  it('should output tweets about project', async () => {
    sandbox.stub(TwitterClient.prototype, 'get')
        .resolves({
          'statuses': [
            {
              'full_text': 'A text about ReactiveCocoa',
              'user': {
                'screen_name': 'User1',
              },
            },
            {
              'full_text': 'Another text about ReactiveCocoa',
              'user': {
                'screen_name': 'User2',
              },
            },
          ],
        });

    sandbox.stub(GithubClient, 'get').resolves({
      'items': [
        {
          'name': 'ReactiveCocoa',
          'owner': {
            'login': 'ReactiveCocoa',
          },
        },
      ],
    });

    const project = 'Reactive';
    await search(project, twitterCredentials);
    expect(console.log.calledTwice).to.be.true;
  });

  it('should report no repo found', async () => {
    sandbox.stub(GithubClient, 'get').resolves(
        {
          'total_count': 0,
          'incomplete_results': false,
          'items': [
          ],
        });

    const project = 'superduperReactive';
    await search(project, twitterCredentials);
    expect(console.log.calledWithExactly(`No github repository with the name ${project} was found`)).to.be.true;
  });

  afterEach(() => {
    sandbox.restore();
  });
});
