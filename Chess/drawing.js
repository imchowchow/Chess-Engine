const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let tileHeight = canvas.height / 8;
let tileWidth = canvas.width / 8;

function drawBoard() {
    let isWhite = false;

    for (let y = 0; y < canvas.height; y += tileHeight){
        isWhite = !isWhite;
        for (let x = 0; x < canvas.width; x += tileWidth){
            if (isWhite){
                ctx.fillStyle = 'rgba(222,185,145,255)';
            }
            else {
                ctx.fillStyle = "rgba(138,73,42,255)";
            }
            isWhite = !isWhite;
            ctx.fillRect(x, y, tileWidth, tileHeight);
        }
    }
}
