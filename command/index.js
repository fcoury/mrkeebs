const fs = require('fs');
const path = require('path');

const commandMap = {};
const prefix = 'k!';

class Command {
  constructor(message) {
    const { content, channel } = message;
    const parts = (content && content.split(' ')) || [];

    // message parts
    this.message = message;
    this.content = content;
    this.channel = channel;

    // command data
    this.command = content && parts[0];
    this.params = parts.slice(1);

    console.log('Message', content, '->', this.command, this.params);
  }

  reply(message) {
    this.channel.send(message);
  }
}

Command.for = (message) => {
  const { content } = message;
  const parts = (content && content.split(' ')) || [];
  return commandMap[parts[0]];
};

Command.initialize = () => {
  const basename = path.basename(__filename);
  fs.readdirSync(__dirname).filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const CommandClass = require(`./${file}`);
    commandMap[`${prefix}${CommandClass.keyword}`] = CommandClass;
  });
};

module.exports = Command;
