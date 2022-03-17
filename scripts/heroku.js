// import { Octokit } from "@octokit/rest";
// import { Heroku } from 'heroku-client';
// import { createTokenAuth } from "@octokit/auth-token";

const Heroku = require('heroku-client')
const { Octokit } = require('@octokit/rest')
const { createTokenAuth } = require('@octokit/auth-token')
const https = require('https');


module.exports = async (msg, branch, callback) => {
  if (!process.env.HUBOT_HEROKU_KEY) {
    return msg.reply("To deploy to Heroku you need a HEROKU_KEY")
  }

  const octokit = new Octokit({
    auth: process.env.HUBOT_GITHUB_KEY,
  });

  const owner = 'gustavodiel'
  const repo = 'tiny_app'
  const ref = `heads/${branch}`
  let tarball_url;
  try {
    const { url } = await octokit.rest.repos.downloadTarballArchive({owner, repo, ref})
    tarball_url = url;
  } catch {
    msg.send(`Failed to fetch info from branch ${branch}`)
    return callback(undefined, undefined, undefined)
  }
  const appname = 'stg-flockbot';

  const heroku = new Heroku({ token: process.env.HUBOT_HEROKU_KEY })

  const apps = await heroku.get('/apps')
  const app = apps.find(app => app.name === appname)

  if (!app) {
    msg.reply(`App ${appname} not found`)
    return callback(undefined, undefined, undefined)
  }

  // build app
  try {
    const build = await heroku.post(`/apps/${app.name}/builds`, {
      body: {
        source_blob: { url: tarball_url }
      }
    });

    msg.reply(`Waiting for build ${build.id} - ${build.output_stream_url}`)

    try {
      let body = '';
      https.get(build.output_stream_url, res => {
        res.on('data', chunk => {
          body += chunk;
        });

        res.on('end', () => {
          callback(app, build, body)
        });
      });

    } catch(err) {
      msg.reply("http err:    ", JSON.stringify(err))
      return callback(undefined, undefined, undefined)
    }
  } catch(err) {
    msg.reply("err:    ", JSON.stringify(err))
    return callback(undefined, undefined, undefined)
  }
}
