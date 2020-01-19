const {CommandoGuild} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const moment = require('moment');
const SoulUtils = require('./SoulUtils');
const config = require('../data/config.json')
const LevelsSchema = require("../schemas/levels.js")
const mongoose = require('mongoose')

class Levels {
    constructor(client) {
        this.client = client;
    }

    getLevelExp(level) {
        return 5 * (Math.pow(level, 2)) + 50 * level + 100;
    }
  
    getExpFromLevel(level) {
      let exp = 0
      for (let i = level - 1; i >= 0; i--) {
          exp += this.getLevelExp(i);
      }
      return exp;
    }

    getLevelFromExp(exp) {
        let level = 0;

        while (exp >= this.getLevelExp(level)) {
            exp -= this.getLevelExp(level);
            level++;
        }

        return level;
    };

    getLevelProgress(exp) {
        let level = 0;

        while (exp >= this.getLevelExp(level)) {
            exp -= this.getLevelExp(level);
            level++;
        }

        return exp;
    };

    getLeaderboard(guild) {
        if (guild instanceof CommandoGuild)
            guild = guild.id;

            return LevelsSchema.find({guild: guild}).sort({ exp: -1 })
        };

    getLeaderboardOffset(guild, offset) {
        offset = offset || 0;

        if (guild instanceof CommandoGuild)
            guild = guild.id;

            return LevelsSchema.find({guild: guild}).sort({exp: -1}).limit(10).skip(offset);
        };

    getLeaderboardCount(guild) {
        if (guild instanceof CommandoGuild)
            guild = guild.id;

            return LevelsSchema.find({guild: guild}).countDocuments();
        };


    getGuildMemberExp(member) {
        return new Promise(async (fulfill, reject) => {
           try {
             let data = (await LevelsSchema.findOne({guild: member.guild.id, user: member.id}))
             if(data == null) {
                fulfill(0)
             } else {
                fulfill(data.exp)
             }
            } catch(err) {
                console.log(err)
                reject(err)
           }
        })
    }

    setGuildMemberExp(member, xp) {
        return new Promise(async (fulfill, reject) => {
        try {
                let query = {user: member.id, guild: member.guild.id}
                let newData = {user: member.id, guild: member.guild.id, exp: xp}
                await LevelsSchema.updateOne(query , newData, {upsert: true})
            fulfill();
        } catch(err) {
            console.log(err)
            reject(err)
        }
      })
    }

    giveGuildUserExp(member, message) {
        if (moment().diff(member.timeout || 0) < 0)
            return;

        member.timeout = moment().add(1, 'minutes');

        return new Promise(async (fulfill, reject) => {
            try {
                const oldExp = await this.getGuildMemberExp(member);
                const oldLvl = this.getLevelFromExp(oldExp);
                const newExp = oldExp + SoulUtils.randomInt(15, 25);
                const newLvl = this.getLevelFromExp(newExp);

                await this.setGuildMemberExp(member, newExp);

                if (oldLvl != newLvl) {
                    await this.updateUserRoles(member, message);
                }

                fulfill();
            } catch (err) {
                console.log(err)
                reject(err);
            }
        });
    }

    updateUserRoles(member, message, fix) {
        return new Promise(async (fulfill, reject) => {
            try {
                const exp = (await this.getGuildMemberExp(member));
                const lvl = this.getLevelFromExp(exp);

                if (lvl === 0) return;

                let rewards = await message.client.rewards.getGuildRewards(message.guild);
                let rewardsKeys = Object.keys(rewards);



                if (rewardsKeys.length > 0) {
                    let rolesToAdd = [];

                    rewardsKeys.forEach(async function (key) {
                        if (rewards[key] > lvl) return;

                        if (!member.guild.roles.has(key)) {
                            await member.client.rewards.removeGuildReward(member.guild, key);
                            let invalidRoleEmbed = new MessageEmbed()
                            .addField(`${config.error} Invalid reward.`, `Role with ID \`${key}\` does no longer exist.\nRemoving the reward for you...`)
                            .setColor(config.errorColor);
                            return member.guild.owner.send(invalidRoleEmbed);
                        }

                        if (!member.roles.has(key)) {
                            rolesToAdd.push(key);
                        }

                    });

                    try {
                        await member.roles.add(rolesToAdd);
                    } catch (err) {
                        console.log(err);
                        let invalidRewardEmbed = new MessageEmbed()
                        .addField(`${config.error} No permission.`, `Not enough permissions to assign **${rolesToAdd}** role reward to **${member.user.tag}** on **${member.guild.name}**.`)
                        .setColor(config.errorColor);
                        return member.guild.owner.send(invalidRewardEmbed);
                    }

                    let levelFixEmbed = new MessageEmbed()
                    .setColor(`${config.successColor}`)
                    .addField(`${config.success} Rewards updated.`, `All rewards for level  **${lvl}** and under have been added.`)
                    .setFooter(`${member.user.username}`, member.user.displayAvatarURL().replace('.webp', '.png'))
                    .setTimestamp(Date.now())

                    if (fix && rolesToAdd.length > 0)
                        await message.channel.send(levelFixEmbed);
                }

                let levelUpEmbed = new MessageEmbed()
                .setColor(`${config.successColor}`)
                .addField(`${config.rankUp} Rank up.`, `Current Level: ${lvl}`)
                .setFooter(`${member.user.username}`, member.user.displayAvatarURL().replace('.webp', '.png'))
                .setTimestamp(Date.now());

                if (await message.guild.settings.get('message', true) && !fix)
                    await message.channel.send(levelUpEmbed);


                fulfill();
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = Levels;