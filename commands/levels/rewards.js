const {Command} = require('discord.js-commando');
const SoulUtils = require('../../lib/SoulUtils');
const { MessageEmbed } = require('discord.js')
const config = require('../../data/config.json')

module.exports = class RewardsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rewards',
            group: 'levels',
            memberName: 'rewards',
            description: 'Lists all rewards',
            examples: ['rewards'],
        });
    }

    async run(msg) {
        if (await msg.guild.settings.get('delete-cmd', false))
            await msg.delete()
        let rewards = await msg.client.rewards.getGuildRewards(msg.guild);
        let rewardsKeys = Object.keys(rewards).sort((a, b) => rewards[a] - rewards[b]);

        if (rewardsKeys.length == 0) {
            let embed = new MessageEmbed()
            .setDescription(config.error + ' There are no rewards in this guild')
            .setColor(config.errorColor)
            .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
            .setTimestamp();
            return await msg.channel.send(embed);
        }

        let text = '';

        rewardsKeys.forEach((key) => {
            text += `\n${msg.guild.roles.get(key)} - Level: ${rewards[key]}\n`;
        });
        let embed = new MessageEmbed()
        .setTitle("🏆 Rewards")
        .setDescription(`${text}`)
        .setColor(config.defaultColor)
        .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
        .setTimestamp(Date.now());
        await msg.channel.send(embed);
    }
};