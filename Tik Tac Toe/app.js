let boxes = document.querySelectorAll(".box")
let resetbtn = document.querySelector("#resetbtn")
let newgamebtn = document.querySelector("#newgamebtn")
let winmsg = document.querySelector(".winmsg")
let msg = document.querySelector("#msg")
let turnO = true
let count = 0
winner = false

const winpatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O"
            box.classList.remove("turnx")
            box.classList.add("turno")
            turnO = false
        } else {
            box.innerText = "X"
            box.classList.remove("turno")
            box.classList.add("turnx")
            turnO = true
        }
        box.disabled = true
        count++
        if (count === 9) {
            drawgame()
        }
        checkwinner()
    })
});
const resetgame = () => {
    turnO = true
    enableboxes()
    winmsg.classList.add("hide")
    count = 0
}
const disableboxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
}
const enableboxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = ""
    }
}
const showwinner = (winner) => {
    msg.innerText = (`Congratulations, Winner is ${winner}`)
    winmsg.classList.remove("hide")
    disableboxes()
}
const drawgame = () => {
    msg.innerText = ("Game was a draw")
    winmsg.classList.remove("hide")
    disableboxes()
}
const checkwinner = () => {
    for (let pattern of winpatterns) {
        let val1 = boxes[pattern[0]].innerText
        let val2 = boxes[pattern[1]].innerText
        let val3 = boxes[pattern[2]].innerText

        if (val1 != "" && val2 != "" && val3 != "") {
            if (val1 === val2 && val2 === val3) {
                console.log("Winner", val1)
                showwinner(val1)
                winner = true
                return (val1)
            }
        }
    }
}
resetbtn.addEventListener("click", resetgame)
newgamebtn.addEventListener("click", resetgame)
window.addEventListener("DOMContentLoaded", function() {
    const audio = document.querySelector("#audio");
    audio.play();
});
