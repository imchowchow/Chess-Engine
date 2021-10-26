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

        this.moveLst = [];
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
            var tile = Math.abs(step);
            let file = parseInt(tile / 8, 10);
            let rank = tile % 8;
            if (board.board[file][rank] === this) {
                this.moveLst.push(tile); // this.moveLst[file][rank] = 1;
            } else if (board.board[file][rank] == null) {
                this.moveLst.push(tile);
            } else if (board.board[file][rank].color != this.color) {
                this.moveLst.push(tile);
                break;
            } else if (board.board[file][rank].color == this.color) {
                break;
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

    addMoves(board, lst) {
        for (let x = 0; x < lst.length; x++) {
            let newTile = this.tile + lst[x];
            let file = parseInt(Math.abs(newTile) / 8, 10);
            let rank = Math.abs(newTile) % 8;
            if (newTile > 63 || newTile < 0 || Math.abs(this.rank - rank) > 2) { // last check so it doesnt wrap around ranks
                continue;
            }
            if (board.board[file][rank] === this) {
                this.moveLst.push(newTile); // this.moveLst[file][rank] = 1;
            } else if (board.board[file][rank] == null) {
                this.moveLst.push(newTile);
            } else if (board.board[file][rank].color != this.color) {
                this.moveLst.push(newTile);
            }
        }
    }

    addLegalMoves(board) {
        var testBoard = new Board();
        testBoard.whiteKingTile = board.whiteKingTile;
        testBoard.blackKingTile = board.blackKingTile;
        var isWhite = this.color == "White";
        var testForCheck = false;
        let start = (this.piece == "K") ? 0 : 1; // just so ik if king is in check.
        for (let x = start; x < this.moveLst.length; x++) {
            testBoard.board = board.board.map(function (arr) {
                return arr.slice();
            });
            testBoard.board[this.file][this.rank] = null;
            var newTile = this.moveLst[x];
            var file = parseInt(newTile / 8, 10);
            var rank = newTile % 8;
            testBoard.board[file][rank] = this;
            var lst = (isWhite) ? board.blackPieces : board.whitePieces;
            var check = 0;
            if (this.piece == "K") {
                if (isWhite) {
                    testBoard.whiteKingTile = newTile;
                } else {
                    testBoard.blackKingTile = newTile;
                }
            }
            while (check < lst.length) {
                lst[check].pseudoMoves(testBoard);
                var kingTile = (isWhite) ? testBoard.whiteKingTile : testBoard.blackKingTile;
                if (lst[check].moveLst.includes(kingTile) && lst[check].tile != newTile) {
                    if (lst[check].moveLst.includes((isWhite) ? board.whiteKingTile : board.blackKingTile)) {
                        testForCheck = true;
                    }
                    delete this.moveLst[x];
                    // delete keeps length same so the entire function can run
                    // but it adds empty cells so I remove them below
                    check = 99;
                }
                check++;
            }
        }
        if (this.piece == "K") {
            this.check = testForCheck;
        }
        this.moveLst = this.moveLst.filter(function () { return true }); // remove empty cells from the delete thing
    }
}

class King extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "K";
        this.value = 99;
        this.check = false;


        this.whichRook; // im a bad programmer idk how else to decide which rook moves in a castle
        // this is my fix it will just send the index of which rook is moving
    }

    show() {
        const pic = document.getElementById(this.color + ' King');
        ctx.drawImage(pic, this.xPos - (canvas.width / 5.797), this.yPos - (canvas.height / 11.764), canvas.width / 2.14, canvas.height / 3.42); // x and y weird cuz canvas

    }

    canCastle(board) {
        if (this.check) {
            return false;
        }
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
                    // this.moveLst[this.file][rank] = 2;
                    this.moveLst.push((this.file * 8) + rank);
                    let rookRank = rank + ((x % 2 == 0) ? -2 : 1);
                    this.whichRook = [this.file, rookRank];
                }
            }
        }
        // console.log(this.moveLst);
    }

    pseudoMoves(board) {
        this.moveLst = [];
        var increments = [0, 1, -1, 7, -7, 8, -8, 9, -9];
        super.addMoves(board, increments);

        if (this.timesMoved == 0) {
            this.canCastle(board);
        }
    }

    moves(board) {
        this.pseudoMoves(board);
        super.addLegalMoves(board);
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
        ctx.drawImage(pic, this.xPos - (canvas.width / 5.714), this.yPos - (canvas.height / 12.9), canvas.width / 2, canvas.height / 3.42); // x and y weird cuz canvas

    }

    pseudoMoves(board) {
        this.moveLst = [];
        super.diagonalMoves(board);
        super.straightMoves(board);
    }

    moves(board) {
        this.pseudoMoves(board);
        super.addLegalMoves(board);

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
        ctx.drawImage(pic, this.xPos - (canvas.width / 5.83), this.yPos - (canvas.height / 12.9), canvas.width / 2.13, canvas.height / 3.42); // x and y weird cuz canvas

    }

    pseudoMoves(board) {
        this.moveLst = [];
        super.diagonalMoves(board);
    }

    moves(board) {
        this.pseudoMoves(board);
        this.addLegalMoves(board);

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
        ctx.drawImage(pic, this.xPos - (canvas.width / 5.83), this.yPos - (canvas.height / 13.79), canvas.width / 2.13, canvas.height / 3.42); // x and y weird cuz canvas

    }

    pseudoMoves(board) {
        this.moveLst = [];
        var increments = [0, 10, -10, 17, -17, 15, -15, 6, -6];
        super.addMoves(board, increments);
    }

    moves(board) {
        this.pseudoMoves(board);
        super.addLegalMoves(board);
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
        ctx.drawImage(pic, this.xPos - (canvas.width / 6), this.yPos - (canvas.height / 13.11), canvas.width / 2.13, canvas.height / 3.42); // x and y weird cuz canvas

    }

    pseudoMoves(board) {
        this.moveLst = [];
        super.straightMoves(board);
    }

    moves(board) {
        this.pseudoMoves(board);
        super.addLegalMoves(board);

    }
}

class Pawn extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "P";
        this.value = 1;

        this.movedTwice = false;
    }

    show() {
        const pic = document.getElementById(this.color + ' Pawn');
        ctx.drawImage(pic, this.xPos - (canvas.width / 6), this.yPos - (canvas.height / 14.54), canvas.width / 2.13, canvas.height / 3.42); // x and y weird cuz canvas

    }

    pseudoMoves(board) {
        // this code is really sloppy but its pawns and they suck so whatever
        this.moveLst = [];
        var increments = [];
        let isWhite = this.color == "White";

        // this.moveLst[this.file][this.rank] = 1;
        this.moveLst.push(this.tile);

        if (this.timesMoved == 0) {
            let newFile = this.file + ((isWhite) ? -2 : 2);
            let check = this.file + ((isWhite) ? -1 : 1);
            if (board.board[newFile][this.rank] == null && board.board[check][this.rank] == null) {
                this.moveLst.push((newFile * 8) + this.rank);
                // I do this everywhere because it was originally structured differently and I was lazy
                // I should change this later but for now it works
            }
        }

        let inFront = this.tile + ((isWhite) ? -8 : 8);
        let file = parseInt(Math.abs(inFront) / 8, 10);
        let rank = Math.abs(inFront) % 8;
        if (board.board[file][rank] == null) {
            this.moveLst.push((file * 8) + rank);
        }
        increments.push((isWhite) ? -7 : 7);
        increments.push((isWhite) ? -9 : 9);
        for (let x = 0; x < increments.length; x++) {
            let newTile = this.tile + increments[x];
            let file = parseInt(Math.abs(newTile) / 8, 10);
            let rank = Math.abs(newTile) % 8;
            if (board.board[file][rank] != null && Math.abs(rank - this.rank) < 2) {
                if (board.board[file][rank].color != this.color) {
                    this.moveLst.push((file * 8) + rank);
                }
            }
        }

        // en passant is bad and weird and edge case therefore the code will be bad and weird
        increments = [1, -1];
        for (let x = 0; x < increments.length; x++) {
            var piece = board.board[this.file][this.rank + increments[x]];
            if (piece != null && piece.piece == "P"  && piece.color != this.color && piece.movedTwice) {
                file = this.file + ((isWhite) ? -1 : 1);
                rank = piece.rank;
                this.moveLst.push((file * 8) + rank);
            }
        }
    }

    moves(board) {
        this.pseudoMoves(board);
        super.addLegalMoves(board);

    }
}