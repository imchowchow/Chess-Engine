drawBoard();

var isWhite = true;
let board = new Board();
board.board[2][1] = null;
// board.loadFenString("k");
// board.createBoard("7k/3N2qp/b5r1/2p1Q1N1/Pp4PK/7P/1P3p2/6r1");
// board.createBoard("r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1");
// board.createBoard("8/8/6r1/R");
// board.createBoard("8/3r4/3b2B/2Q5/5kn");
board.createBoard(startFEN);

// console.log(board.board[0][0]);

$(document).ready(function () {
    var selectedPiece;

    $("#canvas").mousemove(function (event) {
        var xPos = event.pageX;
        var yPos = event.pageY;
        for (let file = 0; file < board.board.length; file++) {
            for (let rank = 0; rank < board.board[file].length; rank++) {
                if (board.getXPositions(file, rank).includes(xPos) && board.getYPositions(file, rank).includes(yPos)) {
                    // console.log(board.board[file][rank]);
                    if (board.board[file][rank] != null && board.board[file][rank].color == ((isWhite) ? "White" : "Black")) {
                        $("#canvas").css('cursor', 'pointer');
                        break;
                    } else {
                        if (selectedPiece != null && selectedPiece.moveLst[file][rank] == 1) {
                            $("#canvas").css('cursor', 'pointer');
                            break;
                        }
                        $("#canvas").css('cursor', 'default');
                        break;
                    }
                }
            }
        }
    });

    $("#canvas").click(function (event) {
        var xPos = event.pageX;
        var yPos = event.pageY;
        if (selectedPiece != null) {
            let idk = board.movePiece(selectedPiece, xPos, yPos);
            if (idk == 0) {
                isWhite = !isWhite;
                selectedPiece = null;
            } else if (idk == 1) {
                selectedPiece = null;
            } else if (idk != null) {
                selectedPiece = idk;
            }
        } else {
            selectedPiece = board.clickPiece(xPos, yPos, isWhite);
        }
    });
});