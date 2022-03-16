module.exports = (robot) => {
  robot.respond(/ship(!)? ([^\s]+) to ([^\s\/]+)$/i, (msg) => {
    const priority = msg.match[1] === '!';
    const branch = msg.match[2];
    const env = msg.match[3];
    msg.send(`I am going to ship ${branch} to ${env} - ${priority ? 'With high priority' : 'With regular priority'}`);



  });
}
