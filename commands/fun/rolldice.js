module.exports = {
    name: 'rolldice',
    description: 'Roll a rice and recieve a number',
    alias: ['roll', 'dice'],
    catagory: 'generator',
    execute (message, prefix, client) {
        const rollDice = () => Math.floor(Math.random() * 6) + 1;
        message.reply("rolled a " + rollDice());
    }
}