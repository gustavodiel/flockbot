import { Octokit } from "@octokit/rest";
import { Heroku } from 'heroku-client';


module.exports = (msg, options, config) => {
  if (!process.env.HUBOT_HEROKU_KEY) {
    return msg.reply("To deploy to Heroku you need a HEROKU_KEY")
  }

  const heroku = new Heroku({ token: process.env.HUBOT_HEROKU_KEY })

  config.appname = 'stg-flockbot';
  github.repos.getArchiveLink
}
