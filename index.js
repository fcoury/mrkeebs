const dotenv = require('dotenv');
const Discord = require('discord.js');
const moment = require('moment');

const Command = require('./command');

const client = new Discord.Client();

dotenv.config();

client.on('ready', () => {
  console.log(`MrKeebs: ${client.users.size} users, ${client.channels.size} channels, ${client.guilds.size} guilds.`);
  client.user.setActivity(`CIRCLEJERK on ${client.guilds.size} servers`);
  Command.initialize();
});

client.on('message', message => {
  const CommandClass = Command.for(message);

  if (CommandClass) {
    const command = new CommandClass(message);
    command.run();
  }
});

console.log('Starting MrKeebs server');
client.login(process.env.BOT_TOKEN);
