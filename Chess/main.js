drawBoard();

var isWhite = true;
let board = new Board();
var playing = false;

// board.createBoard("Q7/3K4/8/4q3/8/5k");
// board.createBoard("7k/3N2qp/b5r1/2p1Q1N1/Pp4PK/7P/1P3p2/6r1");
// board.createBoard("r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1");
// board.createBoard("8/8/6r1/R");
// board.createBoard("8/3r4/3b2B/2Q5/5kn");
board.createBoard(startFEN);
// board.createBoard("8/3K");

// console.log(board.board[0][0]);

$(document).ready(function () {
    var selectedPiece;
    var computer = new AI(board, "Black");
    var computer2 = new AI(board, "White");

    $("#canvas").mousemove(function (event) {
        var xPos = parseInt(event.pageX - xOffset);
        var yPos = event.pageY - yOffset;
        
        if (playing) {
            for (let x = 0; x < 63; x++) {
                var file = parseInt(x / 8, 10);
                var rank = x % 8;
                if (board.getXPositions(file, rank).includes(xPos) && board.getYPositions(file, rank).includes(yPos)) {
                    if (board.board[file][rank] != null && board.board[file][rank].color == ((isWhite) ? "White" : "Black")) {
                        $("#canvas").css('cursor', 'pointer');
                    } else if (selectedPiece != null && selectedPiece.moveLst.includes(x)) {
                        $("#canvas").css('cursor', 'pointer');
                    } else {
                        $("#canvas").css('cursor', 'default');
                    } 
                }
            }
        }
    });

    $("#canvas").click(function (event) {
        var xPos = parseInt(event.pageX - xOffset);
        var yPos = event.pageY - yOffset;
        // console.log("Mouse pos: " + xPos + ", " + yPos);
        // computer.chooseMove();
        // computer2.chooseMove();
        var startTime = performance.now();
        var depth = 2;
        var numPositions = computer.moveGenerationTest(depth, isWhite);
        var endTime = performance.now();
        console.log("Depth: " + depth + " Positions: " + numPositions + " Time : " + Math.round(endTime- startTime) + " milliseconds");
        if (playing) {
            if (selectedPiece != null) {
                let idk = board.clickMove(selectedPiece, xPos, yPos);
                if (idk == 0) {
                    isWhite = !isWhite;
                    selectedPiece = null;
                    // computer.chooseRandomMove();
                } else if (idk == 1) {
                    selectedPiece = null;
                } else if (idk == 2) {
                    alert("Checkmate!");
                    playing = false;
                } else if (idk != null) {
                    selectedPiece = idk;
                } 
            } else {
                selectedPiece = board.clickPiece(xPos, yPos, isWhite);
            }
        }
    });
});