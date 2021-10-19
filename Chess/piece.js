class Piece {
    constructor(tile, color, piece) {
        this.tile = tile;
        this.color = color;
        this.piece = piece;
        this.timesMoved = 0;


        this.file = parseInt(tile / 8, 10); // y
        this.rank = tile % 8; // x
        this.xPos = this.rank * tileWidth;
        this.yPos = this.file * tileHeight;

        this.width = tileWidth;
        this.height = tileHeight;

        this.moveLst;
    }

    resetMoves() {
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
            } else {
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
        if (whiteTiles.includes(tile)) {
            ctx.fillStyle = 'rgba(222,185,145,255)';
        }
        else {
            ctx.fillStyle = "rgba(138,73,42,255)";
        }
        ctx.fillRect(this.xPos, this.yPos, tileWidth, tileHeight);
    }

    AddSlidingMoves(board, tile, increase, edge) {
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

    straightMoves(board) {
        let southEdge = ((totRows - this.file) * 8) + this.tile; // the end of the board for a direction from a specific square
        let northEdge = (this.tile % (8 * this.file)) * -1;
        let eastEdge = this.tile + (totRows - this.rank);
        let westEdge = (this.tile - this.rank) * -1;

        this.AddSlidingMoves(board, this.tile, 1, eastEdge);
        this.AddSlidingMoves(board, this.tile, -1, westEdge);
        this.AddSlidingMoves(board, this.tile, 8, southEdge);
        this.AddSlidingMoves(board, this.tile, -8, northEdge);
    }

    diagonalMoves(board) {
        let southWestEdge = this.tile + (Math.min(this.rank, totRows - this.file) * 7)
        let southEastEdge = this.tile + (Math.min(totRows - this.rank, totRows - this.file) * 9)
        let northWestEdge = (this.tile - (Math.min(this.rank, this.file) * 9)) * -1;
        let northEastEdge = (this.tile - (Math.min(totRows - this.rank, this.file) * 7)) * -1;

        this.AddSlidingMoves(board, this.tile, 7, southWestEdge);
        this.AddSlidingMoves(board, this.tile, 9, southEastEdge);
        this.AddSlidingMoves(board, this.tile, -9, northWestEdge);
        this.AddSlidingMoves(board, this.tile, -7, northEastEdge);
    }

    checkMoves(board, lst) {
        for (let x = 0; x < lst.length; x++) {
            let newTile = this.tile + lst[x];
            let file = parseInt(Math.abs(newTile) / 8, 10);
            let rank = Math.abs(newTile) % 8;
            if (newTile > 63 || newTile < 0 || Math.abs(this.rank - rank) > 2) { // last check so it doesnt wrap around ranks
                continue;
            }
            if (board.board[file][rank] === this) {
                this.moveLst[file][rank] = 1;
            } else if (board.board[file][rank] == null) {
                this.moveLst[file][rank] = 1;
            } else if (board.board[file][rank].color != this.color) {
                this.moveLst[file][rank] = 1;
            } else if (board.board[file][rank].color == this.color) {
                continue;
            } else {
                this.moveLst[file][rank] = 0;
            }
        }
    }
}

class King extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "K";
        this.pic = "Assets/White King.png";
        this.value = 99;

        this.check = false;
        this.whichRook; // im a bad programmer idk how else to decide which rook moves in a castle
        // this is my fix it will just send the index of which rook is moving
    }

    show() {
        const pic = document.getElementById(this.color + ' King');
        ctx.drawImage(pic, this.xPos - 138, this.yPos - 68, canvas.width / 2.14, canvas.height / 3.42); // x and y weird cuz canvas

    }

    canCastle(board) {
        let check = true;
        let indexes = (this.color == "White") ? [56, -63] : [0, -7];
        for (let x = 0; x < indexes.length; x++) {
            let file = parseInt(Math.abs(indexes[x]) / 8, 10);
            let rank = Math.abs(indexes[x]) % 8;
            check = true;
            if (board.board[file][rank] != null && board.board[file][rank].timesMoved == 0) {
                while (indexes[x] < ((x % 2 == 0) ? this.tile - 1 : -(this.tile + 1))) {
                    indexes[x]++;
                    file = parseInt(Math.abs(indexes[x]) / 8, 10);
                    rank = Math.abs(indexes[x]) % 8;
                    if (board.board[file][rank] != null) {
                        check = false;
                    }
                }
                if (check) {
                    rank = Math.abs(indexes[x]) % 8 + ((x % 2 == 0) ? -1 : + 1);
                    this.moveLst[this.file][rank] = 2;
                    let rookRank = rank + ((x % 2 == 0) ? -2 : 1);
                    this.whichRook = [this.file, rookRank];
                }
            }
        }
        console.log(this.moveLst);
    }

    moves(board) {
        super.resetMoves();
        this.increments = [0, 1, -1, 7, -7, 8, -8, 9, -9];
        super.checkMoves(board, this.increments);

        if (this.timesMoved == 0) {
            this.canCastle(board);
        }
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

    moves(board) {
        super.resetMoves();
        super.diagonalMoves(board);
        super.straightMoves(board);
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

    moves(board) {
        super.resetMoves();
        super.diagonalMoves(board);
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

    moves(board) {
        super.resetMoves();
        this.increments = [0, 10, -10, 17, -17, 15, -15, 6, -6];
        super.checkMoves(board, this.increments);
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

    moves(board) {
        super.resetMoves();
        super.straightMoves(board);
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

    moves(board) {
        // this code is really sloppy but its pawns and they suck so whatever
        super.resetMoves();
        this.increments = [];
        let isWhite = this.color == "White";

        this.increments.push();
        this.moveLst[this.file][this.rank] = 1;

        if (this.timesMoved == 0) {
            let newFile = this.file + ((isWhite) ? -2 : 2);
            let check = this.file + ((isWhite) ? -1 : 1);
            if (board.board[newFile][this.rank] == null && board.board[check][this.rank] == null) {
                this.moveLst[newFile][this.rank] = 1;
            }
        }

        let inFront = this.tile + ((isWhite) ? -8 : 8);
        let file = parseInt(Math.abs(inFront) / 8, 10);
        let rank = Math.abs(inFront) % 8;
        if (board.board[file][rank] == null) {
            this.moveLst[file][rank] = 1;
        }
        this.increments.push((isWhite) ? -7 : 7);
        this.increments.push((isWhite) ? -9 : 9);
        for (let x = 0; x < this.increments.length; x++) {
            let newTile = this.tile + this.increments[x];
            let file = parseInt(Math.abs(newTile) / 8, 10);
            let rank = Math.abs(newTile) % 8;
            if (board.board[file][rank] != null) {
                if (board.board[file][rank].color != this.color) {
                    this.moveLst[file][rank] = 1;
                }
            }
        }

        for (let x = 0; x < this.moveLst[0].length; x++) {
            if (this.moveLst[0][x] == 1) {
                this.moveLst[0][x] = 3;
            }
        }

        for (let x = 0; x < this.moveLst[7].length; x++) {
            if (this.moveLst[7][x] == 1) {
                this.moveLst[7][x] = 3;
            }
        }
    }
}