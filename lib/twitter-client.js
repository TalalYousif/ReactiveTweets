const axios = require('axios');
const crypto = require('crypto');
const oAuth = require('oauth-1.0a');

const errorMessages = {
  invalidCredentials: `Invalid Twitter credentials -- please make sure to add your consumer key and consumer secret to app.config file,`,
  twitterLimitReached: 'Twitter rate limit reached -- try again later',
};

/**
 * @class TwitterClient
 * @summary Used to interact with twitter api
 *
 * Made generic so that it can be used to search for tweets, users or any twitter api using http GET
 */
class TwitterClient {
  /**
     * Creates an instance of TwitterClient.
     * @param {string} consumerKey Consumer API Key
     * @param {string} consumerSecret Consumer API Secret Key
     */
  constructor(consumerKey, consumerSecret) {
    // Twitter API base url
    this.baseUrl = 'https://api.twitter.com/';

    // set up twitter authorization using oauth-1.0a package
    const oauth = oAuth({
      consumer: {
        key: consumerKey,
        secret: consumerSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString, key) {
        return crypto
            .createHmac('sha1', key)
            .update(baseString)
            .digest('base64');
      },
    });

    // use an interceptor to add authorize and content type headers
    axios.interceptors.request.use((config) => {
      config.headers = oauth.toHeader(oauth.authorize({
        url: `${config.baseURL}${config.url}`,
        method: config.method,
        data: config.data,
      }));

      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      return config;
    });
    axios.defaults.baseURL = this.baseUrl;
  }

  /**
   * @async
   * @summary Calls a twitter get api
   * @param  {string} api The api to call
   * @return {any} The response data
   * @example twitterClient.get(`1.1/search/tweets.json?q=RxJs`)
   */
  async get(api) {
    try {
      // call axios.get with the api
      const response = await axios.get(api);
      return response.data;
    } catch (error) {
      handleTwitterError(error);
    }
  }
}

/**
 * @summary Custom handler for twitter error returns
 * @param  {Error} error The error return by twitter api
 * @throws A new error with a custom message
 * @example handleTwitterError(error)
 */
function handleTwitterError(error) {
  // If the error code is 401 then is this an Unauthorized error, we will let the user know
  if (error.message.includes('401')) {
    throw new Error(errorMessages.invalidCredentials);
  } else if (error.message.includes('429')) {
    // If the error code is 429 then this is a rate limmit.
    throw new Error(errorMessages.twitterLimitReached);
  } else {
    // For any other error just show the error message to the user prefixed with "Twitter"
    throw new Error(`Twitter: ${error.message}`);
  }
}

module.exports = TwitterClient;
