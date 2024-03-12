class DiceRoll {

    #num;
    #dices;
    #jqRoot;

    constructor(num, jqRoot) {
        this.#num = num;
        this.#jqRoot = jqRoot;

        this.#dices = new Array(num).fill(null).map(e => new Dice());

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

    animateDiceroll(times, interval) {
        let arr = [];
        for (let dice of this.#dices) {
            arr.push(dice.animateDiceroll(times, interval));
        }
        return Promise.all(arr).then((val) => {
            return val;
        })
    }
}