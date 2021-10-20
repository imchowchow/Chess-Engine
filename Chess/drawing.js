const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let tileHeight = canvas.height / 8;
let tileWidth = canvas.width / 8;
const totRows = 7;
let border = parseInt($("#canvas").css("border").split(" ")[0]);
const xOffset = parseInt($("div").css("width")) / 2 - (canvas.width / 2);
const yOffset = parseInt($("#canvas").css("margin-top")) + border;

function drawBoard() {
    let isWhite = false;

    for (let y = 0; y < canvas.height; y += tileHeight) {
        isWhite = !isWhite;
        for (let x = 0; x < canvas.width; x += tileWidth) {
            if (isWhite) {
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
