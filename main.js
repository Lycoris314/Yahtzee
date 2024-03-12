$(() => {

    $(".form1").on("submit", (e) => {
        e.preventDefault();
        const num = Number($(".number1").val());

        const jqRoot = $(".outcomeImgs1");
        jqRoot.empty();
        const diceRoll = new DiceRoll(num, jqRoot);

        if ($("#check1").prop("checked")) {

            diceRoll.animateDiceroll(20, 50).then((outcome) => {

                $("p.outcome1").text(num + "d6" + " = [" + outcome + "]");
            })
        } else {
            const outcome = diceRoll.diceroll();
            $("p.outcome1").text(num + "d6" + " = [" + outcome + "]");
        }
    })


    $(".form2").on("submit", (e) => {
        e.preventDefault();
        const num = Number($(".number2").val());

        const jqRoot = $(".outcomeImgs2");
        jqRoot.empty();
        const diceRoll = new DiceRoll(num, jqRoot);

        if ($("#check2").prop("checked")) {

            diceRoll.animateDiceroll(20, 50).then((outcome) => {

                $("p.outcome2").text(num + "d6" + " = [" + outcome + "]");
            })
        } else {
            const outcome = diceRoll.diceroll();
            $("p.outcome2").text(num + "d6" + " = [" + outcome + "]");
        }
    })

})