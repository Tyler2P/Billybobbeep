module.exports = (client) => {
    const db = require('../../structure/global.js').db;
    setInterval(() => {
        mute(db, client)
    }, 300000);
    setInterval(() => {
        application(db, client)
    }, 180000);
    //setInterval(() => {
        database(db, client)
    //}, 300000);
}

function database(db, client) {
    db.fetchAll().forEach(data => {
        if (data.ID.includes('_')) return;
        if (isNaN(data.ID)) return;
        let amt = db.get(data.ID + '.economy.balance');
        let newAmt;
        if (amt && amt.toString().includes('')) {
            amt = amt.toString().split('');
            if (amt[1].length > 2) newAmt = [amt[0]];
            else return;
            newAmt.push(amt[1][0] + amt[1][1]);
            db.set(data.ID + '.economy.balance', Number(newAmt[0]));
        }

        amt = db.get(data.ID + '.bank.balance');
        newAmt = [];
        if (amt && amt.toString().includes('')) {
            amt = amt.toString().split('');
            if (amt[1].length > 2) newAmt = [amt[0]];
            else return;
            newAmt.push(amt[1][0] + amt[1][1]);
            db.set(data.ID + '.bank.balance', Number(newAmt[0]));
        }
    });
}

function application(db, client) {
    const { MessageEmbed } = require('discord.js');
    let appliedUsers = db.get('awaiting');
    let table = [];
    if (!appliedUsers) return;
    appliedUsers.forEach(result => {
        table.push(result);
        result = result.replace('_', ' ').replace('_', ' ').replace('_', ' ').replace('_', ' ');
        result = result.split(/ +/g);
        let user = client.users.cache.get(result[0]);
        let date = result[1];
        let job = result[2];
        let emj = client.emojis.cache.get(require('../../structure/config.json').emoji)
        
        const embed = new MessageEmbed();
        embed.setColor(`${db.get(require('../../structure/config.json').ServerId + '.embedColor') || '#447ba1'}`);
        embed.setAuthor(user.username, user.displayAvatarURL());
        let failed = false;
        let tick = client.emojis.cache.get(require('../../structure/config.json').TickEmoji1);
        let cross = client.emojis.cache.get(require('../../structure/config.json').CrossEmoji);
        let results = [tick, cross, tick];
        let result1 = Math.floor(Math.random() * result.length);
        let result2 = Math.floor(Math.random() * result.length);
        let result3 = Math.floor(Math.random() * result.length);
        embed.setDescription(`Your application results are the following:\n\n**Qualifications:**\n${results[result1]} Grammar\n${results[result2]} Communications\n${results[result3]} Loyalty\n${results[result2]} Trustworthiness\n\n`);
        if (result1 === 1 && result2 === 1) failed = true;
        if (result2 === 1 && result3 === 1) failed = true;
        if (result1 === 1 && result3 === 1) failed = true;

        if (failed === true) {
            embed.addField(`Overall Score:`, `Failed`);
            embed.setFooter('Feel free to apply again in 2 minutes');
            db.delete(user.id + '.jobs.awaiting');
            db.set(user.id + '.jobs.lastApplied', Date.now());
        } else {
            embed.addField(`Overall Score:`, `Passed`);
            embed.setFooter('Feel free to start working when you\'re ready');
            db.delete(user.id + '.jobs.awaiting');
            db.set(user.id + '.jobs.lastApplied', Date.now());
            db.set(user.id + `.jobs.job`, job.toLowerCase());
        }
        try {
            user.send(embed);
        } catch {
            return table.splice(table.indexOf(result.join('_')));
        }
        table.splice(table.indexOf(result.join('_')));
    });
    db.set('awaiting', table);
}

function mute(db, client) {
    let MM = db.get('mutedMembers');
    let guild;
    let user;
    let time;

    if (!MM) return;
    if (MM.length < 1) return;

    MM.forEach(result => {
        result = result.replace('_', ' ').replace('_', ' ');
        result = result.split(/ +/g);
        guild = result[0];
        user =  result[1];
        time = result[2];
        
        guild = client.guilds.cache.get(guild);
        let member = guild.members.cache.get(user);
        if (!member) return remove(MM, db, guild, user, time, client);
        if (member.roles.cache.find(role => role.id === db.get(guild.id + '.mutedRole'))) {
            if (Date.now() > time) {
                remove(MM, db, guild, user, time, client, 'mute');
            }
        } else {
            remove(MM, db, guild, user, time, client, 'mute');
        }
    });
}

function remove(table, db, guild, user, time, client, string) {
    let member = guild.members.cache.get(user);
    table.splice(table.indexOf(guild.id.toString() + '_' + user.toString() + '_' + time.toString()), 1);
    db.set('mutedMembers', table);
    if (string === 'mute') {
        setTimeout(() => {
            let mutedRole = db.get(guild.id +'.mutedRole');
            let role = guild.roles.cache.find(role => role.id === mutedRole);
            if (member.roles.cache.find(role => role.id === mutedRole)) {
                member.roles.remove(role.id);
            }
        }, 50);
    }
}