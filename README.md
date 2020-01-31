
# reactive

A command line API mashup of GitHub and Twitter APIs to search for projects on GitHub, then for each project search for tweets that mention it and output a summary of each project with a short list of recent tweets, in JSON format

## Installation

    npm install -g @talalyyousif/reactive 

## Configuring Twitter consumer key and secret
This can be done by any of the following:

 - Set the environment variables: REACTIVE_TWITTER_CONSUMER_KEY and REACTIVE_TWITTER_CONSUMER_SECRET. 
- Edit app.config.js and add your own environment variables containing the key and secret.
- Edit app.config.js and add key and secret plainly.

## Usage

run `reactive search [project]` To search for the specified project or search for "Reactive" if the optional argument is not passed