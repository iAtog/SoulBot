const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require('../../data/config');

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'moderation',
            memberName: 'kick',
            description: 'Kick a user.',
            examples: ['kick @User'],
            aliases: ['kick', 'bye', 'k'],
            args: [
                {
                    key: 'user',
                    prompt: 'please mention who you want to kick.',
                    error: "that is not a valid user, please try again (ex:@User).",
                    type: 'user'
                },
                {
                    key: "reason",
                    prompt: "Please provide a reason.",
                    type: "string"
                }
            ]  
        });
    }

    async run(msg, {user, reason}) {
      try {  
        if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
        if (msg.member.hasPermission("KICK_MEMBERS")){
            msg.guild.members.fetch(user)
                .then(member => {
                    member.kick(`${reason} | Issuer: ${msg.author.username}#${msg.author.discriminator}`)
                        .then(member => {
                            let embed = new MessageEmbed()
                                .setColor(config.successColor)
                                .setDescription(`${config.success} ${member.user} has been kicked.`)
                                .setFooter(`${msg.author.username}`, msg.author.avatarURL().replace('.webp', '.png'))
                                .setTimestamp(Date.now());
                            msg.say(embed);
                        })
                })
        } else {
                let embed = new MessageEmbed()
                    .setColor(config.errorColor)
                    .setDescription(`${config.error} No permission.`)
                msg.say(embed)
        }
    } catch (err) {
        let embed = new MessageEmbed()
            .setDescription(`${msg.author}, I have encountered an error: \`${err.message}\``)
            .setColor(config.errorColor)
            .setTimestamp(Date.now());
        msg.embed(embed)};
    }
};
