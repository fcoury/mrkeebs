const dotenv = require('dotenv');
const Discord = require('discord.js');
const client = new Discord.Client();

const correios = require('./correios');

dotenv.config();

let mode = 'closed';

client.on('ready', () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`CIRCLEJERK on ${client.guilds.size} servers`);

  // client.guilds.forEach(guild => {
  //   console.log('channels', guild.channels)
  // });
});

client.on('message', message => {
  const { content } = message;
  if (content && content.startsWith('k!track')) {
    const parts = content.split(' ');
    if (parts.length < 2) {
      return message.channel.send('Use k!track <codigo-rastreio>');
    }
    correios.track(parts[1]).then(res => {
      if (!res.length) {
        return message.channel.send(`Código de rastreio ${parts[1]} não encontrado.`);
      }
      const last = res[0];
      return message.channel.send(`Status de **${parts[1]}**\n\n${last.date} ${last.time} - ${last.location}\n**${last.status}**`);
    });
    mode = 'open';
  }
});

client.login(process.env.BOT_TOKEN);
