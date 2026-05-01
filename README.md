# MinaServer Bot

> [!Note]
> ESLint Setup
> ```
> npm init -y
> npm install --save-dev eslint
> npx eslint --init```
### AWS Setup
**ステップ1：AWSアカウントの作成**
<ol type="1">
<li>AWS公式サイトの「今すぐ無料サインアップ」から登録。</li>
<li>クレジットカード登録が必要です（無料枠内なら請求されませんが、本人確認用です）。</li>
<li>サポートプランは「ベーシック（無料）」を選択してください。</li>
</ol>

**ステップ2：EC2インスタンス（サーバー）を立てる**
<ol type="1">
<li>画面左上の検索窓に「EC2」と入力し、サービス画面へ移動します。</li>
<li>「インスタンスを起動」というオレンジ色のボタンをクリックします。</li>
<li>名前: Discord-Bot など（自分がわかる名前）。</li>
<li>OS (AMI): デフォルトの Amazon Linux 2023 AMI のままでOK。</li>
<li>インスタンスタイプ: t2.micro（「無料利用枠の対象」と表示されているはずです）。</li>
<li>キーペア: 「新しいキーペアの作成」を押します。</li>
<li>キーペア名: discord-bot-key</li>
<li>キーペアのタイプ: RSA</li>
<li>プライベートキーファイル形式: .pem (Mac/Linux/Windows10以降)</li>
<li>「キーペアを作成」を押すとファイルがダウンロードされます。これはサーバーに入るための「唯一の鍵」なので、絶対に消さないでください。</li>
<li>ネットワーク設定: 「SSHトラフィックを許可」にチェックが入っていることを確認。</li>
<li>右下の「インスタンスを起動」をクリック。</li>
</ol>

**ステップ3：サーバーに接続する準備**<br>
インスタンス一覧画面に戻り、ステータスが「実行中」になったら、そのインスタンスを選択します。<br>
画面下の詳細タブにある**「パブリック IPv4 アドレス」**（例: 54.123.45.67）をコピーする。<br><br>

**ステップ4：Dockerをインストールする**<br>
手元のPCのターミナル（WindowsならPowerShellやコマンドプロンプト）を開き、先ほどダウンロードした .pem ファイルがあるフォルダに移動して、以下のコマンドを打ちます。

```
# 1. サーバーにログイン (IP部分は自分のものに書き換えてください)
ssh -i "discord-bot-key.pem" ec2-user@あなたのパブリックIPv4アドレス

# 2. ログインできたら、Dockerをインストール
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# 3. ec2-userでもsudoなしでdockerを使えるようにする
sudo usermod -aG docker ec2-user
```
> [!IMPORTANT]
> usermod を実行した後は、一度 exit でログアウトし、もう一度 ssh でログインし直すと設定が反映されます。

**ステップ5：Gitをインストールする**
```
sudo dnf install git -y
```

**ステップ6：Botを起動する**
```
# 1. コードをダウンロードする
git clone https://github.com/GitHubのユーザーネーム/リポジトリ名.git
cd リポジトリ名

# 2. 環境変数の作成
nano .env
# ※ここに DISCORD_BOT_TOKEN=あなたのトークン などを書き込んで保存（Ctrl+O -> Enter -> Ctrl+X）。

# 3. Dockerビルドと実行
docker build -t 名前1(小文字英数字) .
docker run -d --name 名前2(小文字英数字) --env-file .env 上で名付けた名前1
```

> [!Note]
> 各種Dockerコマンド
> ```
> # ※ssh でdockerに入ったのちに以下を実行
> ssh -i "discord-bot-key.pem" ec2-user@あなたのパブリックIPv4アドレス
>
> # ログを表示
> docker logs 上で名付けた名前2
> 
> # 停止
> docker stop 上で名付けた名前2
>
> # 消去
> docker rm 上で名付けた名前2
>
> # 再起動
> docker restart 上で名付けた名前2
> ```
> 更新するには......
> ```
> cd リポジトリ名
> docker stop 上で名付けた名前2
> docker rm 上で名付けた名前2
> git pull https://github.com/GitHubのユーザーネーム/リポジトリ名.git
> docker build -t 上で名付けた名前1 .
> docker run -d --name 上で名付けた名前2 --env-file .env 上で名付けた名前1
> ```
