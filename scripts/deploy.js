const deploy = require('./heroku')
const { createClient } = require('redis');

let client;

(async () => {
  client = createClient();

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
})();

const run = (msg, branch, env) => {
  msg.send(`I am going to ship ${branch} to ${env}`);

  deploy(msg, branch, async (body) => {
    if (body.includes('Push rejected') || body.includes('ERR! build error')) {
      robot.emit = { "color": "#ff0000", "fallback": "fallback", text: "Err Text", title: "Err Title", title_link: "err_link" }

      msg.reply('Build failed! Try again looser')
    } else {
      robot.emit = { "color": "#7CD197", "fallback": "fallback", text: "Text", title: "Title", title_link: "" }

      msg.reply('Successfully builded')
    }
    const removed = await client.lPop(`queue_${env}`)
    msg.send(`${removed} is done! Going to the next one!`)
    const queue_data = await client.lIndex(`queue_${env}`, 0)
    run(msg, queue_data.branch, queue_data.env)
  })
}

module.exports = (robot) => {
  robot.respond(/ship(!)? ([^\s]+) to ([^\s\/]+)$/i, async (msg) => {
    const priority = msg.match[1] === '!';
    const branch = msg.match[2];
    const env = msg.match[3];
    const queue_name = `queue_${env}`;

    let len = await client.lLen(queue_name)
    let elements = await client.lRange(queue_name, 0, len)

    const repeated = elements.find(unparsed => { return unparsed === JSON.stringify({ branch, env }) })
    if (!!repeated) {
      return msg.send(`Slow down dude, your branch ${branch} is already in the queue!`)
    }

    await client.rPush(queue_name, JSON.stringify({ branch, env }))
    const current_queue = JSON.parse(await client.lIndex(queue_name, 0))

    if (current_queue.branch === branch && current_queue.env === env) {
      run(msg, branch, env)
    } else {
      msg.send(`Hey dude, you were added to the queue for ${env} - current: ${current_queue.branch}, yours: ${branch}`)
    }
  });

  robot.respond(/queue empty ([^\s\/]+)$/i, async (msg) => {
    const env = msg.match[1] || 'prod';

    const queue_name = `queue_${env}`;

    await client.del(queue_name)

    msg.send(`Queue ${queue_name} cleared`)
  })

  robot.respond(/queue ([^\s\/]+)$/i, async (msg) => {
    const env = msg.match[1] || 'prod';

    const queue_name = `queue_${env}`;

    let len = await client.lLen(queue_name)
    let elements = await client.lRange(queue_name, 0, len)

    const message = elements.map(element => JSON.parse(element).branch).join(', ')

    msg.send(`Current queue ${queue_name}: ${message}`)
  })

}
