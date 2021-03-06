# 紅白Viperの使い方
## ▼ はじめに
この文書はDota2の紅白戦を支援するDiscord用PickupBot、通称「紅白Viper」の使い方を記載したものです。
ご利用の前にご確認ください。
## ▼ なにができるの？
紅白戦の参加メンバー管理、チーム振り分け、ポジション振り分け（1to5）を行います。

## ▼ コマンド一覧
コマンドはテキストチャット上で発言することで誰でも実行できます。
|#|コマンド名|ショートカット|説明|
|----|----|----|----|
|1|!ready|!r|紅白戦の準備を行います。
|2|!info|!i|紅白戦の状況を確認します。
|3|!entry|!e, !in|紅白戦に参加します。
|4|!leave|!l, !out|紅白戦から抜けます。
|5|!shuffle, !assign|!sh|紅白戦の参加者をRadiant, Dire, 控えに振り分けます。
|6|!start|-|紅白戦を開始します。また、紅白戦の情報がリセットされます。
|7|!talk|-|なんか喋ってくれるよ。

## ▼ 使い方を教えて！
### ・紅白戦を主催する場合
1. 紅白戦の準備をします。テキストチャット上で`!ready`と発言してください。
2. 参加者の状況を確認します。`!info`と発言してください。
3. 参加者を振り分けます。`!shuffle`と発言してください。
4. 紅白戦を開始します。`!start`と発言してください。

### ・紅白戦に参加する場合
1. 紅白戦が準備されていることを確認します。テキストチャット上で`!info`と発言してください。
2. マッチに参加します。`!entry`と発言してください。
3. 参加を取りやめる場合は`!leave`と発言してください。

## ▼ よくある（だろう）質問
### ・準備中のゲームがあるときに`!ready`したらどうなるの？
準備中のゲームがある場合、そのゲームが`!start`されるまで次のゲームは準備できません。  
まず`!start`してから`!ready`で紅白戦の準備してください。
### ・複数回`!shuffle`したらどうなるの？
チーム、控え、ポジションすべてが再度ランダムに入れ替えられます。
### ・参加メンバーが10人以上居るとき、`!shuffle`したらどうなるの？
各チームには規定の人数分だけ割り振られ、余りは控えに割り振られます。
### ・いつでも利用できるの？
紅白ViperのDiscord上のステータスが「オンライン」になっていれば利用可能です。  
現在α版調整中のため、常時稼働させておりません。ご了承ください。 
### ・不具合が発生したとき
現在α版調整中のため、不具合が発生することが多々あるかと思われます。  
上記一覧にあるコマンドを入力しても紅白Viperが反応しない場合、もしくは上手く稼働しなかった旨のメッセージが発せられた場合は、お手数ですがshino38までご連絡ください。
### ・どうしてViperなの？
にゃーん。
### ・どうして関西弁なの？
うにゃーん。

---
* 作成日：2017.12.29
* 最終更新日：2017.12.29
* 文責：shino38
