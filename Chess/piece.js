class Piece {
    constructor(tile, color, piece) {
        this.tile = tile;
        this.color = color;
        this.piece = piece;


        this.file = parseInt(tile / 8, 10); // y
        this.rank = tile % 8; // x
        this.xPos = this.rank * tileWidth;
        this.yPos = this.file * tileHeight; 
        this.width = tileWidth;
        this.height = tileHeight;


        this.moveLst = [
            [0, 0, 0, 0, 0, 0, 0, 0], // put zeros so its easier to debug
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
    }

    setTile(tile) {
        this.tile = tile;
        this.file = parseInt(tile / 8, 10);
        this.rank = tile % 8;
        this.xPos = this.rank * tileWidth;
        this.yPos = this.file * tileHeight; 
    }

    static getColorTiles() {
        var out = [];
        var swtch = true;
        for (let x = 0; x < 64; x++) {
            if (swtch) {
                if (x % 2 == 0) {
                    out.push(x);
                } 
            } else{
                if (x % 2 != 0) {
                    out.push(x);
                }
            }

            if ((x + 1) % 8 == 0) {
                swtch = !swtch;
            }
        }
        return out;
    }
    
    deletePiece(tile) { // draws over piece
        var whiteTiles = Piece.getColorTiles();
        if (whiteTiles.includes(tile)){
            ctx.fillStyle = 'rgba(222,185,145,255)';
        }
        else {
            ctx.fillStyle = "rgba(138,73,42,255)";
        }
        ctx.fillRect(this.xPos, this.yPos, tileWidth, tileHeight);
    }

    addHorizontalMoves(board, tile, increase, edge) {
        let step = (increase > 0) ? tile : tile * -1;
        while (step <= edge) {
            let file = parseInt(Math.abs(step) / 8, 10);
            let rank = Math.abs(step) % 8;
            if (board.board[file][rank] === this) {
                this.moveLst[file][rank] = 1;
            } else if (board.board[file][rank] == null) {
                this.moveLst[file][rank] = 1;
            } else if (board.board[file][rank].color != this.color) {
                this.moveLst[file][rank] = 1;
                break;
            } else if (board.board[file][rank].color == this.color) {
                break;
            } else {
                this.moveLst[file][rank] = 0;
            }
            step += Math.abs(increase);
        }
    }
}

class King extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "K";
        this.pic = "Assets/White King.png";
        this.value = 99;
    }

    show() {
        const pic = document.getElementById(this.color + ' King');
        ctx.drawImage(pic, this.xPos - 138, this.yPos - 68, canvas.width / 2.14, canvas.height / 3.42); // x and y weird cuz canvas

    }
}

class Queen extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "Q";
        this.value = 9;
    }

    show() {
        const pic = document.getElementById(this.color + ' Queen');
        ctx.drawImage(pic, this.xPos - 140, this.yPos - 62, canvas.width / 2, canvas.height / 3.42); // x and y weird cuz canvas

    }
}

class Bishop extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "B";
        this.value = 3;
    }

    show() {
        const pic = document.getElementById(this.color + ' Bishop');
        ctx.drawImage(pic, this.xPos - 137, this.yPos - 62, canvas.width / 2.13, canvas.height / 3.42); // x and y weird cuz canvas

    }
}

class Knight extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "N";
        this.value = 3;
    }

    show() {
        const pic = document.getElementById(this.color + ' Knight');
        ctx.drawImage(pic, this.xPos - 137, this.yPos - 58, canvas.width / 2.13, canvas.height / 3.42); // x and y weird cuz canvas

    }
}

class Rook extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "R";
        this.value = 5;
        
    }

    show() {
        const pic = document.getElementById(this.color + ' Rook');
        ctx.drawImage(pic, this.xPos - 133, this.yPos - 61, canvas.width / 2.13, canvas.height / 3.42); // x and y weird cuz canvas

    }

    showMoves(board) {
        this.moves(board);
        board.changeColor()
    }

    moves(board) {
        this.moveLst = [ 
            [0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];

        let southEdge = ((totRows - this.file) * 8) + this.tile; // the end of the board for a direction from a specific square
        let northEdge = (this.tile % (8 * this.file)) * -1;
        let eastEdge = this.tile + (totRows - this.rank);
        let westEdge = (this.tile - this.rank) * -1;

        this.addHorizontalMoves(board, this.tile, 1, eastEdge);
        this.addHorizontalMoves(board, this.tile, -1, westEdge);
        this.addHorizontalMoves(board, this.tile, 8, southEdge);
        this.addHorizontalMoves(board, this.tile, -8, northEdge);
    }
}

class Pawn extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "R";
        this.value = 1;
    }

    show() {
        const pic = document.getElementById(this.color + ' Pawn');
        ctx.drawImage(pic, this.xPos - 133, this.yPos - 55, canvas.width / 2.13, canvas.height / 3.42); // x and y weird cuz canvas

    }
}