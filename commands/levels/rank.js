const {Command} = require('discord.js-commando');
const { MessageAttachment } = require("discord.js");
const { Canvas } = require("canvas-constructor");
const fetch = require("node-fetch");
const d3 = require('d3-format');
const toPercentage = (current, total) => Math.round(current / total * 460);
const format = (number) => number > 999 ? d3.format('.3s')(number) : number;

module.exports = class RankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rank',
            group: 'levels',
            memberName: 'rank',
            description: 'Displays the current rank and level progress',
            examples: ['rank'],
            throttling: {
                usages: 1,
                duration: 60
            },
            args: [
              {
                key: 'member',
                type: 'member',
                prompt: "Who's rank would you like to view",
                default: msg => msg.member
              }
            ]
        });
    }

    async run(msg, {member}) {
        
              if (await msg.guild.settings.get('delete-cmd', false))
                await msg.delete()

    const statusColors = {
        online: '#44b37f',
        dnd: '#f04747',
        idle: '#faa61a',
        offline: '#747f8d'
    }

    const fonts = {
        lucidaSans: '24px Lucida Sans',
        centuryGothic: '50px Century Gothic',
    }
    const leaderboard = await msg.client.levels.getLeaderboard(msg.guild);
    function cmpFunction(item) {
        return item.user == member.id;
	}
    const currentExp = (await msg.client.levels.getGuildMemberExp(member)),
      currentRank = await leaderboard.findIndex(cmpFunction) + 1,
      currentLevel = await msg.client.levels.getLevelFromExp(currentExp),
      levelExp = await msg.client.levels.getLevelExp(currentLevel),
	  currentLevelExp = await msg.client.levels.getLevelProgress(currentExp);  
	  
	  if(currentExp == 0) {
		  return msg.channel.send("This user isn't ranked.")
	  }
	  
      const attachment = new MessageAttachment(await generate(currentLevelExp, levelExp, currentRank, currentLevel, member, "a7eaf6"));
      msg.channel.send(attachment);

    async function generate(current, total, rank, level, member, color) {
		current = current.toString();
		total = total.toString();
		rank = rank.toString();
		level = level.toString();
		color = color.toString().length === 6 ? color : color.toString().padStart(6, '0');

		let correctX = 0;
		const avatar = await fetch(member.user.displayAvatarURL({ format: 'png', size: 2048 })).then(res => res.buffer());
		let canvas =new Canvas(934, 282)
		canvas
		.setColor(`#23272a`)
		.addRect(0, 0, 934, 282)
		.setColor('#484B4E')
		.beginPath()
		.arc(460, 170, 20, Math.PI * 0.5, Math.PI * 1.5)
		.fill()
		.closePath()
		.addRect(460, 150, 373, 40)
		.beginPath()
		.arc(830, 170, 20, Math.PI * 0.5, Math.PI * 1.5, true)
		.fill()
		.closePath()
		.addCircle(270, 230, 20)
		.beginPath()
		.moveTo(0, 0)
		.lineTo(240, 0)
		.lineTo(350, 282)
		.lineTo(0, 282)
		.closePath()
		.setShadowColor('black')
		.setShadowBlur(20)
		.setColor('#a7eaf6')
		.fill()
		.createRoundPath(141, 141, 100)
		.setShadowColor('black')
		.fill()
		.addCircularImage(avatar, 141, 141, 100)
		.setTextSize(38)
		.setTextAlign('start')
		.setColor('white')
		.addResponsiveText(member.user.username, 445, 130, 130)
		.measureText(member.user.username, ({ width }) => correctX = width)
		.setTextFont(fonts.lucidaSans)
		.setColor('#7F8384')
		.addText(`#${member.user.discriminator}`, correctX + 445, 130)
		.setTextSize(24)
		.setColor('#7F8384')
		.setTextAlign('right')
		.addText(`/ ${format(total)} XP`, 840, 130)
		.measureText(`/ ${format(total)} XP`, (size) => correctX = 835 - size.width)
		.setColor('#FFFFFF')
		.addText(format(current), correctX, 130)
		.save()
		.setColor('white')
		.setTextAlign('center')
		.setShadowColor('black')
		.setShadowBlur(5)
		.addText(`Level ${level} | #${rank}`, (460 + (840-460)/2), 230, 322)
		

		let percent = toPercentage(current, total);
		if (percent < 40) return canvas.toBufferAsync(); 
		let width = percent -= 40
		canvas
			.setShadowColor('transparent')
			.setColor(`#${color}`)
			.addCircle(460, 170, 20)
			.addRect(460, 150, width, 40)
			.addCircle(460 + percent, 170, 20);

		return canvas.toBufferAsync();
	}
  }
};

