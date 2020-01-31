const CredentialsManager = require('../lib/credentials-manager');
const GithubClient = require('../lib/github-client');
const TwitterClient = require('../lib/twitter-client');

const consts = {
  // Github search api sorted by stars descending to get the mose popular repos first
  gitHubSearchApi: 'search/repositories?sort=stars&order=desc&q=',

  // Used to limit the number of repos whose tweets we'll search
  githubRepoResultLimit: 10,

  // Twitter search API with extended tweets mode and english tweets only
  twiterSearchApi: '1.1/search/tweets.json?tweet_mode=extended&lang=en&q=',
};

/**
 * @async
 * @summary Used to fetch Github repositories for the specified project
 * @param { string } project The name of project
 * @return { object []} Array of repository objects
 */
async function getRepositories(project) {
  // Search github for repositories with the specified project name
  const repoData = await GithubClient.get(`${consts.gitHubSearchApi}${project}`);

  // Get the top 10 repos only due to twitter rate limits
  return repoData && repoData.items && repoData.items.slice(0, consts.githubRepoResultLimit)
      .map((item) => {
        return {
          name: item.name,
          owner: item.owner.login,
          description: item.description,
          homepage: item.homepage,
        };
      });
}

/**
 * @summary Output project summary along with what was said about it on twitter and who said it
 * @param {object} project Project object
 * @param {object[]} statuses Array of Twitter status objects
 */
function outputSummary(project, statuses) {
  // Create a tweets array with tweets and users who tweeted them
  const tweets = statuses.map((s) => {
    return {
      tweet: s.full_text,
      user: `@${s.user.screen_name}`,
    };
  });

  const output = {
    project: project,
    tweets: tweets,
  };
  // Output project summary
  console.log(output);
  // Output 2 line breaks
  console.log('\n\n');
}


/**
 * @async
 * @summary Performs the search for a project (Reactive by default) on Github
 * and search Twitter for tweets about the project
 * @param {string} project The project whose tweets we're looking for
 * @param {object} config  The configuration object containing Twitter credentials
 * @example search('Reactive', twitterCredentials)
 */
async function search(project, config) {
  // Load repositories from github for the supplied project
  const repositories = await getRepositories(project);

  // If no repository was found, inform the user and return
  if (!repositories || repositories.length === 0) {
    console.log(`No github repository with the name ${project} was found`);
    return;
  }

  // Otherwise continue to search for the tweets repos
  // initialize the credentials manager
  const credentialsManager = new CredentialsManager(config);

  // initialize twitter client with the credentials
  const twitterClient = new TwitterClient(credentialsManager.consumerKey, credentialsManager.consumerSecret);

  // Loop through repositories and process them one by one
  // Using for instead of forEach to be able to use await
  for (const project of repositories) {
    // Encode the api
    const api = encodeURI(`${consts.twiterSearchApi}${project.name}`);

    // Get the tweets from twitte client
    const tweetData = await twitterClient.get(api);

    // Output project summary and tweets
    // Wasn't sure if I should create one array of all projects and their tweets and print it once
    // or keep printing individul projects as soon as tweets are retreived. I opted for the latter apporoach
    // becuase it's more interactive
    outputSummary(project, tweetData.statuses);
  }
}

module.exports = search;
