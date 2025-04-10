let delete_checkbox, board_size_box, success_number_box;
let successBoard, board, elements, turn;
let deleteFromHistoryON;
deleteFromHistoryON = false;
const history = [];
let successNum;
let boardSize;

function init() {
    console.log("init");
    turn = document.getElementById("turn");
    board = document.getElementById("board");
    successBoard = document.getElementById("success-board");

    turn.innerHTML = 1;
    board.innerHTML = "";
    successBoard.innerHTML = "";


    delete_checkbox = document.getElementById("delete-from-history");
    delete_checkbox.addEventListener('change', () => {
        deleteFromHistoryON = delete_checkbox.checked;
        // console.log('delete_checkbox state:', delete_checkbox.checked);
    });
    board_size_box = document.getElementById("board-size");
    board_size_box.addEventListener('change', () => {
        boardSize = Number(board_size_box.value);
        init();
    });
    success_number_box = document.getElementById("success-number");
    success_number_box.addEventListener('change', () => {
        successNum = Number(success_number_box.value);
    });

    boardSize = Number(board_size_box.value);
    successNum = Number(success_number_box.value);
    updateBoardSize();
}

function updateBoardSize() {
    board.innerHTML = "";
    elements = Array(boardSize).fill(null).map(() => Array(boardSize).fill(null)); // 2D array storage
    console.log(boardSize);
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    successBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            let element = document.createElement("button");
            element.classList.add("square");
            element.innerHTML = " ";
            element.onclick = function () {
                update(i, j, element, turn);
            }
            elements[i][j] = 0;
            board.appendChild(element);
        }
    }
    updateSuccessBoard();
}

function updateSuccessBoard() {
    successBoard.innerHTML = "";
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            let successElement = document.createElement("button");
            successElement.classList.add("square");
            successElement.innerHTML = elements[i][j];
            successBoard.appendChild(successElement);
        }
    }
}

function update(row, col, element, turn) {
    // console.log("click");
    if (!validCheck(element)) {
        return;
    }
    if (turn.innerHTML % 2 === 0) {
        // element.innerHTML = "X";
        let dot = document.createElement("div");
        dot.innerHTML = " ";
        dot.classList.add("dot-x");
        dot.id = `${row}${col}`;
        element.appendChild(dot);
        elements[row][col] = 1;
    } else {
        // element.innerHTML = "O"
        let dot = document.createElement("div");
        dot.innerHTML = " ";
        dot.classList.add("dot-o");
        dot.id = `${row}${col}`;
        element.appendChild(dot);
        elements[row][col] = -1;
    }
    history.push([row, col]);
    turn.innerHTML++;
    updateSuccessBoard();

    if (successCheck(row, col)) {
        setTimeout(() => {
            if (elements[row][col] === 1) {
                alert("Player X wins!");
            } else {
                alert("Player O wins!");
            }
            init(); // Reset inside the timeout
        }, 100);
        return 0;
    }

    if (fullCheck()) {
        // console.log("full");
        if (deleteFromHistoryON) {
            deleteFromHistory();
        }
        else {
            setTimeout(() => {
                alert("Draw");
            }, 100);
            init();
        }
    }


}


function deleteFromHistory() {
    console.log("delete");
    const [row, col] = history.shift();
    let dot = document.getElementById(`${row}${col}`);
    dot.parentNode.removeChild(dot);
    elements[row][col] = 0;
}

function validCheck(element) {
    return (element.children.length === 0);
}

function fullCheck() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (elements[i][j] === 0) {
                return 0;
            }
        }
    }
    return 1;
}
function successCheck(row, col) {
    const player = elements[row][col];
    if (player === 0) return 0;

    const directions = [
        [0, 1],   // →
        [1, 0],   // ↓
        [1, 1],   // ↘
        [1, -1]   // ↙
    ];

    for (const [dx, dy] of directions) {
        let count = 1;

        for (const dir of [-1, 1]) {
            let step = 1;
            while (true) {
                const r = row + dx * dir * step;
                const c = col + dy * dir * step;
                if (r < 0 || r >= boardSize || c < 0 || c >= boardSize) break;
                if (elements[r][c] !== player) break;
                count++;
                step++;
            }
        }

        if (count >= successNum) return 1;
    }

    return 0;
}


// UNDONE
// function successCheck(row, col) {
//     let success;

//     // row
//     success = 0;
//     for (let i = 0; i < boardSize; i++) {
//         for (let j = 0; j < boardSize; j++) {
//             success += elements[i][j];
//             if (success >= successNum || success <= -successNum) {
//                 return 1;
//             }
//             console.log(success);
//         }
//         success = 0;
//     }

//     // col
//     success = 0;
//     for (let j = 0; j < boardSize; j++) {
//         for (let i = 0; i < boardSize; i++) {
//             success += elements[i][j];
//             if (success >= successNum || success <= -successNum) {
//                 return 1;
//             }
//             console.log(success);
//         }
//         success = 0;
//     }
//     return 0;

//     // diagonal
// }
