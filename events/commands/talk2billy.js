const db = require('../../structure/global.js').db;;
const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
  guildOnly: true,
  async execute (message) {
    if (!db.get(message.guild.id + '.talk2billy')) return;
    let args = message.content.split(/ +/g);
    if (!message.guild) return;
    if (message.author.bot) return;
    let talk2billy = db.get(message.guild.id + '.talk2billy');
    if (message.content.startsWith(db.get(message.guild.id + '.prefix'))) return;
    if (talk2billy) {
      if (message.channel.id !== talk2billy) return;
      let msg = message.content.toLowerCase();
      if (message.attachments.size < 1) {
        const response = await fetch('http://billybobbeep.tyler2p.repl.co/api/QCZCCgUy9UfxdHowD35ueM/chatbot?message=' + args.join('%20').replace(' ', '%20') + '&punc=yes&cap=yes');
        const text = await response.text();
        message.channel.send(text.split('"').join(''));
      } else {
        var table = ['Whale', 'Racoon', 'Kangaroo', 'Koala', 'Birb', 'Fox', 'Panda', 'Cat', 'Dog']
        var res = Math.floor(Math.random() * table.length)
        const response = await fetch('https://some-random-api.ml/img/' + table[res].replace(' ', '%20'));
        var text = await response.text();
        text = message.channel.send(text.replace('link', '').replace(':', '').replace('{', '').replace('}', '').replace('??', '?').replace('???', '?').replace('""', '').replace('"', '').replace('"', '').replace('error', ''));
        if (text.toLocaleString().startsWith('https://')) {
          const attachment = new Discord.MessageAttachment(text);
          message.channel.send(attachment);
        } else {
          message.channel.send(text.toLocaleString());
        }
      }
    }
  }
}