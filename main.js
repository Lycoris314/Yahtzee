$(() => {


    const MAX_ROLL_TIMES = 3; //各ターンに賽を振る回数の上限
    const DICES_NUM = 5; //賽の数
    let playersNum; //プレイヤー人数

    const jqRoot = $(".field");
    const diceRoll = new DiceRoll(DICES_NUM, jqRoot);
    let scoreTable;

    $("#form").on("submit", function (e) {
        e.preventDefault();

        $(".start").addClass("hidden");
        playersNum = Number($("#num").val());

        setHTML(playersNum);

        scoreTable = new ScoreTable(playersNum);

        $("p.desc").text(textA(0, 0));

        $(`td:nth-of-type(1)`).addClass("turn");

        temporaryScoreEvent(playersNum);

        document.onselectstart = () => false;
        document.onmousedown = () => false;

    })


    function setHTML(playersNum) {

        for (let i = 0; i < playersNum; i++) {
            const td = $("<th>").text(`${i + 1}P`);
            $("thead>tr").append(td);
        }

        function appendTd(hand, times) {
            for (let i = 0; i < times; i++) {
                const td = $("<td>").attr("data-hand", hand);
                $("." + hand).append(td);
            }
        }

        ["one", "two", "three", "four", "five", "six",
            "choice", "fourdice", "fullhouse",
            "s_straight", "b_straight", "yahtzee"]
            .forEach(hand => appendTd(hand, playersNum))

        for (let i = 0; i < playersNum; i++) {
            const td = $("<td>").text("0/63");
            $("." + "bonus").append(td);
        }
        for (let i = 0; i < playersNum; i++) {
            const td = $("<td>").text("0");
            $("." + "sum").append(td);
        }

    }


    //パラメータ群
    let inGame = true; //ゲーム中かどうか
    let player = 0; //誰の番か(0が1P,1が2P,...)
    let rollTimes = 0; //そのターン中にサイコロを振った回数
    let inAnimation = false;//ダイスロールアニメーション中か
    let keepPlaces = Array(DICES_NUM).fill(false); //各ダイスのキープ状態


    function textA(player, rollTimes) {
        return `${player + 1}Pのターンです。${rollTimes}/3回目`;
    }


    //ダイスロールボタンを押す
    $(".diceRoll").on("click", async () => {

        const results = diceRoll.animateDiceroll(20, 50);

        inAnimation = true;

        $(".diceRoll").attr("disabled", true);

        rollTimes += 1;

        $("p.desc").text(textA(player, rollTimes));

        const res = await results;

        scoreTable.calcTemporaryScores(player, res);

        //役が成立した場合のポップ
        function handText(res, map) {

            let handText = "";

            if (Hand.FOURDICE(res) > 0 &&
                !(map.get("fourdice").isDecided)) {
                handText = "フォーダイス！"
            }
            if (Hand.FULLHOUSE(res) > 0 &&
                !(map.get("fullhouse").isDecided)) {
                handText = "フルハウス！"
            }
            if (Hand.S_STRAIGHT(res) > 0 &&
                !(map.get("s_straight").isDecided)) {
                handText = "Sストレート！"
            }
            if (Hand.B_STRAIGHT(res) > 0 &&
                !(map.get("b_straight").isDecided)) {
                handText = "Bストレート！"
            }
            if (Hand.YAHTZEE(res) > 0 &&
                !(map.get("yahtzee").isDecided)) {
                handText = "ヨット！"
            }
            return handText;
        }

        const text = handText(res, scoreTable.playerScores[player]);
        if (text !== "") {
            $(".handText")
                .addClass("show").text(text);
            setTimeout(() => {
                $(".handText").removeClass("show");
            }, 2500)
        }

        $(".diceRoll").attr("disabled", false);

        inAnimation = false

        if (rollTimes >= MAX_ROLL_TIMES) {
            $(".diceRoll").attr("disabled", true);
        }
    })

    //テンポラリースコアを押す
    function temporaryScoreEvent(playersNum) {

        for (let i = 0; i < playersNum; i++) {

            $(`tbody td:nth-of-type(${i + 1})`).on("click", function () {

                if (!player === i) return;

                if (inAnimation) return;

                const hand = $(this).attr("data-hand");

                if (hand === undefined) return;//ボーナスはクリックできないように

                const score = scoreTable.playerScores[i].get(hand);

                if (score.isDecided) return;

                if (score.element.text() === "") return;



                score.click();
                scoreTable.turnChange(player);


                $(`td:nth-of-type(${player + 1})`).removeClass("turn");

                inGame =
                    Array.from(scoreTable.playerScores[playersNum - 1].values())
                        .map(score => score.isDecided).some(elm => !elm);

                if (!inGame) {
                    $(".diceRoll").attr("disabled", true);

                    //最終結果表示
                    const scores = scoreTable.getSumScores();

                    function desc_text(scores) {

                        if (scores.length === 1) {
                            return `お疲れ様でした。最終得点は${scores[0]}点です！`;
                        }

                        const max = Math.max(...scores);
                        if (scores.every(score => score === max)) {
                            return "引き分け！";
                        } else {
                            let winners = [];
                            scores.forEach((score, index) => {
                                if (score === max) {
                                    winners.push(index + 1);
                                }
                            })
                            let text = "";
                            winners.forEach(elm => {
                                text += (elm + "P ");
                            })
                            return text + "の勝ち！";
                        }
                    }

                    $("p.desc").text(desc_text(scores));
                }

                //ゲーム続行
                player = (player + 1) % playersNum; //次のプレイヤー

                $(`td:nth-of-type(${player + 1})`).addClass("turn");

                rollTimes = 0;

                $("p.desc").text(textA(player, 0));

                $(".diceRoll").attr("disabled", false);

                diceRoll.offKeep();
                keepPlaces = Array(DICES_NUM).fill(false);

            })
        }
    }


    //ダイスを押す
    $(".dice").on("click", function () {

        if (!inGame) return;
        if (rollTimes === 0) return;
        if (rollTimes >= MAX_ROLL_TIMES) return;
        if (inAnimation) return;

        const n = Number($(this).attr("data-place"));

        //キープゾーンの内、空いている最小の番号
        const index = keepPlaces.indexOf(false);

        const place = diceRoll.dices[n].toggleKeep(index);

        if (place >= 0) { //keepゾーンからもどした場合
            keepPlaces[place] = false;
            $(".diceRoll").attr("disabled", false);

        } else { //keepゾーンに移した場合
            keepPlaces[index] = true;

            if (keepPlaces.every(elm => elm === true)) {
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