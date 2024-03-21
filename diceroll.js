class DiceRoll {

    #num;//サイコロの数
    #dices; //サイコロ(Diceオブジェクト)の配列
    #jqRoot; //表示する場の要素

    constructor(num, jqRoot) {
        this.#num = num;
        this.#jqRoot = jqRoot;

        this.#dices = [];
        for (let i = 0; i < num; i++) {
            this.#dices.push(new Dice(i));
        }

        this.#dices.forEach(elm => jqRoot.append(elm.element));
    }

    get dices() {
        return this.#dices;
    }

    async animateDiceroll(times, interval) {
        let arr = [];
        for (let dice of this.#dices) {

            arr.push(dice.isKeep ?
                dice.diceNum :
                dice.animateDiceroll(times, interval)
            )
        }
        return await Promise.all(arr);
    }

    //キープしているサイコロをすべて元に戻す
    offKeep() {
        this.#dices.forEach(dice => dice.resetKeepPlace());
    }
}