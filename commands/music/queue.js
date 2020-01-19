const { MessageEmbed } = require('discord.js')
const { Command, util } = require('discord.js-commando')
const { stripIndents } = require('common-tags'),
        essentials = require("../../music_exports").modules,
        config = require('../../data/config.json')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            group: 'music',
            aliases: ['q'],
            memberName: 'queue',
            description: 'Posts songs queue.',
            guildOnly: true,
            examples: ['$queue'],
            args: [
              {
                key: "page",
                prompt: "What page would you like to view?",
                type: "integer",
                default: '1'
              }
            ]
        });
    }
    async run(msg, {page}) {
        const serverQueue = essentials.queue.get(msg.guild.id)
        if (!serverQueue) {
        return msg.channel.send(":x: **Nothing playing in this server**")
        } else {
        const paginated = util.paginate(serverQueue.songs.slice(1), page, 10)
        let embed = new MessageEmbed()
        .setColor(config.defaultColor)
        .setTitle(`Queue for ${msg.guild.name}`)
        .setURL(`https://soulbot.me/`)
          
        if(serverQueue.songs.length > 1) {
          embed.setDescription(stripIndents`
             __Now Playing:__
             [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | ${this.client.timeCalc(serverQueue.songs[0].duration)} | ${serverQueue.songs[0].requester}
                              
             :arrow_down: __Up Next:__ :arrow_down:

             ${paginated.items.map((song) => `${song.number}. [${song.title}](${song.url}) | ${this.client.timeCalc(song.duration)} | ${song.requester}`).join('\n\n')}
          `)
          embed.setFooter(`Page ${paginated.page}/${paginated.maxPage}`)
        } else {
          embed.setDescription(stripIndents`
             __Now Playing:__
             [${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) | ${this.client.timeCalc(serverQueue.songs[0].duration)} | ${serverQueue.songs[0].requester}
          `)
        }
        return msg.embed(embed)
    }
  }
}