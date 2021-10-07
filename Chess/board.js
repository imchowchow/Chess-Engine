const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

class Board {
    constructor() {
        this.board = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
    }

    range(start, end) {
        var ans = [];
        for (let i = start; i <= end; i++) {
            ans.push(i);
        }
        return ans;
    }

    getXPos(file, rank) {
        var piece = this.board[file][rank];
        if (piece != null) {
            return this.range(piece.xPos, piece.xPos + piece.width);
        } else {
            var start = rank * tileWidth
            return this.range(start, start + tileWidth)
        }
        
    }

    getYPos(file, rank) {
        var piece = this.board[file][rank];
        if (piece != null) {
            return this.range(piece.yPos, piece.yPos + piece.height);
        } else {
            var start = file * tileHeight;
            return this.range(start, start + tileWidth);
        }
        
    }

    changeColor(tile, piece) {
        var whiteTiles = Piece.getColorTiles();
        if (whiteTiles.includes(tile)){
            ctx.fillStyle = 'rgba(221,136,44,255)';
        }
        else {
            ctx.fillStyle = "rgba(137,43,0,255)";
        }
        ctx.fillRect(piece.xPos, piece.yPos, tileWidth, tileHeight);
    }

    clickPiece(xPos, yPos, isWhite) {
        var color = (isWhite) ? "White" : "Black";
        for (let x = 0; x < 64; x++) {
            var file = parseInt(x / 8, 10);
            var rank = x % 8;
            if (this.board[file][rank] != null) {
                if (this.getXPos(file, rank).includes(xPos) && this.getYPos(file, rank).includes(yPos) && this.board[file][rank].color == color) {
                    var piece = this.board[file][rank];
                    this.changeColor(x, piece);
                    piece.show();
                    this.board[file][rank] = null;
                    return piece;
                } 
            }
        }
        return null;
    }

    movePiece(selectedPiece, xPos, yPos) {
        for (let x = 0; x < 64; x++) {
            var file = parseInt(x / 8, 10);
            var rank = x % 8;
            if (this.getXPos(file, rank).includes(xPos) && this.getYPos(file, rank).includes(yPos)) {
                if (selectedPiece.tile == x) {
                    selectedPiece.deletePiece(selectedPiece.tile);
                    this.board[file][rank] = selectedPiece;
                    selectedPiece.show();
                    return null;
                }
                selectedPiece.deletePiece(selectedPiece.tile);
                selectedPiece.setTile(x);
                selectedPiece.deletePiece(x);
                selectedPiece.show();
                this.board[file][rank] = selectedPiece;
                return 0;
            }
        }  
    }

    loadFenString(fen) {
        let x = 0;
        Array.from(fen).forEach((str) => {
            if (isNaN(str)) {
                let letter = str;
                var file = parseInt(x / 8, 10);
                var rank = x % 8;
                if (str.toLowerCase() == 'k') {
                    this.board[file][rank] = (letter == 'k') ? new King(x, "Black") : new King(x, "White");
                }
                else if (str.toLowerCase() == 'q'){
                    this.board[file][rank] = (letter == 'q') ? new Queen(x, "Black") : new Queen(x, "White");
                }
                else if (str.toLowerCase() == 'b') {
                    this.board[file][rank] = (letter == 'b') ? new Bishop(x, "Black") : new Bishop(x, "White");
                }
                else if (str.toLowerCase() == 'n') {
                    this.board[file][rank] = (letter == 'n') ? new Knight(x, "Black") : new Knight(x, "White"); 
                }
                else if (str.toLowerCase() == 'r') {
                    this.board[file][rank] = (letter == 'r') ? new Rook(x, "Black") : new Rook(x, "White");
                }
                else if (str.toLowerCase() == 'p') {
                    this.board[file][rank] = (letter == 'p') ? new Pawn(x, "Black") : new Pawn(x, "White");
                }
                else {
                    this.board[file][rank] = null;
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
        console.log(this.board);

        for (let file = 0; file < this.board.length; file++) {
            for (let rank = 0; rank < this.board[file].length; rank++) {
                if (this.board[file][rank] != null) {
                    this.board[file][rank].show();
                }
            }
        }
    }
}

