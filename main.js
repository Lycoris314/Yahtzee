$(() => {
    document.onselectstart = () => false;
    document.onmousedown = () => false;

    const jqRoot = $(".field");
    const diceRoll = new DiceRoll(5, jqRoot);
    const scoreTable = new ScoreTable();

    //パラメータ群
    let inGame = true; //ゲーム中かどうか
    let totalTurn = 0; //経過したターン。全24ターン
    let player = 0; //誰の番か(0が1P,1が2P)
    let rollTimes = 0; //サイコロを振った回数
    let inAnimation = false;//ダイスロールアニメーション中か


    function textA(player, rollTimes) {
        return `${player + 1}Pのターンです。${rollTimes}/3回目`;
    }

    //開始時
    $("p.desc").text(textA(0, 0));

    $(`td:nth-of-type(1)`).addClass("turn");




    //ダイスロールボタンを押す
    $(".diceRoll").on("click", async () => {

        const results = diceRoll.animateDiceroll(20, 50);

        inAnimation = true;

        $(".diceRoll").attr("disabled", true);

        rollTimes += 1;

        $("p.desc").text(textA(player, rollTimes));

        const res = await results;

        scoreTable.calcTemporaryScores(player, res);

        //役が成立した場合の表示
        let handText = "";

        if (Hand.FOURDICE(res) > 0) {
            handText = "フォーダイス！"
        }
        if (Hand.FULLHOUSE(res) > 0) {
            handText = "フルハウス！"
        }
        if (Hand.S_STRAIGHT(res) > 0) {
            handText = "Sストレート！"
        }
        if (Hand.B_STRAIGHT(res) > 0) {
            handText = "Bストレート！"
        }
        if (Hand.YAHTZEE(res) > 0) {
            handText = "ヨット！"
        }
        if (handText !== "") {
            $(".handText")
                .addClass("show").text(handText);
            setTimeout(() => {
                $(".handText").removeClass("show");
            }, 2500)
        }

        $(".diceRoll").attr("disabled", false);

        inAnimation = false

        if (rollTimes > 2) {
            $(".diceRoll").attr("disabled", true);
        }
    })


    //テンポラリースコアを押す
    for (let i = 0; i < 2; i++) {
        $(`tbody td:nth-of-type(${i + 1})`).on("click", function () {

            if (!player === i) return;

            if (inAnimation) return;

            const hand = $(this).attr("data-hand");

            if (hand === undefined) return;//ボーナスはクリックできないように

            const score = scoreTable.playerScores[i].find(score => score.element.attr("data-hand") === hand);

            if (score.isDecided) return;

            if (score.element.text() === "") return;

            score.click();
            scoreTable.turnChange(player);

            totalTurn += 1;

            $(`td:nth-of-type(${player + 1})`).removeClass("turn");

            //ゲーム終了(24ターン経過)
            if (totalTurn >= 24) {
                inGame = false;
                $(".diceRoll").attr("disabled", true);

                //最終結果表示
                const scores = scoreTable.getSumScores();

                if (scores[0] > scores[1]) {
                    $("p.desc").text("ゲーム終了！1Pの勝ち！");
                } else if (scores[0] < scores[1]) {
                    $("p.desc").text("ゲーム終了！2Pの勝ち！");
                } else {
                    $("p.desc").text("引き分け！");
                }
                return;
            }

            //ゲーム続行
            player = (player + 1) % 2; //次のプレイヤー

            $(`td:nth-of-type(${player + 1})`).addClass("turn");

            rollTimes = 0;

            $("p.desc").text(textA(player, 0));

            $(".diceRoll").attr("disabled", false);

            diceRoll.offKeep();

        })
    }



    //ダイスを押す
    $(".dice").on("click", function () {

        if (!inGame) return;
        if (rollTimes === 0) return;
        if (rollTimes >= 3) return;
        if (inAnimation) return;

        const keepPlaces = diceRoll.keepPlaces

        const n = Number($(this).attr("data-place"));

        //キープゾーンの内、空いている最小の番号
        const index = keepPlaces.indexOf(0);

        const place = diceRoll.dices[n].toggleKeep(index);

        if (place >= 0) { //keepゾーンからもどした場合
            keepPlaces[place] = 0;
            $(".diceRoll").attr("disabled", false);

        } else { //keepゾーンに移した場合
            keepPlaces[index] = 1;

            if (keepPlaces.every(elm => elm === 1)) {
                $(".diceRoll").attr("disabled", true);
            }
        }
    })


    //ルールを表示・非表示
    $(".rule").on("click", () => {
        $(".ruleBack").toggleClass("show")
    })

    $(".ruleBack").on("click", function () {
        $(this).removeClass("show")

    })

    $(".ruleMain").on("click", (e) => {
        e.stopPropagation();
    })

})