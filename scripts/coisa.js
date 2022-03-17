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
}
