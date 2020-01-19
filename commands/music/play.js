const { MessageEmbed } = require('discord.js')
const { Command } = require('discord.js-commando'),
        essentials = require("../../music_exports").modules,
        config = require('../../data/config.json')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['p'],
            group: 'music',
            memberName: 'play',
            description: 'Plays music in voice channels.',
            guildOnly: true,
            examples: ['$play https://www.youtube.com/watch?v=2gzt6GeNLBk&index=15&list=RDhQlPzrX8u0A'],
            args: [{
                key: 'url',
                prompt: 'Please enter a link or song\'s name.',
                type: 'string',
            }]
        });
    }
    async run(msg, {url}) {
		const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) { 
      return msg.channel.send(":x: **You have to be in a voice channel to use this command.**")
    }
    msg.channel.send(`<:youtube:664219839082004512> **Searching** :mag_right: \`${url}\``)
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await essentials.youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await essentials.youtube.getVideoByID(video.id).catch(err => {
          if(err == "Error: resource youtube#videoListResponse not found") return;
        })
        if(video2 == null) continue
				await essentials.handleVideo(video2, msg, voiceChannel, true); 
			}
			return msg.channel.send(`Added playlist to queue :notes: \`${playlist.title}\``)
		} else {
			try {
				var video = await essentials.youtube.getVideo(url);
			} catch (error) {
				try {
					const videos = await essentials.youtube.searchVideos(url, 1);
					var video = await essentials.youtube.getVideoByID(videos[0].id);
				} catch (err) {
					console.error(err);
				}
			}
			return essentials.handleVideo(video, msg, voiceChannel).catch(err => msg.channel.send(":x: **No matches**"));
    }
  }
}