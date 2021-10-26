class AI {
    constructor(board, color) {
        this.pieces = (color == "White") ?  board.whitePieces : board.blackPieces;
    }

    chooseMove() {
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
}