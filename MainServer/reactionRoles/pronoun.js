const Discord = require(`discord.js`);
const configFile = require('../../config.json');
const db = require('quick.db');

module.exports = async (message) => {
  const commandEmbed = new Discord.MessageEmbed()
    .setTitle("Pronoun Roles")
    .setDescription(
      `⚪ Him/he\n` +
      `🔴 She/her\n` +
      `⚫ Them/they`)
    .setColor(`${db.get(message.guild.id + '.embedColor') || '#447ba1'}`)
    .setFooter(`React below to claim a role!`)
  message.channel.send(commandEmbed)
  message.delete();
}