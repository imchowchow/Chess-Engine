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
                return [board.board[piece.file][piece.rank], piece.moveLst[index]];
            }
        }
    }

    evalulateBoard (isWhite) {
        var whiteVal = this.countMaterial(true);
        var blackVal = this.countMaterial(false);

        var evalulation = whiteVal - blackVal;

        var perspective = (isWhite) ? 1 : -1;
        return evalulation * perspective; // since white should be positive and black should be negative
    }   

    countMaterial(isWhite) {
        var count = 0;
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
                    break;
            }
        }
        return count;
    }
    
    search(depth, color) {
        if (depth == 0) {
            return this.evalulateBoard(color);
        }

        var pieces = (color) ? board.whitePieces : board.blackPieces;


        var allMoves = [];
        for (var x = 0; x < pieces.length; x++) { // generate all moves to check if its checkmate and stuff
            var piece = pieces[x];
            allMoves.concat(piece.moves(board));
        }
        var kingTile = (color) ? board.whiteKingTile : board.blackKingTile;
        var king = pieces.find(piece => piece.tile == kingTile)

        if (allMoves.length == pieces.length - 1) { 
            if (king.check) {
                return Number.NEGATIVE_INFINITY;
            }
            return 0;
        }

        var idk = this.chooseRandomMove();
        var bestEval = [-Infinity, idk[0], idk[1]];
        // var bestEval = -Infinity;
        // var bestMove = [0, 1] // werid stuff incoming

        for (var x = 0; x < pieces.length; x++) {
            var piece = pieces[x];
            piece.moves(board);
            var oldTile = piece.tile;
            var moves = piece.moveLst.filter(function (value) {
                return value != oldTile;
            });
            for (var y = 0; y < moves.length; y++) {
                oldTile = piece.tile;
                var oldPiece = board.movePiece(piece, moves[y], true);
                var evalulation = -this.search(depth - 1, !color);
                if (evalulation > bestEval[0]) {
                    bestEval[0] = evalulation;
                    bestEval[1] = piece;
                    bestEval[2] = moves[y];
                }
                // bestEval = Math.max(evalulation, bestEval);
                board.unmakeMove(piece, oldTile, oldPiece);
            }
        }

        return bestEval;
    }

    chooseMove(depth, isWhite) {
        var moves = this.search(depth, isWhite);
        return [moves[1], moves[2]];
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