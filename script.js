console.log("JavaScript Started");
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector(".rst-btn");
let winShow = document.querySelector(".win_container");
let compBtn = document.getElementById("comp");
let turn = true; // true for player, false for computer
let moves = 0;
let playWithComputer = false;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

function startGame() {
    boxes.forEach((box) => {
        box.addEventListener("click", handleBoxClick);
    });
}

function handleBoxClick(event) {
    const box = event.target;
    if (playWithComputer) {
        
        if (turn) {
            box.innerHTML = "X";
            box.style.color = "#5E0B15";
            box.disabled = true;
            turn = false;
            moves++;
            checkWinner();
            if (!turn && moves < 9) {
                setTimeout(computerMove, 50);
            }
        }
    } else {
        box.innerHTML = turn ? "X" : "O";
        box.style.color = turn ? "#5E0B15" : "#b0413e";
        box.disabled = true;
        turn = !turn;
        moves++;
        checkWinner();
    }
}

function computerMove() {
    let bestMove = findBestMove();
    if (bestMove !== -1) {
        makeMove(bestMove, "O");
    }
}

function findBestMove() {
    let bestVal = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerText === "") {
            boxes[i].innerText = "O";
            let moveVal = minimax(0, false);
            boxes[i].innerText = "";
            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

function minimax(depth, isMax) {
    let score = evaluate();
    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (isMovesLeft() === false) return 0;

    if (isMax) {
        let best = -Infinity;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerText === "") {
                boxes[i].innerText = "O";
                best = Math.max(best, minimax(depth + 1, !isMax));
                boxes[i].innerText = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerText === "") {
                boxes[i].innerText = "X";
                best = Math.min(best, minimax(depth + 1, !isMax));
                boxes[i].innerText = "";
            }
        }
        return best;
    }
}

function evaluate() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boxes[a].innerText === "O" && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
            return 10;
        }
        if (boxes[a].innerText === "X" && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
            return -10;
        }
    }
    return 0;
}

function isMovesLeft() {
    for (let box of boxes) {
        if (box.innerText === "") {
            return true;
        }
    }
    return false;
}

function makeMove(index, symbol) {
    boxes[index].innerHTML = symbol;
    boxes[index].style.color = "#b0413e";
    boxes[index].disabled = true;
    turn = true;
    moves++;
    checkWinner();
}

function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boxes[a].innerText && boxes[a].innerText === boxes[b].innerText && boxes[a].innerText === boxes[c].innerText) {
            showWinner(boxes[a].innerText);
            return;
        }
    }
    if (moves === 9) {
        showWinner("Draw");
    }
}

function showWinner(winner) {
    winShow.style.display = "flex";
    winShow.innerText = winner === "Draw" ? "It's a Draw!" : `Winner is ${winner}`;
    disableBoxes();
}

function disableBoxes() {
    boxes.forEach(box => box.disabled = true);
}

function enableBoxes() {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
    });
    turn = true;
    moves = 0;
    winShow.style.display = "none";
}

resetBtn.addEventListener("click", enableBoxes);
compBtn.addEventListener("click", () => {
    playWithComputer = true;
    enableBoxes();
    alert("Playing with computer")
});

startGame();
