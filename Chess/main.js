drawBoard();

var isWhite = true;
let board = new Board();
// board.loadFenString("k");
// board.createBoard("7k/3N2qp/b5r1/2p1Q1N1/Pp4PK/7P/1P3p2/6r1");
// board.createBoard("r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1");
board.createBoard("8/8/6r1/R");
// board.createBoard("8/3r4/8/8/3K");

// console.log(board.board[0][0]);

$(document).ready(function () {
    var selectedPiece;

    $("#canvas").mousemove(function(event) {
        var xPos = event.pageX;
        var yPos = event.pageY;
        for (let file = 0; file < board.board.length; file++) {
            for (let rank = 0; rank < board.board[file].length; rank++) {
                // console.log(board.board[file][rank]);
                if (board.board[file][rank] != null) {
                    if (board.getXPositions(file, rank).includes(xPos) && board.getYPositions(file, rank).includes(yPos)) {
                        $("#canvas").css('cursor', 'pointer');
                        break;
                    } 
                } else {
                    $("#canvas").css('cursor', 'default');
                }
            }
        }
    });

    $("#canvas").click(function(event) {
        // console.log(isWhite);
        var xPos = event.pageX;
        var yPos = event.pageY;
        if (selectedPiece != null) {
            let idk = board.movePiece(selectedPiece, xPos, yPos);
            if (idk == 0) {
                isWhite = !isWhite;
                selectedPiece = null;
            } else if (idk == 1) {
                selectedPiece = null;
            }
        } else {
            selectedPiece = board.clickPiece(xPos, yPos, isWhite);
        }        
    });
    // console.log(board.board[4][3].moves(board));
});