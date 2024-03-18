class Score {
    #checker
    #element
    #isDecided = false;
    #decidedScore
    #temporaryScore

    constructor(checker, element) {
        this.#checker = checker;
        this.#element = element;
        element.text("");
    }

    viewTemporaryValue(results) {
        if (this.#isDecided) return this.#decidedScore;

        this.#temporaryScore = this.#checker(results)
        this.#element.text(this.#temporaryScore);
        this.#element.addClass("clickable");
        return this.#temporaryScore;
    }

    deleteTemporaryValue() {
        this.#temporaryScore = null;
        if (!this.#isDecided) {
            this.#element.text("");
        }
    }

    click() {
        this.#isDecided = true;
        this.#element.addClass("decided");
        this.#decidedScore = this.#temporaryScore;
    }

    get element() {
        return this.#element;
    }

    get isDecided() {
        return this.#isDecided;
    }

    get decidedScore() {
        return this.#decidedScore;
    }
}