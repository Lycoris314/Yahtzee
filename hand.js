class Hand {

    static sumOfNum(result, n) {
        let score = 0;
        for (let i of result) {
            if (i == n) score += n;
        }
        return score;
    }

    static ACES = function (result) {
        return Hand.sumOfNum(result, 1);
    }

    static TWOS = function (result) {
        return Hand.sumOfNum(result, 2);
    }

    static THREES = function (result) {
        return Hand.sumOfNum(result, 3);
    }

    static FOURS = function (result) {
        return Hand.sumOfNum(result, 4);
    }

    static FIVES = function (result) {
        return Hand.sumOfNum(result, 5);
    }

    static SIXES = function (result) {
        return Hand.sumOfNum(result, 6);
    }


    static CHOICE = function (result) {
        return result.reduce((accum, val) => accum + val);
    }

    static countEach(result) {
        let arr = [];
        for (let i = 1; i <= 6; i++) {
            arr.push(result.filter(elm => elm === i).length)
        }
        return arr;
    }

    static FOURDICE = function (result) {
        if (Hand.countEach(result).filter(elm => elm >= 4).length > 0) {
            return result.reduce((accum, val) => accum + val);
        } else {
            return 0;
        }
    }


    static FULLHOUSE = function (result) {
        const count = Hand.countEach(result);
        //console.log(count);
        if (count.filter(elm => elm === 2).length > 0
            && count.filter(elm => elm === 3).length > 0) {
            return 25;
        } else {
            return 0;
        }

    }

    static S_STRAIGHT = function (result) {
        const count = Hand.countEach(result);
        if (count[0] * count[1] * count[2] * count[3]
            + count[1] * count[2] * count[3] * count[4]
            + count[2] * count[3] * count[4] * count[5] > 0) {
            return 30;
        } else {
            return 0;
        }
    }

    static B_STRAIGHT = function (result) {
        const count = Hand.countEach(result);
        if (count[1] * count[2] * count[3] * count[4] === 1) {
            return 40;
        } else {
            return 0;
        }
    }

    static YAHTZEE = function (result) {
        const count = Hand.countEach(result);
        if (count.filter(elm => elm === 5).length > 0) {
            return 50;
        } else {
            return 0;
        }
    }


}
