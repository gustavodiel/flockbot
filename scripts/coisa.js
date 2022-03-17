module.exports = (robot) => {
  robot.respond(/hello$/i, (msg) => {
    const room = msg.envelope.room;
    const user = msg.envelope.user.real_name;
    return msg.send(`Hello ${user}`);
  });

  robot.respond(/hello (.*)$/i, (msg) => {
    const name = msg.match[1];
    return msg.send(`Olar ${name}`);
  });

  robot.respond(/shy (.*)$/i, (msg) => {
    return msg.reply(msg.match[1]);
  });

  robot.respond(/parrot$/i, (msg) => {
    return msg.send('https://camo.githubusercontent.com/2a4c7551af34cec274789e04ab402329afd0aea5a732449088ba11d01d4a624b/68747470733a2f2f692e696d6775722e636f6d2f5a666d326943312e706e67')
  });

  robot.respond(/trustedhelp$/i, (msg) => {
    msg.send("flockbot hello [message] - Hello!\n" +
      "flockbot shy - A private message for the shy people\n" +
      "flockbot parrot - You know it\n" +
      "flockbot trustedhelp - You are here\n" +
      "flockbot ship (branch) to (env) - Ships a branch to some environment\n" +
      "flockbot queue empty (env) - Empty the env queue\n" +
      "flockbot queue (env) - Lists the members and branches of the env queue\n" +
      "\n" +
      "Known envs: prod")
  });
}
