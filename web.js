// oh yeah
// go in config and change the token
// data/config.json
// Web Dependencies
const http = require("http"),
express = require("express"),
cookies = require("cookies"),
cookieParser = require("cookie-parser"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
DiscordOauth2 = require("discord-oauth2"),
oauth = new DiscordOauth2(),
Base64 = require("js-base64").Base64,
Discord = require('discord.js'),
bot = new Discord.Client(),
config = require("./data/config.json"),
mongoose = require('mongoose'),
LevelsSchema = require('./schemas/levels.js'),
ReportSchema = require('./schemas/report.js'),
SettingsSchema = require('./schemas/settings.js')

mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true }).then(db => {
        this.connection = db;
        console.log("[Soul] Databaseruni Loaded")
})

const clientID = "666817189310890014";
const client_secret = "kFA8aQytCx4MKThGCpyKPpbxtXpTIjdI";
const auth_url = "https://discordapp.com/api/oauth2/authorize?client_id=666817189310890014&redirect_uri=https%3A%2F%2Fsoulbot.me%2Flogin&response_type=code&scope=identify%20guilds";

const app = express();
const server = http.Server(app);

app.set("view engine", "ejs");
app.use('/assets', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(cookies.express(["normies big gay"]));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


app.get("/", async (req, res) => {
    let token = req.cookies.get("access_token");
    if(token) {
      let user = await oauth.getUser(token).catch(err => res.redirect(auth_url))
      res.render("index", {title: "Home", css: "index", user: user}); 
    } else {
      res.render("index", {title: "Home", css: "index"}); 
    }
});

app.get("/dashboard", loggedIn, async (req, res) => {
    let token = req.cookies.get("access_token");
    let guilds = await oauth.getUserGuilds(token);
    let user = await oauth.getUser(token);
    res.render("dashboard", {title: "Dashboard", css: "dashboard", guilds: guilds, user: user});
});

app.get("/dashboard/:id", loggedIn, async (req, res) => {
    let token = req.cookies.get("access_token");
    let user = await oauth.getUser(token);
    let guild_id = req.params.id;
    let guild = bot.guilds.get(guild_id);
    if(!guild) {
      res.redirect(`https://discordapp.com/oauth2/authorize?client_id=584566571247337482&scope=bot&permissions=2146958839&guild_id=${guild_id}`)
    } else {
      SettingsSchema.findOne({guild: guild.id}).then(result => {
         res.render("guild", {title: guild.name, css: "guild", guild: guild, user: user, settings: result}); 
      });
    }
});

app.get("/dashboard/:id/general", loggedIn, async (req, res) => {
    let token = req.cookies.get("access_token");
    let user = await oauth.getUser(token);
    let guild_id = req.params.id;
    let guild = bot.guilds.get(guild_id);
    if(!guild) {
      res.redirect(`https://discordapp.com/oauth2/authorize?client_id=584566571247337482&scope=bot&permissions=2146958839&guild_id=${guild_id}`)
    } else {
      SettingsSchema.findOne({guild: guild.id}).then(result => {
         res.render("general", {title: guild.name, css: "general", guild: guild, user: user}); 
      });
    }
});

app.get("/dashboard/:id/levels", loggedIn, async (req, res) => {
    let token = req.cookies.get("access_token");
    let user = await oauth.getUser(token);
    let guild_id = req.params.id;
    let guild = bot.guilds.get(guild_id);
    if(!guild) {
      res.redirect(`https://discordapp.com/oauth2/authorize?client_id=584566571247337482&scope=bot&permissions=2146958839&guild_id=${guild_id}`)
    } else {
      SettingsSchema.findOne({guild: guild.id}).then(result => {
         res.render("levels", {title: guild.name, css: "levels", guild: guild, user: user}); 
      });
    }
});

app.get("/dashboard/:id/welcome", loggedIn, async (req, res) => {
    let token = req.cookies.get("access_token");
    let user = await oauth.getUser(token);
    let guild_id = req.params.id;
    let guild = bot.guilds.get(guild_id);
    if(!guild) {
      res.redirect(`https://discordapp.com/oauth2/authorize?client_id=584566571247337482&scope=bot&permissions=2146958839&guild_id=${guild_id}`)
    } else {
      SettingsSchema.findOne({guild: guild.id}).then(result => {
         res.render("welcome", {title: guild.name, css: "welcome", guild: guild, user: user}); 
      });
    }
});

app.get("/dashboard/:id/music", loggedIn, async (req, res) => {
    let token = req.cookies.get("access_token");
    let user = await oauth.getUser(token);
    let guild_id = req.params.id;
    let guild = bot.guilds.get(guild_id);
    if(!guild) {
      res.redirect(`https://discordapp.com/oauth2/authorize?client_id=584566571247337482&scope=bot&permissions=2146958839&guild_id=${guild_id}`)
    } else {
      SettingsSchema.findOne({guild: guild.id}).then(result => {
         res.render("music", {title: guild.name, css: "music", guild: guild, user: user}); 
      });
    }
});

app.get("/dashboard/:id/moderation", loggedIn, async (req, res) => {
    let token = req.cookies.get("access_token");
    let user = await oauth.getUser(token);
    let guild_id = req.params.id;
    let guild = bot.guilds.get(guild_id);
    if(!guild) {
      res.redirect(`https://discordapp.com/oauth2/authorize?client_id=584566571247337482&scope=bot&permissions=2146958839&guild_id=${guild_id}`)
    } else {
      SettingsSchema.findOne({guild: guild.id}).then(result => {
         res.render("moderation", {title: guild.name, css: "moderation", guild: guild, user: user}); 
      });
    }
});

app.get("/dashboard/:id/misc", loggedIn, async (req, res) => {
    let token = req.cookies.get("access_token");
    let user = await oauth.getUser(token);
    let guild_id = req.params.id;
    let guild = bot.guilds.get(guild_id);
    if(!guild) {
      res.redirect(`https://discordapp.com/oauth2/authorize?client_id=584566571247337482&scope=bot&permissions=2146958839&guild_id=${guild_id}`)
    } else {
      SettingsSchema.findOne({guild: guild.id}).then(result => {
         res.render("misc", {title: guild.name, css: "misc", guild: guild, user: user}); 
      });
    }
});

app.get("/login", async (req, res) => {
  let token = await oauth.tokenRequest({
      clientId: clientID,
      clientSecret: client_secret,

      code: req.query.code,
      scope: "identify guilds",
      grantType: "authorization_code",

      redirectUri: "https://soulbot.me/login"
  })
  req.cookies.set("access_token", token.access_token, {expires: token.exires_in});
  req.cookies.set("refresh_token", token.refresh_token)
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  if(!req.cookies.get("access_token")){
      res.redirect("/");
  }else{
    let token = req.cookies.get("access_token");
    req.cookies.set("access_token");
    req.cookies.set("refresh_token");
    const credentials = Base64.encode(`${clientID}:${client_secret}`);
    oauth.revokeToken(token, credentials)
    res.redirect("/");
  }
});

function loggedIn(req, res, next){
    let token = req.cookies.get("access_token");
    if(!token){
        res.redirect(auth_url)
    }else{
        next();
    }
}

app.listen(1988, function() {
  console.log(`[Soul] Web server is listening!`)
});

bot.login(process.env.TOKEN)