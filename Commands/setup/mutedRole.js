module.exports = (client, message, db) => {
	let prefix = db.get(message.guild.id + '.prefix') || '~';
	let args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);

	if (!args[2]) {
		db.delete(message.guild.id + '.mutedRole');
		return message.channel.send('Removed tmuted role.');
	}
	let role =
		message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
	db.set(message.guild.id + '.mutedRole', role.id);
	message.channel.send(`Your muted role is now set up as ${role}`);
};
