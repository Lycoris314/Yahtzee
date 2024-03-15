class Dice {
    static rootImgDirPath = "svg/";
    static diceImgs = [
        null,
        "6d1.svg",
        "6d2.svg",
        "6d3.svg",
        "6d4.svg",
        "6d5.svg",
        "6d6.svg",
    ]

    #diceNum = null;
    #element

    constructor() {
        this.#element = $("<img class='dice'>");
    }

    diceroll() {
        this.#diceNum = Math.floor(6 * Math.random()) + 1;
        this.#element.attr("src", Dice.rootImgDirPath + Dice.diceImgs[this.#diceNum]);
        return this.#diceNum;
    }

    get diceNum() {
        return this.#diceNum;
    }

    get element() {
        return this.#element
    }

    async animateDiceroll(times, interval) {

        const asyncRoll = (ms) => {

            return new Promise((resolve) => {

                setTimeout(() => {

                    let num = Math.floor(6 * Math.random()) + 1;

                    this.#element.attr("src", Dice.rootImgDirPath + Dice.diceImgs[num]);

                    resolve();
                }, ms);

            })
        }

        let arr = [];
        for (let i = 0; i < times; i++) {

            arr.push(asyncRoll(interval * i));
        }

        await Promise.all(arr);
        return this.diceroll();

    }
}