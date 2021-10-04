const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

class Board {
    constructor() {
        this.board = [];
        // this.board[0] = new King(63, "White");
        // this.board[1] = new Queen(60, "White");
        // this.board[2] = new Bishop(10, "White");
        // this.board[3] = new Knight(12, "White");
        // this.board[4] = new Rook(25, "White");
        // this.board[5] = new Pawn(19, "White");
        // this.board[6] = new King(15, "Black");
        // this.board[7] = new Queen(30, "Black");
        // this.board[8] = new Bishop(43, "Black");
        // this.board[9] = new Knight(53, "Black");
        // this.board[10] = new Rook(46, "Black");
        // this.board[11] = new Pawn(32, "Black");
    }

    loadFenString(fen) {
        let x = 0;
        Array.from(fen).forEach((str) => {
            if (isNaN(str)) {
                let letter = str;
                if (str.toLowerCase() == 'k') {
                    this.board[x] = (letter == 'k') ? new King(x, "Black") : new King(x, "White");
                }
                else if (str.toLowerCase() == 'q'){
                    this.board[x] = (letter == 'q') ? new Queen(x, "Black") : new Queen(x, "White");
                }
                else if (str.toLowerCase() == 'b') {
                    this.board[x] = (letter == 'b') ? new Bishop(x, "Black") : new Bishop(x, "White");
                }
                else if (str.toLowerCase() == 'n') {
                    this.board[x] = (letter == 'n') ? new Knight(x, "Black") : new Knight(x, "White"); 
                }
                else if (str.toLowerCase() == 'r') {
                    this.board[x] = (letter == 'r') ? new Rook(x, "Black") : new Rook(x, "White");
                }
                else if (str.toLowerCase() == 'p') {
                    this.board[x] = (letter == 'p') ? new Pawn(x, "Black") : new Pawn(x, "White");
                }
                else {
                    this.board[x] = null;
                }
                if (str == '/') {
                    x--;
                }
                x++;
            } 
            else {
                x += parseInt(str);
            }
        });
    }

    createBoard(fen) {
        this.loadFenString(fen);
        console.log(board);

        for (let x = 0; x < this.board.length; x++) {
            if (this.board[x] != null) {
                this.board[x].show();
            }
        }
    }
}

let board = new Board();
// board.loadFenString("k");
// board.createBoard("7k/3N2qp/b5r1/2p1Q1N1/Pp4PK/7P/1P3p2/6r1");
board.createBoard("r1b1k1nr/p2p1pNp/n2B4/1p1NP2P/6P1/3P1Q2/P1P1K3/q5b1.");