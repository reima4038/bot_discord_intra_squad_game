const Buffer = require("buffer").Buffer;
const Eris = require("eris");
const Client = require('node-rest-client').Client;

const client = new Client();
const baseUrl = "http://localhost:8080/form-matchup-tables/";
let matchId = null;

// BOT_TOKEN は 自身が作成したBotの Bot token の文字を記述します。
let bot = new Eris("MzkzMzk0NTI3MDY4NDg3Njkw.DR1Kqw.3MuP3gLdtS3hjPyVu-9y3JHPcME");

bot.on("ready", () => {
    // bot が準備できたら呼び出されるイベントです。
    console.log("Ready!");
});

bot.on("messageCreate", (msg) => {
    // 誰かがメッセージ(チャット)を発言した時に呼び出されるイベントです。
    if(msg.content === "!match-up") {
        client.post(baseUrl + "matches/create", function (data, response) {
            bot.createMessage(msg.channel.id, "ほな、マッチの準備をするで〜。");
            matchId = new Buffer(data).toString();
        });
    } else if(msg.content === "!info"){
        client.get(baseUrl + "matches/{id}?matchId=" + matchId, function (data, response) {
            bot.createMessage(msg.channel.id, "よしよし、マッチ情報やな。よぉ聞いとれよ。");            
            var result = data.matchId;
            bot.createMessage(msg.channel.id, result);
        });
    }
});

// Discord に接続します。
bot.connect();
