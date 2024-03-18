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

    #diceNum = 1;
    #element;
    #place; //非キープゾーンでの位置 
    #isKeep = false;
    #keepPlace;//キープ状態の場合に、その位置

    constructor(place) {
        this.#place = place;
        this.#element = $("<img class='dice'>")
            .attr("src", Dice.rootImgDirPath + Dice.diceImgs[1])
            .addClass("place" + place)
            .attr("data-place", place);

    }

    diceroll() {
        this.#diceNum = Math.floor(6 * Math.random()) + 1;
        this.#element.attr("src", Dice.rootImgDirPath + Dice.diceImgs[this.#diceNum]);
        return this.#diceNum;
    }

    toggleKeep(index) {

        this.#isKeep = !this.#isKeep;
        this.#element.toggleClass("keep");

        //キープ状態にした場合
        if (this.#element.hasClass("keep")) {
            this.#element.addClass("nth" + index)
            this.#keepPlace = index;
            return -1;
            //キープ状態から外した場合
        } else {
            this.#element.removeClass("nth0 nth1 nth2 nth3 nth4");
            const place = this.#keepPlace;
            this.#keepPlace = null;
            return place
        }
    }

    get diceNum() {
        return this.#diceNum;
    }

    get element() {
        return this.#element
    }

    get isKeep() {
        return this.#isKeep
    }

    set isKeep(val) {
        this.#isKeep = val;
    }

    resetKeepPlace() {
        this.#keepPlace = null;
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