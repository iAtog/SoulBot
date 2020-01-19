const { MessageEmbed, splitMessage } = require('discord.js')
const { Command } = require('discord.js-commando')
const essentials = require("../../music_exports").modules
const config = require('../../data/config.json')
const { KSoftClient } = require('ksoft.js')
const ksoft = new KSoftClient('55b7df4958b39e0de904a740ff2ca93e8cadfa7a')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lyrics',
            group: 'music',
            memberName: 'lyrics',
            description: 'Shows lyrics.',
            guildOnly: true,
            examples: ['$lyrics']
        });
    }
    async run(msg) {
        const serverQueue = essentials.queue.get(msg.guild.id)
        if (!serverQueue) {
          return msg.channel.send(":x: **Nothing play in this server**")
        }
        const lyrics = await ksoft.lyrics.search(serverQueue.songs[0].title, {limit: 1})
        if(!lyrics) {
        return msg.channel.send(`:x: No lyrics were found for \`${serverQueue.songs[0].title}```)
        } else {
        const message = await splitMessage(lyrics[0].lyrics)
        message.forEach(async lyricMsg => {
        let embed = new MessageEmbed()
        .setDescription(lyricMsg)
        .setColor(config.defaultColor)
        await msg.channel.send(embed)
        })
    }
  }
}