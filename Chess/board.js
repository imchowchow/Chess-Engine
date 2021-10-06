const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

class Board {
    constructor() {
        this.board = [];
    }

    range(start, end) {
        var ans = [];
        for (let i = start; i <= end; i++) {
            ans.push(i);
        }
        return ans;
    }

    getXPos(tile) {
        if (board[tile] != null) {
            return this.range(board[tile].xPos, board[tile].xPos + board[tile].width);
        } else {
            var start = tile % 8 * tileWidth
            return this.range(start, start + tileWidth)
        }
        
    }

    getYPos(tile) {
        if (board[tile] != null) {
            return this.range(board[tile].yPos, board[tile].yPos + board[tile].height);
        } else {
            var start = parseInt(tile / 8, 10) * tileHeight;
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

    clickPiece(xPos, yPos) {
        for (let x = 0; x < this.board.length; x++) {
            if (this.board[x] != null) {
                if (this.getXPos(x).includes(xPos) && this.getYPos(x).includes(yPos)) {
                    var piece = this.board[x];
                    this.changeColor(x, piece);
                    piece.show();
                    this.board[x] = null;
                    return piece;
                } 
            }
        }
        return null;
    }

    movePiece(selectedPiece, xPos, yPos) {
        for (let x = 0; x < this.board.length; x++) {
            if (this.getXPos(x).includes(xPos) && this.getYPos(x).includes(yPos)) {
                selectedPiece.deletePiece(selectedPiece.tile);
                selectedPiece.setTile(x);
                selectedPiece.deletePiece(x);
                selectedPiece.show();
                this.board[x] = selectedPiece;
                break;
            }
        }  
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

