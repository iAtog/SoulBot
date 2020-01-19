const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config');


module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name:"avatar",
            group: 'misc',
            memberName: 'avatar',  
            aliases: ['av'],
            description: 'Displays the avatar of a user.',
            args: [
                {
                    type:"user",
                    prompt:"Which user would you like to display the avatar of?",
                    key:"user",
                    default: msg => msg.author
                }
            ]
        })
    }
    async run(msg, { user }) {
        if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
        let embed = new MessageEmbed()
            .setImage(user.displayAvatarURL({ size: 2048 }).replace('.webp', '.png'))
            .setColor(config.defaultColor)
            .setFooter(`${msg.author.username}`, msg.author.avatarURL().replace(".webp", ".png"))
            .setTimestamp()
        msg.embed(embed)
    } 
}
