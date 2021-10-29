class AI {
    constructor(board, color) {
        this.pieces = (color == "White") ? board.whitePieces : board.blackPieces;

        const pawnValue = 10;
        const knightValue = 30;
        const bishopValue = 30;
        const rookValue = 50;
        const queenValue = 90;
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

    evalulate (isWhite) {
        var whiteVal = this.countMaterial(true);
        var blackVal = this.countMaterial(false);

        var evalulation = whiteVal - blackVal;

        var perspective = (isWhite) ? 1 : -1;
        return evalulation * perspective; // since white should be positive and black should be negative
    }   

    countMaterial(isWhite) {
        count = 0;
        var pieces = (isWhite) ? board.whitePieces : board.blackPieces;
        for (var x = 0; x < pieces.length; x++) {
            switch (pieces[x].piece) {
                case "P":
                    count += pawnValue;
                    break;
                case "N":
                    count += knightValue;
                    break;
                case "B":
                    count += bishopValue;
                    break;
                case "R":
                    count += rookValue;
                    break;
                case "Q":
                    count += queenValue;
                    break;
                default:
                    console.log("Error at switch fsr");
                    break;
            }
        }
    }
    
    search(depth, color) {
        if (depth == 0) {
            return this.evalulate(color);
        }

        var pieces = (color) ? board.whitePieces : board.blackPieces;


        var allMoves = [];
        for (var x = 0; x < pieces.length; x++) { // generate all moves to check if its checkmate and stuff
            var piece = pieces[x];
            allMoves.concat(piece.moves(board));
        }

        // if ()
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
                var oldPiece = board.movePiece(piece, moves[y], true);
                numPositions += this.moveGenerationTest(depth - 1, !color);
                board.unmakeMove(piece, oldTile, oldPiece);
            }
        }

        return numPositions;
    }
}