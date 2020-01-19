const { MessageEmbed } = require('discord.js')
const { Command } = require('discord.js-commando'),
        essentials = require("../../music_exports").modules,
        config = require('../../data/config.json')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            group: 'music',
            memberName: 'loop',
            aliases: ['repeat'],
            description: 'Loops current song.',
            guildOnly: true,
            examples: ['$loop']
        });
    }
    async run(msg) {
        const serverQueue = essentials.queue.get(msg.guild.id)
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) { 
         return msg.channel.send(":x: **You have to be in a voice channel to use this command.**")
        }
        if (!serverQueue) {
          return msg.channel.send(":x: **Nothing play in this server**")
        } else {
        serverQueue.loop = !serverQueue.loop;
        return msg.channel.send(`:repeat:  **${serverQueue.loop ? "Enabled." : "Disabled."}**`)
        } 
    }
} 