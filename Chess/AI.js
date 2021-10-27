class AI {
    constructor(board, color) {
        this.pieces = (color == "White") ? board.whitePieces : board.blackPieces;
    }

    chooseRandomMove() {
        while (true) {
            var index = Math.floor(Math.random() * this.pieces.length);
            var piece = this.pieces[index];
            piece.moves(board);
            index = Math.floor(Math.random() * piece.moveLst.length);
            if (piece.moveLst[index] != piece.tile && piece.moveLst.length > 0) {
                board.movePiece(board.board[piece.file][piece.rank], piece.moveLst[index]);
                break;
            }
        }
    }

    moveGenerationTest(depth, color) {
        if (depth == 0) {
            return 1;
        }

        var pieces = (color) ? board.whitePieces : board.blackPieces;
        var numPositions = 0;
        for (var x = 0; x < pieces.length; x++) {
            var piece = pieces[x];
            piece.moves(board);
            var oldTile = piece.tile;
            var moves = piece.moveLst.filter(function (value) {
                return value != oldTile;
            })
            for (var y = 0; y < moves.length; y++) {
                oldTile = piece.tile;
                board.movePiece(piece, moves[y])
                numPositions += this.moveGenerationTest(depth - 1, !color);
                board.movePiece(piece, oldTile);
            }
        }

        return numPositions;
    }
}