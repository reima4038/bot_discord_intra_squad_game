const Eris = require("eris");

// BOT_TOKEN は 自身が作成したBotの Bot token の文字を記述します。
var bot = new Eris("MzkzMzk0NTI3MDY4NDg3Njkw.DR1Kqw.3MuP3gLdtS3hjPyVu-9y3JHPcME");

bot.on("ready", () => {
    // bot が準備できたら呼び出されるイベントです。
    console.log("Ready!");
});

bot.on("messageCreate", (msg) => {
    // 誰かがメッセージ(チャット)を発言した時に呼び出されるイベントです。
    if(msg.content === "!ping") {
        // "!Ping" というメッセージを受け取ったら "Pong!" と発言する。
        bot.createMessage(msg.channel.id, "Pong!");
    } else if(msg.content === "!pong") { 
        // "!Pong" というメッセージを受け取ったら "Ping!" と発言する。
        bot.createMessage(msg.channel.id, "Ping!");
    }
});

// Discord に接続します。
bot.connect();