class ScoreTable {
    #playerScores = [];
    #bonus = [0, 0];

    static rules = [
        [Hand.ACES, "one"],
        [Hand.TWOS, "two"],
        [Hand.THREES, "three"],
        [Hand.FOURS, "four"],
        [Hand.FIVES, "five"],
        [Hand.SIXES, "six"],
        [Hand.CHOICE, "choice"],
        [Hand.FOURDICE, "fourdice"],
        [Hand.FULLHOUSE, "fullhouse"],
        [Hand.S_STRAIGHT, "s_straight"],
        [Hand.B_STRAIGHT, "b_straight"],
        [Hand.YAHTZEE, "yahtzee"]
    ]


    constructor() {
        for (let i = 1; i <= 2; i++) {
            let arr = [];
            for (let hand of ScoreTable.rules) {
                arr.push(new Score(hand[0], $(`tr.${hand[1]}>td:nth-of-type(${i})`)))
            }
            this.#playerScores.push(arr);
        }
    }

    calcTemporaryScores(turn, results) {

        const scores = this.#playerScores[turn];

        for (let score of scores) {

            score.viewTemporaryValue(results);
        }
    }

    get playerScores() {
        return this.#playerScores;
    }


    turnChange(turn) {

        function score(hand) {
            return Number($(`tr.${hand}>td:nth-of-type(${turn + 1})`).text())
        }

        const scores = this.#playerScores[turn];
        for (let score of scores) {
            score.deleteTemporaryValue();
            score.element.removeClass("clickable");
        }
        const sum =
            score("one") + score("two") + score("three")
            + score("four") + score("five") + score("six");

        //ボーナスの項
        let text = "";

        if (sum < 63) {
            text = sum + "/63" + "<br>" + "0";
        } else {
            text = sum + "/63" + "<br>" + "35";
            this.#bonus[turn] = 35;
        }
        $(`tr.bonus>td:nth-of-type(${turn + 1})`).html(text);

        //合計の項
        const sumAll = sum
            + score("choice") + score("fourdice") + score("fullhouse")
            + score("s_straight") + score("b_straight") + score("yahtzee")
            + this.#bonus[turn];

        $(`tr.sum>td:nth-of-type(${turn + 1})`).text(sumAll);

    }

    getSumScores() {
        let sumScores = [0, 0];

        for (let i = 0; i < 2; i++) {
            for (let score of this.#playerScores[i]) {
                sumScores[i] += Number(score.decidedScore);
            }
            sumScores[i] += this.#bonus[i];
        }
        return sumScores;
    }
}