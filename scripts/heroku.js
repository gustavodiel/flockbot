// import { Octokit } from "@octokit/rest";
// import { Heroku } from 'heroku-client';
// import { createTokenAuth } from "@octokit/auth-token";

const Heroku = require('heroku-client')
const { Octokit } = require('@octokit/rest')
const { createTokenAuth } = require('@octokit/auth-token')

module.exports = async (msg, branch) => {
  if (!process.env.HUBOT_HEROKU_KEY) {
    return msg.reply("To deploy to Heroku you need a HEROKU_KEY")
  }

  const octokit = new Octokit({
    auth: process.env.HUBOT_GITHUB_KEY,
  });

  // const { data } = await octokit.request("/user");

  const owner = 'gustavodiel'
  const repo = 'pasta_do_projeto'
  const ref = `heads/${branch}`

  const { url } = await octokit.rest.repos.downloadTarballArchive({ owner, repo, ref })
  const appname = 'stg-flockbot';

  const heroku = new Heroku({ token: process.env.HUBOT_HEROKU_KEY })

  const apps = await heroku.get('/apps')
  const app = apps.find(app => app.name == appname)
  const app_url = app.web_url

  // if (!!app) {
  //   msg.reply("gh auth ", JSON.stringify(app))
  // }

  // build app
  try {
    await heroku.post(`/apps/${app.name}/builds`, {
      body: {
        source_blob: { url: url }
      }
    })

    msg.reply('Successfully builded')
  }catch(err) {
    msg.reply("err:    ", JSON.stringify(err))
  }
}
