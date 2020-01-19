const { MessageEmbed } = require('discord.js')
const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags'),
        essentials = require("../../music_exports").modules,
        config = require('../../data/config.json')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'np',
            group: 'music',
            memberName: 'np',
            description: 'Posts currently playing song info.',
            guildOnly: true,
            examples: ['$np']
        });
    }
    async run(msg) {
        const serverQueue = essentials.queue.get(msg.guild.id)
        if (!serverQueue) {
          return msg.channel.send(":x: **Nothing playing in this server**")
        }
        if(serverQueue.connection == null) {
          return msg.channel.send(":x: **Track is still loading , try again.**")
        }
        const actualTime = serverQueue.connection.dispatcher.streamTime / 1000
        const progress = (actualTime / serverQueue.songs[0].duration) * 100;
        const progressIndex = Math.floor(progress / 3);
        const bar = ["▬", "▬", "▬", "▬", "▬","▬", "▬", "▬", "▬", "▬","▬", "▬", "▬", "▬", "▬","▬", "▬", "▬", "▬", "▬","▬", "▬", "▬", "▬", "▬","▬", "▬", "▬", "▬", "▬",]
        const progressLevel = bar[progressIndex] = "🔘"
        let embed = new MessageEmbed()
            .setColor(config.defaultColor)
            .setDescription(stripIndents`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) 
            
            \`${bar.join("")}\`         

            \`${this.client.timeCalc(actualTime)} / ${this.client.timeCalc(serverQueue.songs[0].duration)}\`
 
            \`Requested by ${serverQueue.songs[0].requester}\`
            
            `)
            .setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/0.jpg`)
            .setAuthor("Now Playing ♪", this.client.user.displayAvatarURL().replace('.webp', '.png'))
        return msg.embed(embed)
    }
}