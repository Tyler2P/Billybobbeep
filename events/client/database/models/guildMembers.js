const mongoose = require('mongoose');

const guildMemberSchema = new mongoose.Schema({
    memberId: String,
    guildId: String
}, { strict: false });

module.exports = mongoose.model('guildMembers', guildMemberSchema);