const moment = require('moment');

const Command = require('./');
const correios = require('../correios');
const { calculateBusinessDays } = require('../utils');

class Track extends Command {
  keyword() { return 'track'; }

  validate() {
    return this.needsParams(1, 'Use k!track <codigo-rastreio>');
  }

  run() {
    const code = this.params[0];

    if (!code) {
      return this.reply('Use k!track <codigo-rastreio>');
    }

    correios.track(code).then(res => {
      if (!res.length) {
        return this.reply(`Código de rastreio ${code} não encontrado.`);
      }
      const last = res[0];
      return this.reply(`Status de **${code}**\n\n${last.date} ${last.time} - ${last.location}\n**${last.status}**`);
    });
  }
}

Track.keyword = 'track';

module.exports = Track;
