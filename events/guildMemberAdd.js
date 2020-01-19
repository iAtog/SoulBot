const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require("../data/config.json");
const { Canvas } = require("canvas-constructor");
const fetch = require("node-fetch");

exports.guildMemberAdd = async function guildMemberAdd(member, client) {
  const channel = member.guild.settings.get("welcomeChannel");
  const autorole = member.guild.settings.get("autoRole");
  if (autorole) {
    const role = member.guild.roles.get(autorole);
    member.roles.add(role).catch(err => {
      member.guild.settings.remove("autoRole");
      let embed = new MessageEmbed()
        .setColor(config.errorColor)
        .setDescription(`${config.error} I couldn't assign the autorole you have set for me in \`${member.guild.name}\`\n\n- Do i have permissions?\n- Is the selected autorole above my role?\n- Does the role still exist?\n\nI have removed the autorole for you, set it again using the autorole command.`)
        .setThumbnail(member.guild.iconURL().replace(".webp", ".png"));
      member.guild.owner.send(embed);
    });
  }

  if (channel) {
    async function generate(member) {
      let correctX = 0;
      const avatar = await fetch(member.user.displayAvatarURL({ format: 'png', size: 2048 })).then(res => res.buffer());
      let canvas =new Canvas(934, 282)
      Canvas.registerFont("fonts/Montserrat.ttf", "Montserrat")
      canvas
      .setColor(`#23272a`)
      .addRect(0, 0, 934, 282)
      .setColor('#484B4E')
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
      .addCircle(622, 100, 30)
      .setShadowColor('transparent')
      .addImage(await fetch(`https://i.imgur.com/kc0wNLm.png`).then(res => res.buffer()), 608, 85, 30, 30)
      .setShadowColor('black')
      .setShadowOffsetY(3)
      .setTextFont("50px Montserrat")
      .setTextAlign('center')
      .setColor('white')
      .addResponsiveText(member.user.username, 622, 200, 500)
  
      return canvas.toBufferAsync();
    }

    const attachment = new MessageAttachment(await generate(member), "welcome-image.png");
    const welcomeChannel = member.guild.channels.get(channel);
    const message = member.guild.settings.get("welcomeMsg");
    if (!message) {
      var welcomeMessage = `Welcome to the server, ${member}!`;
    } else {
      var welcomeMessage = message.replace(/\{user\}/g, member)
    }

    welcomeChannel.send(welcomeMessage, attachment);
  }
};
