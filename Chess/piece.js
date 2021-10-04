class Piece {
    constructor(tile, color, piece) {
        this.tile = tile;
        this.color = color;
        this.piece = piece;

        this.xPos = tile % 8 * tileWidth;
        this.yPos = parseInt(tile / 8, 10) * tileHeight; // cast double to int
    }
}

class King extends Piece {
    constructor(tile, color) {
        super(tile, color);
        this.piece = "K";
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