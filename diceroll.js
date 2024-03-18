class DiceRoll {

    #num;//サイコロの数
    #dices; //サイコロ(Diceオブジェクト)の配列
    #jqRoot; //表示する場の要素
    #keepPlaces; //キープ状態の管理(1がkeepに対応)

    constructor(num, jqRoot) {
        this.#num = num;
        this.#jqRoot = jqRoot;

        this.#dices = [];
        for (let i = 0; i < num; i++) {
            this.#dices.push(new Dice(i));
        }

        this.#dices.forEach(elm => jqRoot.append(elm.element));

        this.#keepPlaces = Array(num).fill(0);
    }

    get dices() {
        return this.#dices;
    }

    get keepPlaces() {
        return this.#keepPlaces;
    }

    async animateDiceroll(times, interval) {
        let arr = [];
        for (let dice of this.#dices) {
            if (dice.isKeep) {
                arr.push(dice.diceNum);
            } else {
                arr.push(dice.animateDiceroll(times, interval));
            }
        }
        const val = await Promise.all(arr);
        return val;
    }

    //キープしているサイコロをすべて元に戻す
    offKeep() {
        for (let dice of this.#dices) {
            dice.isKeep = false;
            dice.element.removeClass("keep nth0 nth1 nth2 nth3 nth4");
            dice.resetKeepPlace();
        }
        this.#keepPlaces = Array(this.#num).fill(0);
    }
}