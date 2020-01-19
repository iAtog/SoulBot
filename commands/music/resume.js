const { MessageEmbed } = require('discord.js')
const { Command } = require('discord.js-commando'),
        essentials = require("../../music_exports").modules,
        config = require('../../data/config.json')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resume',
            group: 'music',
            memberName: 'resume',
            description: 'Resumes music.',
            guildOnly: true,
            examples: ['$resume']
        });
    }
    async run(msg) {
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) { 
          return msg.channel.send(":x: **You have to be in a voice channel to use this command.**")
          }
        const serverQueue = essentials.queue.get(msg.guild.id)
        if (serverQueue && !serverQueue.playing) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        msg.channel.send(`**:notes: Resumed.**`)
        } 
        if(!serverQueue) {
          return msg.channel.send(":x: **Nothing playing in this server**")
        }
    }
}