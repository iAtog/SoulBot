const {Command} = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const config = require('../../data/config.json')

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setrank',
            group: 'levels',
            memberName: 'setrank',
            description: 'Sets a users rank.',
            examples: ['setrank 5'],
            ownerOnly: true,
            args: [
              {
                key: 'member',
                type: 'member',
                prompt: "Who's rank would you like to change?"
              },
              {
                key: 'rank',
                type: 'integer',
                prompt: "What rank would you like? (Min: 1, Max: 500)",
                min: "1",
                max: "500"
              }
            ]
        });
    }
  
      hasPermission(msg) {
        if (!this.client.isOwner(msg.author) && (msg.guild || {}).ownerID != msg.author.id) return 'Only the bot or server owner(s) may use this command.';
        return true;
    }

    async run(msg, {member, rank}) {
      if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()
      
        const calculatedExp = await msg.client.levels.getExpFromLevel(rank)
        setTimeout(async () => {await msg.client.levels.setGuildMemberExp(member, calculatedExp)}, 500)
        let embed = new MessageEmbed()
            .setTitle(`${config.success} Rank updated.`)
            .setDescription(`${member} is now Level ${rank}`)
            .setColor(config.successColor)
            .setFooter(msg.author.username, msg.author.displayAvatarURL().replace('.webp', '.png'))
            .setTimestamp(Date.now())
        await msg.embed(embed);
    }
};
