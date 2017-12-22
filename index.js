const Eris = require("eris");

// BOT_TOKEN は 自身が作成したBotの Bot token の文字を記述します。
const bot = new Eris("MzkzMzk0NTI3MDY4NDg3Njkw.DR1Kqw.3MuP3gLdtS3hjPyVu-9y3JHPcME");

bot.on("ready", () => {
    // bot が準備できたら呼び出されるイベントです。
    console.log("Ready!");
});

bot.on("messageCreate", (msg) => {
    // 誰かがメッセージ(チャット)を発言した時に呼び出されるイベントです。
    switch (msg.content){
        case "!ready":
            bot.createMessage(msg.channel.id, "ほな、マッチの準備をするで〜。");    
            ready(msg);
            break;
        case "!info":
            if(matchId == null){
                bot.createMessage(msg.channel.id, "なんや、マッチの準備ができてないな。");  
            } else {   
                bot.createMessage(msg.channel.id, "よしよし、マッチ情報やな。よぉ聞いとれよ。");                            
                info(msg);
            }
            break;
        default:
      }
});

// Discord に接続します。
bot.connect();

/* ----------------------
 *  RESTサービスの呼び出し
 * ---------------------*/
const Client = require('node-rest-client').Client;
const Buffer = require("buffer").Buffer;

const client = new Client();
const baseUrl = "http://localhost:8080/form-matchup-tables/";
let matchId = null;

/** マッチの準備をします。 */
function ready(msg) {
    let req = client.post(baseUrl + "matches/create", function (data, response) {
        matchId = new Buffer(data).toString();
    });

    req.on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });
}

/** マッチ情報を取得します。 */
function info(msg) {
    let req = client.get(baseUrl + "matches/{id}?matchId=" + matchId, function (data, response) {
        var result = data.matchId;
        bot.createMessage(msg.channel.id, result);
    });

    req.on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });
}
