const { Command } = require('discord.js-commando'),
      { MessageEmbed } = require('discord.js'),
      config = require('../../data/config'),
      moment = require('moment'),
      SoulUtils = require('../../lib/SoulUtils');

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            group: 'levels',
            memberName: 'leaderboard',
            aliases: ['leaderboards', 'levels'],
            description: 'Displays the leaderboard of the guild',
            examples: ['leaderboard'],
            throttling: {
                usages: 1,
                duration: 1800
            }
        });
    }

    async run(msg) {
        msg.delete();
        const count = await msg.client.levels.getLeaderboardCount(msg.guild);

        if(count == 0) return msg.channel.send("No leaderboard data for this guild.")

        const pages = Math.ceil(count / 10) - 1;
        let page = 0;

        async function genData(page) {
            let output = "";

            const data = await msg.client.levels.getLeaderboardOffset(msg.guild, page * 10);

            data.forEach((row) => {
                row.currentRank = data.indexOf(row) + 1 + page * 10;
                row.currentLevel = msg.client.levels.getLevelFromExp(row.exp);
                row.levelExp = msg.client.levels.getLevelExp(row.currentLevel);
                row.currentLevelExp = msg.client.levels.getLevelProgress(row.exp);

                if (msg.guild.members.has(row.user)) {
                    const member = msg.guild.members.get(row.user);

                    row.name = `${member.user}`;
                } else {
                    row.name = `<@${row.user}>`;
                }
                  output += `#${row.currentRank} - Level ${row.currentLevel}\n${row.name}\n`;
            });

            return output;
        }
    
        let embed = new MessageEmbed()
        .addField(`Leaderboard (Page ${page + 1}/${pages + 1})`, await genData(page))
        .setColor(config.defaultColor)
        .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
        .setTimestamp(Date.now());
        let message = await msg.channel.send(embed);

        message.react('651435742089969674');
        message.react('651435742458806272');
        message.react('651435741754294292');
        message.react('651435741984849920');

        const collector = message.createReactionCollector(
            (reaction, user) => user.id == msg.author.id,
            {time: 120000}
        );

        collector.on('collect', async (r) => {
            r.users.remove(msg.author.id);

            switch (r.emoji.id) {
                case '651435742089969674':
                    page = 0;

                    break;
                case '651435741754294292':
                    if (page >= pages) return;

                    page++;
                    break;
                case '651435742458806272':
                    if (page <= 0) return;

                    page--;
                    break;
                case '651435741984849920':
                    return collector.stop();
            }
            
            let embed = new MessageEmbed()
            .addField(`Leaderboard (Page ${page + 1}/${pages + 1})`, await genData(page))
            .setColor(config.defaultColor)
            .setFooter(`${msg.author.username}`, msg.author.avatarURL() .replace('.webp', '.png'))
            .setTimestamp(Date.now());
            await message.edit(embed);
        });

        collector.on('end', () => {
            message.delete();
        });
    }
}
