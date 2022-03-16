
module.exports = (robot) => {
  robot.respond(/hello$/i, (msg) => {
    return msg.send('Olaaaar');
  });

  robot.respond(/hello (.*)$/i, (msg) => {
    const name = msg.match[1];
    return msg.send(`Olar ${name}`);
  });

  robot.respond(/shy (.*)$/i, (msg) => {
    return msg.reply(msg.match[1]);
  });

  robot.respond(/ship(!)? ([^\s]+) to ([^\s\/]+)$/i, (msg) => {
    const priority = msg.match[1] === '!';
    const branch = msg.match[2];
    const env = msg.match[3];
    return msg.send(`I am going to ship ${branch} to ${env} - ${priority ? 'With high priority' : 'With regular priority'}`);
  });
}
