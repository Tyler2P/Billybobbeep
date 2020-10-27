const { DiscordAPIError } = require('discord.js');
const db = require('../databaseManager/index.js');
const Discord = require('discord.js');
const embed = new Discord.MessageEmbed()
module.exports = (client) => {
    client.on('guildBanAdd', guild => {
        guild.fetchAuditLogs()
        .then(logs => {
            let ban = logs.entries
            .filter(e => e.action === 'MEMBER_BAN_ADD')
            .sort((a, b) => b.createdAt - a.createdAt)
            .first();
            
            if (ban.executor.id === client.user.id) return;
            let LoggingChannel = client.channels.cache.get(db.get(guild.id + '.loggingChannel'));
            if (LoggingChannel) {
                embed.setTitle('User Banned');
                embed.setDescription(
                `**User Tag:** ${ban.target.tag}\n` +
                `**User ID:** ${ban.target.id}\n\n` +
                `**Reason:** ${ban.reason || 'No reason was provided.'}\n\n` +
                `**Moderator:** ${ban.executor}\n` +
                `**Moderator Tag:** ${ban.executor.tag}\n` +
                `**Moderator ID:** ${ban.executor.id}\n`
                )
                embed.setTimestamp(ban.createdTimestamp);
                embed.setColor(`${db.get(guild.id + '.embedColor') || '#447ba1'}`);
                try {
                    LoggingChannel.send(embed)
                } catch {
                    return;
                }
            }
        });
    });
    client.on('guildBanRemove', guild => {
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

            let LoggingChannel = client.channels.cache.get(db.get(guild.id + '.loggingChannel'));
            if (LoggingChannel) {
                embed.setTitle('User Unbanned');
                embed.setDescription(
                `**User Tag:** ${ban.target.tag}\n` +
                `**User ID:** ${ban.target.id}\n\n` +
                `**Banned For:** ${pb.reason || 'No reason was provided.'}\n\n` +
                `**Moderator:** ${ban.executor}\n` +
                `**Moderator Tag:** ${ban.executor.tag}\n` +
                `**Moderator ID:** ${ban.executor.id}\n`
                )
                embed.setTimestamp(ban.createdTimestamp);
                embed.setColor(`${db.get(guild.id + '.embedColor') || '#447ba1'}`);
                try {
                    LoggingChannel.send(embed)
                } catch {
                    return;
                }
            }
        });
    });
}