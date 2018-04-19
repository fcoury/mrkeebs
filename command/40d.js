const moment = require('moment');

const Command = require('./');
const correios = require('../correios');
const { calculateBusinessDays } = require('../utils');

class Cmd40d extends Command {
  validate() {
    return this.needsParams(1, 'Use k!40d <codigo-rastreio>');
  }

  run() {
    correios.track(this.params[1]).then(events => {
      if (!res.length) {
        return this.reply(`Código de rastreio ${parts[1]} não encontrado.`);
      }
      const event = events.find(e => e.status && e.status.indexOf('40d') > -1);
      if (!event) {
        return this.reply('Me parece que este rastreio não caiu nos 40 dias úteis');
      }
      const date = moment(`${event.date} ${event.time}`, 'DD/MM/YYYY kk:mm');
      const businessDays = calculateBusinessDays(date, new Date());
      this.reply(`Esse rastreio entrou nos 40 dias úteis dia ${event.date}. Ele está parado há ${businessDays} dias úteis.`);
    });
  }
}

Cmd40d.keyword = '40d';

module.exports = Cmd40d;
