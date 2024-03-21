class Hand {

    static sumOfNum(result, n) {
        return result.reduce((accum, current) =>
            accum + (current === n ? n : 0)
            , 0)
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
        return Hand.countEach(result).filter(elm => elm >= 4).length > 0 ?
            result.reduce((accum, val) => accum + val) : 0;
    }

    static FULLHOUSE = function (result) {
        const count = Hand.countEach(result);
        return (count.filter(elm => elm === 2).length > 0
            && count.filter(elm => elm === 3).length > 0) ? 25 : 0;
    }

    static S_STRAIGHT = function (result) {
        const count = Hand.countEach(result);
        return (count[0] * count[1] * count[2] * count[3]
            + count[1] * count[2] * count[3] * count[4]
            + count[2] * count[3] * count[4] * count[5] > 0) ? 30 : 0;
    }

    static B_STRAIGHT = function (result) {
        const count = Hand.countEach(result);
        return (count[1] * count[2] * count[3] * count[4] === 1) ? 40 : 0;
    }

    static YAHTZEE = function (result) {
        return (Hand.countEach(result).filter(elm => elm === 5).length > 0) ? 50 : 0
    }
}
