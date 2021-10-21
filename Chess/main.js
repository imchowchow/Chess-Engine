drawBoard();

var isWhite = true;
let board = new Board();

// board.createBoard("Q7/3K4/8/4q3/8/5k");
// board.createBoard("7k/3N2qp/b5r1/2p1Q1N1/Pp4PK/7P/1P3p2/6r1");
// board.createBoard("r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1");
// board.createBoard("8/8/6r1/R");
// board.createBoard("8/3r4/3b2B/2Q5/5kn");
board.createBoard(startFEN);
// board.createBoard("8/3K")

// console.log(board.board[0][0]);

$(document).ready(function () {
    var selectedPiece;

    $("#canvas").mousemove(function (event) {
        var xPos = parseInt(event.pageX - xOffset);
        var yPos = event.pageY - yOffset;
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

        // for (let file = 0; file < board.board.length; file++) {
        //     for (let rank = 0; rank < board.board[file].length; rank++) {
        //         if (board.getXPositions(file, rank).includes(xPos) && board.getYPositions(file, rank).includes(yPos)) {
        //             if (board.board[file][rank] != null && board.board[file][rank].color == ((isWhite) ? "White" : "Black")) {
        //                 $("#canvas").css('cursor', 'pointer');
        //                 break;
        //             } else {
        //                 if (selectedPiece != null && selectedPiece.moveLst[file][rank] == 1) {
        //                     $("#canvas").css('cursor', 'pointer');
        //                     break;
        //                 }
        //                 $("#canvas").css('cursor', 'default');
        //                 break;
        //             } 
        //         }
        //     }
        // }
    });

    $("#canvas").click(function (event) {
        var xPos = parseInt(event.pageX - xOffset);
        var yPos = event.pageY - yOffset;
        // console.log("Mouse pos: " + xPos + ", " + yPos);
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