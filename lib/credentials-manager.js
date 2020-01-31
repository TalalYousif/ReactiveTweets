
/**
 * @class CredentialsManager
 * @summary Used to manage twitter api credentials
 */
class CredentialsManager {
  /**
     * Creates an instance of CredentialsManager.
     * @param {object} config the configuration object
     */
  constructor(config) {
    this.config = config;
  }

  /**
     * @return {string} The configured consumer API Key
     */
  get consumerKey() {
    if (!this.config.consumerKey) {
      throw new Error('Consumer Key not found, please make sure to add it to app.config.json');
    }
    // Return consumerKey from the configuration
    return this.config.consumerKey;
  }

  /**
     * @return {string} The configured consumer API Secret Key
     */
  get consumerSecret() {
    if (!this.config.consumerSecret) {
      throw new Error('Consumer Secret not found, please make sure to add it to app.config.json');
    }
    // Return consumerSecret from the configuration
    return this.config.consumerSecret;
  }
}

module.exports = CredentialsManager;
