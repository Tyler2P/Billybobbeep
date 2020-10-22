const ytdl = require('ytdl-core');

module.exports = async (message, args, prefix, client) => {

 if (message.content.startsWith(`${prefix}play`)) {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
   return message.channel.send('You need to be in a voice channel to run this command.');
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT'))
   return message.channel.send(
    "I don't have permissions to connect to a voice channel."
   );
  if (!permissions.has('SPEAK'))
   return message.channel.send(
    "I don't have permissions to speak in a voice channel"
   );
   if (!args[1]) return message.channel.send('Please provide a youtube link to play.');
   if (!args[1].toLowerCase().startsWith('https://www.youtube.com/') || !args[1].toLowerCase().startsWith('www.youtube.com/') || !args[1].toLowerCase().startsWith('youtube.com/')) return message.channel.send('Please provide a valid youtube link.')

  try {
    var connection = await voiceChannel.join();
    message.channel.send('Now Playing: ' + args[1]);
    connection.voice.setSelfDeaf(true);
  } catch (error) {
    console.log(error)
    return message.channel.send(`There was an error connecting to the voice channel ${error}`);
  }

  const dispatcher = connection
   .play(ytdl(args[1]))
   .on('finish', () => {
    voiceChannel.leave();
   }).on('error', (error) => {
    message.channel.send('There was an error: ' + error.toString().replace('error:', ''));
   });
  dispatcher.setVolumeLogarithmic(5 / 5);
 } else if (message.content.startsWith(`${prefix}stop`)) {
  if (!message.member.voice.channel) return message.channel.send('You need to be in a voice channel to stop the song.');
  message.member.voice.channel.leave();
 } else if (message.content.startsWith(`${prefix}tts`)) {
     function connect(voiceChannel, text) {
        const say = require('say');
        const fs = require('fs');
        if (!fs.existsSync('./temp')) {
            fs.mkdirSync('./temp');
        }
        function makeid(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }         
        const timestamp = new Date().getTime();
        var string = `${makeid(5)}_${timestamp}`
        const soundPath = `./temp/${string}.wav`;
        say.export(text, null, 1, soundPath, (err) => {
            if (err) {
                console.error(err);
                return;
            } else {
                voiceChannel.join().then((connection) => {
                    connection.voice.setSelfDeaf(true);
                    connection.play(soundPath).on('end', () => {
                        connection.disconnect();
                        fs.unlinkSync(soundPath);
                    }).on('error', (err) => {
                        console.error(err);
                        connection.disconnect();
                        fs.unlinkSync(soundPath);
                    }).on('finish', () => {
                        voiceChannel.leave();
                    });
                }).catch((err) => {
                    console.error(err);
                });
            }
        });
    }
    if (message.attachments.size > 0) return message.channel.send('You cannot send an attachment as a tts message.');
    if (message.content.toLowerCase().includes('https://') || message.content.toLowerCase().includes('http://') || message.content.toLowerCase().includes('www.') || message.content.toLowerCase().includes('.com') || message.content.toLowerCase().includes('.co.uk')) return ('You cannot send a link as a tts message.');
    if (!args[1]) return message.channel.send('Please provide a message to send.')
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to run this command.');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return message.channel.send('I don\'t have permissions to connect to a voice channel.');
    if (!permissions.has('SPEAK')) return message.channel.send('I don\'t have permissions to speak in a voice channel');
    let member = message.guild.members.cache.get(client.user.id);
    if (member.voice.channel) return message.channel.send('You cannot send TTS messages whilst I am playing music in a voice channel.');
    connect(voiceChannel, args.slice(1).join(" "))
    }
}