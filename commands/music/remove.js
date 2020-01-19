const { MessageEmbed } = require('discord.js')
const { Command } = require('discord.js-commando'),
        essentials = require("../../music_exports").modules,
        config = require('../../data/config.json')

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove',
            group: 'music',
            memberName: 'remove',
            description: 'Removes a song from the queue.',
            guildOnly: true,
            examples: ['$remove'],
            args: [
              {
                key: "number",
                type: "integer",
                prompt: "What number in the queue would you like to remove? (Min: 1)",
                min: "1"
              }
            ]
        });
    }
    async run(msg, {number}) {
        const serverQueue = essentials.queue.get(msg.guild.id)
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) { 
         return msg.channel.send(":x: **You have to be in a voice channel to use this command.**")
        }
        if (!serverQueue) {
          return msg.channel.send(":x: **Nothing play in this server**")
        } else {
        const song = serverQueue.songs.splice(number, 1);
        msg.channel.send(`❌ Removed **${song[0].title}** from the queue.`);
        } 
    }
}