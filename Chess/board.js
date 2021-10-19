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

    showMoves(moveLst, test) {
        for (let file = 0; file < moveLst.length; file++) {
            for (let rank = 0; rank < moveLst[file].length; rank++) {
                let position = this.board[file][rank];
                if (moveLst[file][rank] == 1 || moveLst[file][rank] == 2 || moveLst[file][rank] == 3) {
                    var whiteTiles = Piece.getColorTiles();
                    if (whiteTiles.includes((8 * file) + rank)) {
                        ctx.fillStyle = (test) ? 'rgba(226,157,83,255)' : 'rgba(222,185,145,255)';
                    }
                    else {
                        ctx.fillStyle = (test) ? "rgba(183,64,9,255)" : "rgba(138,73,42,255)";
                    }
                    ctx.fillRect(this.getXPositions(file, rank)[0], this.getYPositions(file, rank)[0], tileWidth, tileHeight);
                    if (position != null) {
                        position.show();
                    }
                }
            }
        }
    }

    // checkForCheck() {
    //     for (let x = 0; x < this.whitePieces.length; x++) {
    //         let test = this.whitePieces.concat(this.blackPieces);
    //         let piece = test[x];
    //         piece.moves(board);
    //         for (let file = 0; file < piece.moveLst.length; file++) {
    //             for (let rank = 0; rank < piece.moveLst[file].length; rank++) {
    //                 if (piece.moveLst[file][rank] == 1 && this.board[file][rank] != null && piece.piece != "K") {
    //                     if (this.board[file][rank].piece == "K") {
    //                         alert("check!");
    //                         return true;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    clickPiece(xPos, yPos, isWhite) {
        var color = (isWhite) ? "White" : "Black";
        for (let x = 0; x < 64; x++) {
            var file = parseInt(x / 8, 10);
            var rank = x % 8;
            if (this.board[file][rank] != null) {
                if (this.getXPositions(file, rank).includes(xPos) && this.getYPositions(file, rank).includes(yPos) && this.board[file][rank].color == color) {
                    var piece = this.board[file][rank];
                    piece.moves(this);
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

    movePiece(selectedPiece, xPos, yPos) {
        for (let x = 0; x < 64; x++) {
            var file = parseInt(x / 8, 10);
            var rank = x % 8;
            if ((this.getXPositions(file, rank).includes(xPos) && this.getYPositions(file, rank).includes(yPos))) {
                if (selectedPiece.moveLst[file][rank] == 1) {
                    this.showMoves(selectedPiece.moveLst, false);
                    selectedPiece.deletePiece(selectedPiece.tile);
                    if (selectedPiece.tile == x) {
                        this.board[file][rank] = selectedPiece;
                        selectedPiece.show();
                        return 1;
                    }
                    selectedPiece.setTile(x);
                    selectedPiece.deletePiece(x);
                    selectedPiece.show();
                    selectedPiece.timesMoved++;
                    this.board[file][rank] = selectedPiece;
                    // this.checkForCheck(selectedPiece.color);
                    return 0;
                } else if (selectedPiece.moveLst[file][rank] == 2) {
                    let rook = this.board[selectedPiece.whichRook[0]][selectedPiece.whichRook[1]];
                    rook.deletePiece(rook.tile);
                    if (rook.tile == 0 || rook.tile == 56) { // im lazy if I think of something better I will fix this
                        rook.setTile(rook.tile + 3);
                    } else {
                        rook.setTile(rook.tile - 2);
                    }
                    this.showMoves(selectedPiece.moveLst, false);
                    selectedPiece.deletePiece(selectedPiece.tile);
                    selectedPiece.setTile(x);
                    selectedPiece.show();
                    rook.show();
                    selectedPiece.timesMoved++;
                    this.board[rook.file][rook.rank] = rook;
                    this.board[selectedPiece.whichRook[0]][selectedPiece.whichRook[1]] = null;
                    this.board[file][rank] = selectedPiece;
                    // this.checkForCheck();
                    return 0;
                } else if (selectedPiece.moveLst[file][rank] == 3) {
                    this.showMoves(selectedPiece.moveLst, false);
                    selectedPiece.deletePiece(selectedPiece.tile);
                    selectedPiece.setTile(x);
                    selectedPiece.deletePiece(x);
                    this.board[file][rank] = new Queen(x, selectedPiece.color);
                    this.board[file][rank].show();
                    this.board[file][rank].timesMoved++;
                    // this.checkForCheck(selectedPiece.color);
                    return 0;
                } else {
                    this.showMoves(selectedPiece.moveLst, false);
                    this.board[selectedPiece.file][selectedPiece.rank] = selectedPiece;
                    selectedPiece.show();
                    if (this.board[file][rank] == null) {
                        return 1;
                    }
                    else if (this.board[file][rank].color == selectedPiece.color) {
                        var piece = this.board[file][rank];
                        piece.moves(this);
                        this.showMoves(piece.moveLst, true);
                        this.changeColor(x, piece);
                        piece.show();
                        this.board[file][rank] = null;
                        return piece;
                    }
                }
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
                    if (letter == "k") {
                        let piece = new King(x, "Black");
                        this.board[file][rank] = piece;
                        this.blackPieces.push(piece)
                    } else {
                        let piece = new King(x, "White");
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

        for (let file = 0; file < this.board.length; file++) {
            for (let rank = 0; rank < this.board[file].length; rank++) {
                if (this.board[file][rank] != null) {
                    this.board[file][rank].show();
                }
            }
        }
    }
}
