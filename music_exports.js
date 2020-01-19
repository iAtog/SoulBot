const YouTube = require('simple-youtube-api'),
      config = require('./data/config.json')
      youtube = new YouTube(config.youtubeapi),
      ytdl = require('ytdl-core'),
    { Util, MessageEmbed } = require("discord.js")
var   queue = new Map()

exports.modules = {
      youtube : youtube,
      ytdl : ytdl,
      queue : queue,
      handleVideo : handleVideo,
      play : play
}

async function handleVideo(video, msg, voiceChannel, playlist = false) {
        if(!voiceChannel) return undefined;
        if(video.durationSeconds > 10800) return msg.channel.send(":x: **Cannot play a song that's longer than 3 hours**")
        const serverQueue = queue.get(msg.guild.id);
        function number() {
          if(!serverQueue) { return 1 } else { return serverQueue.songs.length + 1 }
        }
        const song = {
            number: serverQueue ? serverQueue.songs.length : 0,
            id: video.id,
            title: Util.escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.id}`,
            requester: msg.author.username,
            duration: video.durationSeconds
        };
  
    
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 100,
                playing: true,
                loop: false
            };
            queue.set(msg.guild.id, queueConstruct); 
            queueConstruct.songs.push(song);
      
            try {
                msg.channel.send(`**Playing** :notes: \`${song.title}\``)
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(msg.guild, queueConstruct.songs[0], msg);
            } catch (error) {
                console.error(`I could not join the voice channel: ${error}`);
                queue.delete(msg.guild.id);
                return msg.reply(`I could not join the voice channel`);
            }
        } else {
            serverQueue.songs.push(song);
            if (playlist) return undefined;
            else return msg.channel.send(`Added to the queue :notes: \`${song.title}\``)
        }
        return undefined;
    } 
    
    
    
    async function play(guild, song, msg) {
        const serverQueue = queue.get(guild.id);
        if (!serverQueue) return undefined
        if (!song) {
          serverQueue.voiceChannel.leave()
          queue.delete(msg.guild.id)
        } else {
        const dispatcher = serverQueue.connection.play(ytdl(song.url))
            .on('end', async () => {
              if (serverQueue.loop) {
                let lastSong = serverQueue.songs.shift();
                serverQueue.songs.push(lastSong);
                play(guild, serverQueue.songs[0], msg);
              } else {
                serverQueue.songs.forEach(song => {
                  song.number = song.number - 1
                })
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0], msg)
              }})
            .on('error', error => {
              msg.channel.send(":x: I have encountered an error trying to play the requested song, make sure the video isn't copyright striked and it isn't private.")
              dispatcher.end()
              console.error(error)
            });
            dispatcher.setVolume(serverQueue.volume / 100);
        }
    }