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
}
