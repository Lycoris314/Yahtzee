class ScoreTable {
    #playerNum;
    #playerScores = [];
    #bonus;

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


    constructor(playerNum) {

        this.#playerNum = playerNum;

        this.#bonus = Array(playerNum).fill(0);

        for (let i = 1; i <= playerNum; i++) {

            let map = new Map();

            for (let hand of ScoreTable.rules) {
                map.set(hand[1], new Score(hand[0], $(`tr.${hand[1]}>td:nth-of-type(${i})`)))
            }
            this.#playerScores.push(map);
        }
    }

    calcTemporaryScores(turn, results) {

        const scores = this.#playerScores[turn];

        scores.forEach(score => score.viewTemporaryValue(results));
    }

    get playerScores() {
        return this.#playerScores;
    }


    turnChange(turn) {

        const scores = this.#playerScores[turn];

        function score(hand) {
            const re = scores.get(hand).decidedScore;
            return re === undefined ? 0 : re;
        }

        scores.forEach(score => {
            score.deleteTemporaryValue();
            score.element.removeClass("clickable");
        });

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
        let sumScores = Array(this.#playerNum).fill(0);

        for (let i = 0; i < this.#playerNum; i++) {

            this.#playerScores[i].forEach((score) => {
                sumScores[i] += score.decidedScore;
            })
            sumScores[i] += this.#bonus[i];
        }
        return sumScores;
    }
}