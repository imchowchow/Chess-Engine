const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

class Board {
    constructor() {
        this.board = [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null]
        ];

        this.whitePieces = [];
        this.blackPieces = [];

        this.whiteKingTile;
        this.blackKingTile;
    }

    range(start, end) {
        var ans = [];
        for (let i = start; i <= end; i++) {
            ans.push(i);
        }
        return ans;
    }

    getXPositions(file, rank) { // returns a range of x values of a tile
        var piece = this.board[file][rank];
        if (piece != null) {
            return this.range(piece.xPos, piece.xPos + piece.width);
        } else {
            var start = rank * tileWidth;
            return this.range(start, start + tileWidth)
        }
    }

    getYPositions(file, rank) { // returns a range of y values of a tile
        var piece = this.board[file][rank];
        if (piece != null) {
            return this.range(piece.yPos, piece.yPos + piece.height);
        } else {
            var start = file * tileHeight;
            return this.range(start, start + tileWidth);
        }
    }

    changeColor(tile, piece) { // for when piece is selected
        var whiteTiles = Piece.getColorTiles();
        if (whiteTiles.includes(tile)) {
            ctx.fillStyle = 'rgba(221,136,44,255)';
        }
        else {
            ctx.fillStyle = "rgba(137,43,0,255)";
        }
        ctx.fillRect(piece.xPos, piece.yPos, tileWidth, tileHeight);
    }

    showMoves(moveLst, isWhite) {
        for (let x = 0; x < moveLst.length; x++) {
            var whiteTiles = Piece.getColorTiles();
            var file = parseInt(moveLst[x] / 8, 10); // y
            var rank = moveLst[x] % 8; // x
            if (whiteTiles.includes((8 * file) + rank)) {
                ctx.fillStyle = (isWhite) ? 'rgba(226,157,83,255)' : 'rgba(222,185,145,255)';
            }
            else {
                ctx.fillStyle = (isWhite) ? "rgba(183,64,9,255)" : "rgba(138,73,42,255)";
            }
            ctx.fillRect(this.getXPositions(file, rank)[0], this.getYPositions(file, rank)[0], tileWidth, tileHeight);

            let position = this.board[file][rank];

            if (position != null) {
                position.show();
            }
        }
    }

    isCheckMate(isWhite) {
        var count = 0;
        if (isWhite) {
            for (let x = 0; x < this.blackPieces.length; x++) {
                var piece = this.blackPieces[x]
                piece.moves(board);
                if (piece.piece == "K" && piece.moveLst.length == 0) {
                    count++;
                } else if (piece.moveLst.includes(piece.tile) && piece.moveLst.length == 1) {
                    count++;
                }
            }
            if (count == this.blackPieces.length) {
                return true;
            }
        } else {
            for (let x = 0; x < this.whitePieces.length; x++) {
                var piece = this.whitePieces[x]
                piece.moves(board);
                if (piece.piece == "K" && piece.moveLst.length == 0) {
                    count++;
                } else if (piece.moveLst.includes(piece.tile) && piece.moveLst.length == 1) {
                    count++;
                }
            }
            if (count == this.whitePieces.length) {
                return true;
            }
        }
        return false;
    }

    clickPiece(xPos, yPos, isWhite) {
        var color = (isWhite) ? "White" : "Black";
        for (let x = 0; x < 64; x++) {
            var file = parseInt(x / 8, 10);
            var rank = x % 8;
            if (this.board[file][rank] != null) {
                if (this.getXPositions(file, rank).includes(xPos) && this.getYPositions(file, rank).includes(yPos) && this.board[file][rank].color == color) {
                    var piece = this.board[file][rank];
                    piece.moves(this);
                    // console.log(piece.moveLst);
                    this.showMoves(piece.moveLst, true);
                    this.changeColor(x, piece);
                    piece.show();
                    this.board[file][rank] = null;
                    return piece;
                }
            }
        }
        return null;
    }

    clickMove(selectedPiece, xPos, yPos) { // returning 1 means nothing moves and 0 means it works properly
        for (let x = 0; x < selectedPiece.moveLst.length; x++) { // if object is returned its the new piece to move
            var newTile = selectedPiece.moveLst[x];
            var file = parseInt(newTile / 8, 10);
            var rank = newTile % 8;
            var isWhite = selectedPiece.color == "White";
            if (this.getXPositions(file, rank).includes(xPos) && this.getYPositions(file, rank).includes(yPos)) {
                this.showMoves(selectedPiece.moveLst, false);
                // selectedPiece.deletePiece(selectedPiece.tile);
                // if (selectedPiece.tile == newTile) { // returns 1 cuz it clicked itself
                //     this.board[file][rank] = selectedPiece;
                //     selectedPiece.show();
                //     return 1;
                // } else if (selectedPiece.piece == "K") {
                //     if (isWhite) { // resets king tile
                //         this.whiteKingTile = newTile;
                //     } else {
                //         this.blackKingTile = newTile;
                //     }
                //     if (Math.abs(selectedPiece.tile - newTile) == 2) { // checks for castling
                //         let rook = this.board[selectedPiece.whichRook[0]][selectedPiece.whichRook[1]];
                //         rook.deletePiece(rook.tile);
                //         if (rook.tile == 0 || rook.tile == 56) { // im lazy if I think of something better I will fix this
                //             rook.setTile(rook.tile + 3);
                //         } else {
                //             rook.setTile(rook.tile - 2);
                //         }
                //         rook.show();
                //         this.board[rook.file][rook.rank] = rook;
                //         this.board[selectedPiece.whichRook[0]][selectedPiece.whichRook[1]] = null;
                //     }
                // } else if (selectedPiece.piece == "P") {
                //     if (this.range(0, 7).includes(newTile) || this.range(56, 63).includes(newTile)) { // checks for promotion
                //         var pawn = selectedPiece;
                //         selectedPiece = new Queen(newTile, pawn.color);

                //         if (isWhite) { // needs to delete piece if promotion takes that
                //             var index = this.whitePieces.indexOf(pawn);
                //             this.whitePieces[index] = selectedPiece;
                //         } else {
                //             var index = this.blackPieces.indexOf(pawn);
                //             this.blackPieces[index] = selectedPiece;
                //         }
                //     } else {
                //         selectedPiece.movedTwice = Math.abs(selectedPiece.file - file) == 2; // checks for en passant
                //         if (Math.abs(selectedPiece.file - file) == 1 && Math.abs(selectedPiece.rank - rank) == 1 && this.board[file][rank] == null) {
                //             if (isWhite) {
                //                 var piece = this.board[file + 1][rank];
                //                 var index = this.blackPieces.indexOf(piece);
                //                 this.blackPieces.splice(index, 1);
                //                 piece.deletePiece(piece.tile);
                //                 this.board[file + 1][rank] = null;
                //             } else {
                //                 var piece = this.board[file - 1][rank];
                //                 var index = this.whitePieces.indexOf(piece);
                //                 this.whitePieces.splice(index, 1);
                //                 piece.deletePiece(piece.tile);
                //                 this.board[file - 1][rank] = null;
                //             }
                //         }
                //     }
                // }



                var out = this.movePiece(selectedPiece, newTile);
                if (out != null) {
                    return out;
                }

                
                return 0;
            } else {
                file = parseInt(yPos / tileHeight);
                rank = parseInt(xPos / tileWidth);
                this.showMoves(selectedPiece.moveLst, false);
                if (this.board[file][rank] != null && this.board[file][rank].color == selectedPiece.color) { // switches new piece to selected piece
                    this.board[selectedPiece.file][selectedPiece.rank] = selectedPiece;
                    selectedPiece.show();
                    var piece = this.board[file][rank];
                    piece.moves(this);
                    this.showMoves(piece.moveLst, true);
                    this.changeColor((file * 8) + rank, piece);
                    piece.show();
                    this.board[file][rank] = null;
                    return piece;
                }
            }
        }
        // for if click nothing
        this.board[selectedPiece.file][selectedPiece.rank] = selectedPiece;
        selectedPiece.show();
        return 1;
    }

    movePiece(piece, tile) {
        var file = parseInt(tile / 8, 10);
        var rank = tile % 8;
        var isWhite = piece.color == "White";
        piece.deletePiece(piece.tile);
        if (piece.tile == tile) { // returns 1 cuz it clicked itself
            this.board[file][rank] = piece;
            piece.show();
            return 1;
        } else if (piece.piece == "K") {
            if (isWhite) { // resets king tile
                this.whiteKingTile = tile;
            } else {
                this.blackKingTile = tile;
            }
            if (Math.abs(piece.tile - tile) == 2) { // checks for castling
                let rook = this.board[piece.whichRook[0]][piece.whichRook[1]];
                rook.deletePiece(rook.tile);
                if (rook.tile == 0 || rook.tile == 56) { // im lazy if I think of something better I will fix this
                    rook.setTile(rook.tile + 3);
                } else {
                    rook.setTile(rook.tile - 2);
                }
                rook.show();
                this.board[rook.file][rook.rank] = rook;
                this.board[piece.whichRook[0]][piece.whichRook[1]] = null;
            }
        } else if (piece.piece == "P") {
            if (this.range(0, 7).includes(tile) || this.range(56, 63).includes(tile)) { // checks for promotion
                var pawn = piece;
                piece = new Queen(tile, pawn.color);

                if (isWhite) { // needs to delete piece if promotion takes that
                    var index = this.whitePieces.indexOf(pawn);
                    this.whitePieces[index] = piece;
                } else {
                    var index = this.blackPieces.indexOf(pawn);
                    this.blackPieces[index] = piece;
                }
            } else {
                piece.movedTwice = Math.abs(piece.file - file) == 2; // checks for en passant
                if (Math.abs(piece.file - file) == 1 && Math.abs(piece.rank - rank) == 1 && this.board[file][rank] == null) {
                    if (isWhite) {
                        var newPiece = this.board[file + 1][rank];
                        var index = this.blackPieces.indexOf(newPiece);
                        this.blackPieces.splice(index, 1);
                        newPiece.deletePiece(newPiece.tile);
                        this.board[file + 1][rank] = null;
                    } else {
                        var newPiece = this.board[file - 1][rank];
                        var index = this.whitePieces.indexOf(newPiece);
                        this.whitePieces.splice(index, 1);
                        newPiece.deletePiece(newPiece.tile);
                        this.board[file - 1][rank] = null;
                    }
                }
            }
        }

        if (this.board[file][rank] != null) {
            if (this.board[file][rank].color == "White") {
                var index = this.whitePieces.indexOf(this.board[file][rank]);
                this.whitePieces.splice(index, 1)
            } else {
                var index = this.blackPieces.indexOf(this.board[file][rank]);
                this.blackPieces.splice(index, 1);
            }
        }

        this.board[piece.file][piece.rank] = null;
        piece.deletePiece(piece.tile);
        piece.setTile(tile);
        piece.deletePiece(tile);
        piece.show();
        piece.timesMoved++;
        this.board[file][rank] = piece;

        
        if (this.isCheckMate(isWhite)) {
            return 2;
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
                    if (letter == "k") {
                        let piece = new King(x, "Black");
                        this.blackKingTile = x;
                        this.board[file][rank] = piece;
                        this.blackPieces.push(piece)
                    } else {
                        let piece = new King(x, "White");
                        this.whiteKingTile = x;
                        this.board[file][rank] = piece;
                        this.whitePieces.push(piece)
                    }
                }
                else if (str.toLowerCase() == 'q') {
                    if (letter == "q") {
                        let piece = new Queen(x, "Black");
                        this.board[file][rank] = piece;
                        this.blackPieces.push(piece)
                    } else {
                        let piece = new Queen(x, "White");
                        this.board[file][rank] = piece;
                        this.whitePieces.push(piece)
                    }
                }
                else if (str.toLowerCase() == 'b') {
                    if (letter == "b") {
                        let piece = new Bishop(x, "Black");
                        this.board[file][rank] = piece;
                        this.blackPieces.push(piece)
                    } else {
                        let piece = new Bishop(x, "White");
                        this.board[file][rank] = piece;
                        this.whitePieces.push(piece)
                    }
                }
                else if (str.toLowerCase() == 'n') {
                    if (letter == "n") {
                        let piece = new Knight(x, "Black");
                        this.board[file][rank] = piece;
                        this.blackPieces.push(piece)
                    } else {
                        let piece = new Knight(x, "White");
                        this.board[file][rank] = piece;
                        this.whitePieces.push(piece)
                    }
                }
                else if (str.toLowerCase() == 'r') {
                    if (letter == "r") {
                        let piece = new Rook(x, "Black");
                        this.board[file][rank] = piece;
                        this.blackPieces.push(piece)
                    } else {
                        let piece = new Rook(x, "White");
                        this.board[file][rank] = piece;
                        this.whitePieces.push(piece)
                    }
                }
                else if (str.toLowerCase() == 'p') {
                    if (letter == "p") {
                        let piece = new Pawn(x, "Black");
                        this.board[file][rank] = piece;
                        this.blackPieces.push(piece)
                    } else {
                        let piece = new Pawn(x, "White");
                        this.board[file][rank] = piece;
                        this.whitePieces.push(piece)
                    }
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
        console.log(board.whitePieces)
        console.log(board.blackPieces)

        for (let file = 0; file < this.board.length; file++) {
            for (let rank = 0; rank < this.board[file].length; rank++) {
                if (this.board[file][rank] != null) {
                    this.board[file][rank].show();
                }
            }
        }
    }
}