const Eris = require("eris");

// BOT_TOKEN は 自身が作成したBotの Bot token の文字を記述します。
const bot = new Eris("YOUR TOKEN");

bot.on("ready", () => {
    // bot が準備できたら呼び出されるイベントです。
    console.log("Ready!");
});

let matchId = null;

bot.on("messageCreate", (msg) => {
    // 誰かがメッセージ(チャット)を発言した時に呼び出されるイベントです。
    switch (msg.content){
        case "!ready":
            execute(ready, msg);
            break;
        case "!info":
            readyAndExecute(info, msg)
            break;
        case "!entry":
            readyAndExecute(entry, msg)
            break;
        case "!leave":
            readyAndExecute(leave, msg);            
            break;
        case "!assign":
            readyAndExecute(assign, msg);            
            break;
        case "!team":
            readyAndExecute(showTeams, msg);
            break;
        case "!start":
            if(isNotReady()){
                bot.createMessage(msg.channel.id, "なんや、準備ができてないな。段取りするから、[!ready]と入力してくれ。");  
            } else {   
                bot.createMessage(msg.channel.id, "ほな始めるで！"); 
            } 
            break;
        case "!close":
            if(isNotReady()){
                bot.createMessage(msg.channel.id, "なんや、準備ができてないな。段取りするから、[!ready]と入力してくれ。");  
            } else {   
                bot.createMessage(msg.channel.id, "おう、お疲れさん。またやろうな。");  
            }
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

/** マッチの準備をします。 */
function ready(msg) {
    bot.createMessage(msg.channel.id, "ほな、マッチの準備をするで〜。");    
    let createRequest = client.post(encodeURI(baseUrl + "matches/create"), function (data, response) {
        matchId = new Buffer(data).toString();
    });
    createRequest.on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });
}

/** マッチ情報を取得します。 */
function info(msg) {
    bot.createMessage(msg.channel.id, "よしよし、マッチ情報やな。よぉ聞いとれよ。");                            
    let req = client.get(encodeURI(baseUrl + "matches/{id}?matchId=" + matchId), function (data, response) {
        let reservers = data.reservers;
        bot.createMessage(msg.channel.id, "マッチID： " + data.matchId);
        bot.createMessage(msg.channel.id, "参加者：");
        reservers.forEach(reserver => {
            bot.createMessage(msg.channel.id, reserver.name);
        });
    });

    req.on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });
}

/** マッチに参加します */
function entry(msg) {
    let entryName = getMessegeAuthorName(msg);
    let entryReqest = client.put(encodeURI(baseUrl + "matches/{id}/members/{name}?matchId=" + matchId 
    + "&memberName=" + entryName), function (data, response) {
        bot.createMessage(msg.channel.id, "りょーかい、" + entryName + "はん。参加受け付けたで！");
    });
    entryReqest.on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });  
}

/** マッチから退出します */
function leave(msg) {
    let leaveName = getMessegeAuthorName(msg);
    let leaveReqest = client.delete(encodeURI(baseUrl + "matches/{id}/members/{name}?matchId=" + matchId 
    + "&memberName=" + leaveName), function (data, response) {
        bot.createMessage(msg.channel.id, "りょーかい、" + leaveName + "はん。マッチから抜けるで。");
    });
    leaveReqest.on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });  
}

/** チームを振り分けます */
function assign(msg) {
    let assignRequest = client.put(encodeURI(baseUrl + "matches/{id}/teams/assign?matchId=" + matchId), function (data, response) {
        bot.createMessage(msg.channel.id, "おーう、わかった。チーム分けするで。");
        showTeams(msg);
    });
    assignRequest.on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });  
}

/** チームを発表します。 */
function showTeams(msg) {
    let showTeamsRequest = client.get(encodeURI(baseUrl + "matches/{id}/teams?matchId=" + matchId), function (data, response) {
        bot.createMessage(msg.channel.id, "チームの発表や。");
        data.forEach(team => {
            bot.createMessage(msg.channel.id, team.teamName);
            team.teamMembers.forEach(member => {
                bot.createMessage(msg.channel.id, member.name);
            })
        });
        bot.createMessage(msg.channel.id, "以上！");
    });
    
    showTeamsRequest.on('error', function (err) {
        bot.createMessage(msg.channel.id, "すまん、上手く行かなんだ。");
    });  
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
