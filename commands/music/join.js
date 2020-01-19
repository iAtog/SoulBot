const { MessageEmbed } = require('discord.js')
const { Command } = require('discord.js-commando'),
        essentials = require("../../music_exports").modules,
        config = require('../../data/config.json')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            group: 'music',
            memberName: 'join',
            description: 'Joins voice channel.',
            guildOnly: true,
            examples: ['$join']
        });
    }

    async run(msg) {
        const voiceChannel = msg.member.voice.channel
        if (!voiceChannel) { 
          return msg.channel.send(":x: **You have to be in a voice channel to use this command.**")
        } else {
        voiceChannel.join()
        msg.channel.send(`**:thumbsup: Joined \`${voiceChannel.name}\`**`)
      }
    }
}