const guildId = require('../client/database/models/guilds');
const Discord = require('discord.js');
const embed = new Discord.MessageEmbed();
const logging = require('../../utils/functions.js').logging;

module.exports.add = (guild, user, client) => {
    guild.fetchAuditLogs()
    .then(logs => {
        let ban = logs.entries
        .filter(e => e.action === 'MEMBER_BAN_ADD')
        .sort((a, b) => b.createdAt - a.createdAt)
        .first();
        
        if (ban.executor.id === client.user.id) return;
        embed.setTitle('User Banned');
        embed.setDescription(
            `**User Tag:** ${ban.target.tag}\n` +
            `**User ID:** ${ban.target.id}\n\n` +
            `**Reason:** ${ban.reason || 'No reason was provided'}\n\n` +
            `**Moderator:** ${ban.executor}\n` +
            `**Moderator Tag:** ${ban.executor.tag}\n` +
            `**Moderator ID:** ${ban.executor.id}`
        )
        embed.setTimestamp(ban.createdTimestamp);
        embed.setColor(guildData.findOne({ guildId: message.guild.id }).then(result => result.embedColor));

        let loggingChannel = client.channels.cache.get(guildData.findOne({ guildId: message.guild.id }).then(result => result.embedColor.loggingChannel));
        if (loggingChannel) {
            loggingChannel.send(msg).catch(() => {return});
        }
    });
}

module.exports.remove = (guild, user, client) => {
    setTimeout(() => {
        guild.fetchAuditLogs()
        .then(logs => {
            let ban = logs.entries
            .filter(e => e.action === 'MEMBER_BAN_REMOVE')
            .sort((a, b) => b.createdAt - a.createdAt)
            .first();
            let pb = logs.entries
            .filter(e => e.action === 'MEMBER_BAN_ADD')
            .filter(e => e.target.id === ban.target.id)
            .sort((a, b) => b.createdAt - a.createdAt)
            .first();

            embed.setTitle('User Unbanned');
            embed.setDescription(
            `**User Tag:** ${ban.target.tag}\n` +
            `**User ID:** ${ban.target.id}\n\n` +
            `**Banned For:** ${pb ? pb.reason.toString() : 'No reason was provided'}\n\n` +
            `**Moderator:** ${ban.executor}\n` +
            `**Moderator Tag:** ${ban.executor.tag}\n` +
            `**Moderator ID:** ${ban.executor.id}`
            )
            embed.setTimestamp(ban.createdTimestamp);
            embed.setColor(guildData.findOne({ guildId: message.guild.id }).then(result => result.embedColor));
            let loggingChannel = client.channels.cache.get(guildData.findOne({ guildId: message.guild.id }).then(result => result.loggingChannel));
            if (loggingChannel)
                loggingChannel.send(msg).catch(() => {return});
        });
    }, 100);
}