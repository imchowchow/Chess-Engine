drawBoard();


let board = new Board();
// board.loadFenString("k");
// board.createBoard("7k/3N2qp/b5r1/2p1Q1N1/Pp4PK/7P/1P3p2/6r1");
// board.createBoard("r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1");
board.createBoard(startFEN);

$(document).ready(function () {
    var selectedPiece;

    $("#canvas").mousemove(function(event) {
        var xPos = event.pageX;
        var yPos = event.pageY;
        for (let x = 0; x < board.board.length; x++) {
            if (board.board[x] != null) {
                if (board.getXPos(x).includes(xPos) && board.getYPos(x).includes(yPos)) {
                    $("#canvas").css('cursor', 'pointer');
                    break;
                } 
            } else {
                $("#canvas").css('cursor', 'default');
            }
        }
    });

    $("#canvas").click(function(event) {
        var xPos = event.pageX;
        var yPos = event.pageY;
        if (selectedPiece != null) {
            board.movePiece(selectedPiece, xPos, yPos);
            selectedPiece = null;  
        } else {
            selectedPiece = board.clickPiece(xPos, yPos);
        }        
    });
});