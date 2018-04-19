const dotenv = require('dotenv');
const Discord = require('discord.js');
const moment = require('moment');

const correios = require('./correios');

const client = new Discord.Client();
const { calculateBusinessDays } = require('./utils');

dotenv.config();

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
  } else if (content && content.startsWith('k!40d')) {
    const parts = content.split(' ');
    if (parts.length < 2) {
      return message.channel.send('Use k!40d <codigo-rastreio>');
    }
    correios.track(parts[1]).then(events => {
      const event = events.find(e => e.status && e.status.indexOf('40d') > -1);
      if (!event) {
        return message.channel.send('Me parece que este rastreio não caiu nos 40 dias úteis');
      }
      const date = moment(`${event.date} ${event.time}`, 'DD/MM/YYYY kk:mm');
      const businessDays = calculateBusinessDays(date, new Date());
      message.channel.send(`Esse rastreio entrou nos 40 dias úteis dia ${event.date}. Ele está parado há ${businessDays} dias úteis.`);
    });
  }
});

console.log(' *** Starting server with token', process.env.BOT_TOKEN);
client.login(process.env.BOT_TOKEN);
