const axios = require('axios');

// Github api base url
const baseUrl = 'https://api.github.com/';

/**
 * @class GithubClient
 * @summary Used to interact with any public github api
 */
class GithubClient {
  /**
   * @async
   * @summary Calls a github HTTP GET api
   * @param  { string } api The api to call
   * @return  {any } The response data
   * @example githubClient.get(`search/repositories?sort=stars&q=reactive`)
   * @throws Will throw an error with a custom message when an exception is thrown from axios.get
   */
  static async get(api) {
    try {
      // Encode the url
      const url = encodeURI(`${baseUrl}${api}`);
      // Call axios' get and await the responce
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      // If we encounter an error for some reason then inform the user and throw an error
      throw new Error(`Error retrieving repository data from github: ${error.message}`);
    }
  }
}

module.exports = GithubClient;
