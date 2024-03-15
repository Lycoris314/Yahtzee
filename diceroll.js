class DiceRoll {

    #num;
    #dices;
    #jqRoot;

    constructor(num, jqRoot) {
        this.#num = num;
        this.#jqRoot = jqRoot;

        this.#dices = new Array(num).fill(null).map(_ => new Dice());

        this.#dices.forEach(elm => jqRoot.append(elm.element));

    }

    diceroll() {
        let arr = [];
        for (let elm of this.#dices) {
            let pips = elm.diceroll();
            arr.push(pips);
        }
        return arr;
    }

    async animateDiceroll(times, interval) {
        let arr = [];
        for (let dice of this.#dices) {
            arr.push(dice.animateDiceroll(times, interval));
        }
        const val = await Promise.all(arr);
        return val;
    }
}