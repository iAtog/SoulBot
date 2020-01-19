const {Command} = require('discord.js-commando');
const SoulUtils = require('../../lib/SoulUtils');
const { MessageEmbed } = require('discord.js')
const config = require('../../data/config.json')

module.exports = class RewardsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reward',
            group: 'levels',
            memberName: 'reward',
            description: 'Manages the reward system',
            examples: ['reward add RewardRole 10', 'reward remove Another 15'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'option',
                    prompt: 'What do you want to do? (add/remove)',
                    type: 'string',
                    validate: option => {
                        if (option == 'add' || option == 'remove') return true;
                        return 'Invalid option selected';
                    }
                },
                {
                    key: 'role',
                    prompt: 'Which role should the reward be?',
                    type: 'role'
                },
                {
                    key: 'level',
                    prompt: 'With which level do you get this reward?',
                    type: 'integer',
                    default: 0
                }
            ]
        });
    }

    async run(msg, {option, role, level}) {
        if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
        if (option == 'add') {
            if (await this.client.rewards.addGuildReward(msg.guild, role, level)) {
                let embed = new MessageEmbed()
                .setDescription(`${config.success} Reward added.`)
                .setColor(config.successColor)
                .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
                .setTimestamp(Date.now());
                msg.embed(embed);
            } else {
                let embed = new MessageEmbed()
                .setDescription(`${config.error} Role is already a reward.`)
                .setColor(config.errorColor)
                .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
                .setTimestamp(Date.now());
                msg.embed(embed);
            }
        } else {
            if (await this.client.rewards.removeGuildReward(msg.guild, role)) {
                let embed = new MessageEmbed()
                .setDescription(`${config.success} Reward removed.`)
                .setColor(config.successColor)
                .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
                .setTimestamp(Date.now());
                await msg.embed(embed)
            } else {
                let embed = new MessageEmbed()
                .setDescription(`${config.error} Role is not a reward.`)
                .setColor(config.errorColor);
                return await msg.embed(embed);
            }
        }
    }
};