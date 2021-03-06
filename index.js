const Eris = require("eris");

// BOT_TOKEN は 自身が作成したBotの Bot token の文字を記述します。
const bot = new Eris("YOUR TOKEN");

const version = "0.1.0(α)";
let matchId = null;

bot.on("ready", () => {
    // bot が準備できたら呼び出されるイベントです。
    console.log("Ready!");
});

bot.on("messageCreate", (msg) => {
    // 誰かがメッセージ(チャット)を発言した時に呼び出されるイベントです。
    switch (msg.content){
        case "!ready":
        case "!r":
            execute(ready, msg);
            break;
        case "!info":
        case "!i":
            readyAndExecute(info, msg)
            break;
        case "!entry":
        case "!e":
        case "!in":
            readyAndExecute(entry, msg)
            break;
        case "!leave":
        case "!l":
        case "!out":
            readyAndExecute(leave, msg);            
            break;
        case "!shuffle":
        case "!assign":
        case "!sh":
            readyAndExecute(assign, msg);            
            break;
        case "!start":
            readyAndExecute(start, msg);
            break;
        case "!talk":
            execute(talk, msg);
            break;
        case "!version":
            bot.createMessage(msg.channel.id, version);  
            break;
        default:
      }
});

/**
 * コマンドを実行する。
 * @param {実行コマンドのコールバック関数} cmd 
 */
function execute(cmd, msg){
    cmd(msg);
}

/**
 * コマンドを実行する。
 * マッチの準備が行われてない場合、準備する旨の発現を行う。
 * @param {実行コマンドのコールバック関数} cmd 
 */
function readyAndExecute(cmd, msg){
    if(isNotReady()){
        bot.createMessage(msg.channel.id, "なんや、準備ができてないな。段取りするから、[!ready]と入力してくれ。");  
    } else {   
        cmd(msg);
    } 
}

// Discord に接続します。
bot.connect();

/* ----------------------
 *  RESTサービスの呼び出し
 * ---------------------*/
const Client = require('node-rest-client').Client;
const Buffer = require("buffer").Buffer;

const client = new Client();
const baseUrl = "http://localhost:8080/form-matchup-tables/";

/** 紅白戦の準備をします。 */
function ready(msg) {
    if(matchId == null){
        bot.createMessage(msg.channel.id, "ほな、紅白戦の準備をするで〜。");    
        client.post(encodeURI(baseUrl + "matches/create"), function (data, response) {
            matchId = new Buffer(data).toString();
            bot.createMessage(msg.channel.id, "紅白戦にエントリーするなら[!entry]、参加中のメンバーを見たいなら[!info]と言ってくれ。");    
        }).on('error', function (err) {
            bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
        });
    } else {
        bot.createMessage(msg.channel.id, "準備中の紅白戦があるみたいや。次の紅白戦を準備する前に[!start]してくれ。");    
    }
}

/** マッチ情報を取得します。 */
function info(msg) {
    client.get(encodeURI(baseUrl + "matches/{id}?matchId=" + matchId), function (data, response) {
        sayTeamInfo(msg, data);
        bot.createMessage(msg.channel.id, "控えをチームに振り分けるなら[!shuffle]、ゲーム開始は[!start]や");
    }).on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });
}

/** マッチに参加します */
function entry(msg) {
    let entryName = getMessegeAuthorName(msg);
    client.put(encodeURI(baseUrl + "matches/{id}/members/{name}?matchId=" + matchId 
    + "&memberName=" + entryName), function (data, response) {
        bot.createMessage(msg.channel.id, "りょーかい、" + entryName + "はん。参加受け付けたで！");
        bot.createMessage(msg.channel.id, "退出するなら[!leave]と言ってくれ。");
    }).on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });  
}

/** マッチから退出します */
function leave(msg) {
    let leaveName = getMessegeAuthorName(msg);
    client.delete(encodeURI(baseUrl + "matches/{id}/members/{name}?matchId=" + matchId 
    + "&memberName=" + leaveName), function (data, response) {
        bot.createMessage(msg.channel.id, "りょーかい、" + leaveName + "はん。紅白戦から抜けるで。");
        bot.createMessage(msg.channel.id, "もう一度参加するなら[!entry]と言ってくれ。");
    }).on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });  
}

/** チームを振り分けます */
function assign(msg) {
    client.put(encodeURI(baseUrl + "matches/{id}/teams/reassign?matchId=" + matchId), function (data, response) {
        sayTeamInfo(msg, data)
        bot.createMessage(msg.channel.id, "振り分け直すなら[!shuffle]、ゲーム開始は[!start]や。");
    }).on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });  
}

/** 紅白戦を開始します。 */
function start(msg) {
    bot.createMessage(msg.channel.id, "さぁ、紅白戦開始やで。");
    client.put(encodeURI(baseUrl + "matches/{id}/start?matchId=" + matchId), function (data, response) {
        sayTeamInfo(msg, data);
        matchId = null;
        bot.createMessage(msg.channel.id, "次の紅白戦を準備するなら[!ready]や。");
    }).on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    }); 
}

/** なんか喋ります。 */
const sentence = 
    [
    "ほんま、魔法使いにろくな奴おらんわ。ぺっ。",
    "そういえば、内蔵むき出しで骨が飛び出たものごっつい奴に食われたことあんねんけどな。ワイ、鶏肉みたいな味やってんて。カエルか。",
    "ワイ、うさんくさい魔法使いに飼われとってんけどな。ちゃうねん。逆にワイが魔法使いを飼ったるっちゅーねん。",
    "ワイが魔法使いに捕まったときな、檻に入れられとったんやけど、鉄やってん。そら溶けるわ。",
    "ワイが捕まっとった檻から抜けたとき、あのみょーちきりんの顔に毒吐いたってん。ざまーみさらせやな。",
    "あのヘビ頭のねーちゃんおるやん？ ワイのこと見て「おいで！」とか言うねん。いや、行かんわ。",
    "飛行機乗ってるおっちゃんおるやん？ あいつ実はポルコやって。紅の。嘘やけど。",
    "あの飛行機乗ってるおっちゃん、ワイ見てやたらクソクソ言うんやけど。傷つくわぁ。まぁ乗ってんの鉄やし、溶かせるし、気持ちは分かるねんけど。",
    "魔法使ったろと思ったときもあったんやけどなぁ、そもそも毒が強いからなぁ、ワイ。",
    "血ぃ吸うたろか〜。なんてな。ついでに毒送り込んだるで。",
    ];
function talk(msg) {
    bot.createMessage(msg.channel.id, shuffleArray(sentence)[0]);
}

/** チームメンバーを発言します。 */
function sayTeamInfo(msg, data){
    data.teams.forEach(team => {
        let member_names = [];
        team.teamMembers.forEach(member => {
            member_names.push(member.name + "[" + member.role + "]");
        });
        bot.createMessage(msg.channel.id, "・" + team.teamName + ": " + member_names);
    });
    let reserver_names = [];
    data.reservers.forEach(reserver => {
        reserver_names.push(reserver.name);
    });
    bot.createMessage(msg.channel.id, "・控え: " + reserver_names);
}

/* ----------------------
 *  ユーティリティの類
 * ---------------------*/

function isNotReady(){
    if(matchId == null) return true;
    return false;
}

/** 発言者の名前を取得します。ニックネームを優先して採用します。 */
function getMessegeAuthorName(msg){
    let name = null;
    if(msg.member.nick == null){
        name = msg.member.username;
    } else {
        name = msg.member.nick;
    }
    return name;
}

/** 配列の順番をランダムに入れ替える via Fisher–Yates Algo. */
function shuffleArray(array){
    for (var i = array.length - 1; i >= 0; i--){
        // 0~iのランダムな数値を取得
        var rand = Math.floor( Math.random() * ( i + 1 ) );
        // 配列の数値を入れ替える
        [array[i], array[rand]] = [array[rand], array[i]]
      }
      return array;
}
