exports.message = async function message(msg, client) {
  if (msg.author.id === client.user.id) {
    return;
  }

  if (msg.author.bot) {
    return;
  }

  if (!msg.guild) {
    return;
  }

  await client.levels.giveGuildUserExp(
    msg.guild.members.get(msg.author.id), msg
  );
};
