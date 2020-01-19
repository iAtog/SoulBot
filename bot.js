const moment = require('moment'),
      path = require('path'),
      sqlite = require('sqlite'),
      MongoClient = require('mongodb').MongoClient;
      MongoDBProvider = require('commando-provider-mongo'),
      config = require('./data/config.json'),
      SoulCommandoClient = require('./lib/SoulCommandoClient'),
      SoulUtils = require('./lib/SoulUtils')
      web = require('./web.js')
      
const client = new SoulCommandoClient({
    commandPrefix: "$",
    owner: config.owner, 
    disableEveryone: true,
    invite: config.invite
});

client.timeCalc = function(seconds) {
          seconds = Number(seconds);
          var h = Math.floor(seconds % (3600*24) / 3600);
          var m = Math.floor(seconds % 3600 / 60);
          var s = Math.floor(seconds % 60);

          var hDisplay = h > 0 ? (hDisplay ? h >= 10 ? "" : "0" : "0" ) + h + (h == 1 ? ":" : ":") : "";
          var mDisplay = m > 0 ? (hDisplay ? m >= 10 ? "" : "0" : m >= 10 ? "" : "0") + m + (m == 1 ? ":" : ":") : "00:";
          var sDisplay = s > 0 ? (mDisplay ? s >= 10 ? "" : "0" : s >= 10 ? "00:" : "00:0" ) + s  : "00";
          return hDisplay + mDisplay + sDisplay;
        }

const events = {
    ready : require("./events/ready.js").ready,
    error : require("./events/error.js").error,
    message : require("./events/message.js").message,
    guildCreate : require("./events/guildCreate.js").guildCreate,
    guildDelete : require("./events/guildDelete.js").guildDelete,
    guildMemberAdd : require("./events/guildMemberAdd.js").guildMemberAdd,
    providerReady : require("./events/providerReady.js").providerReady
};


client.setProvider(
MongoClient.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => new MongoDBProvider(client, 'Soul'))
).catch(console.error)

client.registry
    .registerGroups([
      ["moderation", "Moderation"],
      ["levels", "Levels"],
      ["music", "Music"],
      ["images", "Images"],
      ["misc", "Miscellaneous"],
      ["util", "Utility"],
      ["settings", "Settings"],
      ["dev", "Developer"]
    ])
    .registerDefaultTypes()
    .registerCommandsIn(path.join(__dirname, "commands"));

client.dispatcher.addInhibitor(msg => {
  if (msg.channel.type == "dm") return "dm";
});

client
.on("ready", () => events.ready(client))
.on("error", err => events.error(err))
.on("message", message => events.message(message, client))
.on("guildCreate", guild => events.guildCreate(guild, client))
.on("guildDelete", guild => events.guildDelete(guild, client))
.on("guildMemberAdd", member => events.guildMemberAdd(member, client))
.on("providerReady", events.providerReady)

client.login(process.env.TOKEN);
