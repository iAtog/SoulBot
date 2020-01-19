const { MessageEmbed } = require('discord.js')
const { Command } = require('discord.js-commando'),
        essentials = require("../../music_exports").modules,
        config = require('../../data/config.json')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clean',
            group: 'music',
            memberName: 'clean',
            description: 'Cleans the music queue.',
            guildOnly: true,
            examples: ['$clean']
        });
    }
    async run(msg) {
        const serverQueue = essentials.queue.get(msg.guild.id)
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) { 
          return msg.channel.send(":x: **You have to be in a voice channel to use this command.**")
          }
        if (!serverQueue) {
          return msg.channel.send(":x: **Nothing playing in this server**")
        } else {
          serverQueue.connection.dispatcher.end();
          essentials.queue.delete(msg.guild.id)
          return msg.channel.send(":wastebasket: **Cleaned the queue.**")
        } 
    }
}