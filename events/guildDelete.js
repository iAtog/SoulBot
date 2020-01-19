exports.guildDelete = async function guildDelete(guild, client){
  client.user.setPresence({activity: {name: `${client.guilds.size} servers | ${client.commandPrefix}help`, type: "WATCHING"},status: "dnd"});
}