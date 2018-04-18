const rp = require('request-promise');
const cheerio = require('cheerio');

class Correios {
  track(id) {
    return new Promise((resolve, reject) => {
      this.request(id).then(body => {
        resolve(this.parse(body));
      }, reject).catch(reject);
    });
  }

  request(id) {
    console.log('id', id);
    return rp({
      method: 'POST',
      uri: 'http://www2.correios.com.br/sistemas/rastreamento/newprint.cfm',
      formData: { objetos: id },
    });
  }

  parse(body) {
    // console.log('body', body);
    const $ = cheerio.load(body);
    const trackingEls = $('.listEvent').find('tr');
    const rows = [];
    trackingEls.map((key, el) => {
      const el$ = $(el);
      const cols = el$.find('td');
      const data = []
      cols.map((key, colEl) => {
        const text = $(colEl).text().replace(/\n|\r|\t/g, '').trim();
        data.push(text);
      });
      const details = data[0].split(/\s\s+/g);
      rows.push({
        status: data[1]
          .split('��', ).join('çã')
          .split('hor�rio').join('horário')
          .split('pr�ximo').join('próximo')
          .split('�til').join('útil')
          .split('ap�s').join('após')
          .split('Ag�ncia').join('Agência')
          .split('destinat�rio').join('destinatário')
          .split('og�stica').join('ogística')
          .split('Pa�s').join('País')
          .split('�teis').join('úteis')
          .replace(/\s+/g, ' '),
        date: details[0],
        time: details[1],
        location: details[2],
      });
    });
    return rows;
  }
}

module.exports = new Correios();
