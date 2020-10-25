var canvas;
var canvasContext;

var ballX = 70;
var ballY = 70;

var ballXSpeed = 5;
var ballYSpeed = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;

var playerScore = 0;
var pcScore = 0;

const WINNING_SCORE = 3;

const PADDLE_THICKNESS = 10;
const PADDLE_HEIGT = 100;

function calculateMousePosition(event) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = event.clientX - rect.left - root.scrollLeft;
    var mouseY = event.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}
function handleMouseClick(event) {
    if(showingWinScreen) {
        playerScore = 0;
        pcScore = 0;
        showingWinScreen = false;
    }
}
window.onload = () => {
    // basico da criacao do canvas
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    // determinando fps
    var framesPerSecond = 90;

    // funcao para intervalar o "refresh" da pagina
    drawEverything();
    setInterval(() => {
        drawEverything();
        moveEverything();
    }, 1000 / framesPerSecond);
    canvas.addEventListener('mousemove', (event) => {
        var mousePos = calculateMousePosition(event);
        paddle1Y = mousePos.y - (PADDLE_HEIGT / 2);
    }
    )
    canvas.addEventListener('mousedown', handleMouseClick);
}

function drawNet () {
    for(var i = 0; i<canvas.height; i+=40) {
        colorRect(canvas.width/2-1, i, 2, 20, 'grey');
    }
}


function drawEverything() {
    // pinta o canvas de preto
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    
    if (showingWinScreen) {
        if (playerScore >= WINNING_SCORE) {
            canvasContext.fillStyle = "white";
            canvasContext.fillText("Jogador Venceu!", 350, 200);
        }
        
        else if (pcScore >= WINNING_SCORE) {
            canvasContext.fillStyle = "white";
            canvasContext.fillText("PC Venceu!", 350, 200);
        }
        canvasContext.fillStyle = "white";
        canvasContext.fillText("Clique para continuar", 350, 400);
        return;
    }
    // chama a funcao de desenhar a rede
    drawNet();
    // pinta a raquete do jogador a esquerda
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGT, 'white');

    // pinta a raquete do pc a direita
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGT, 'white');

    // chamada de funcao para criar a bola
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(playerScore, 100, 100);
    canvasContext.fillText(pcScore, canvas.width - 100, 100);
}
// funcao que cria a bola
function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

// funcao que reseta a bola
function ballReset() {
    if (playerScore >= WINNING_SCORE || pcScore >= WINNING_SCORE) {
    
        showingWinScreen = true;
    }

    ballXSpeed = -ballXSpeed;
    ballYSpeed = 2

    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

//funcao do movimento do pc
function computerMovement() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGT / 2);

    if (paddle2YCenter - 30 < ballY) {
        paddle2Y += 10;
    } if (paddle2YCenter + 30 > ballY) {
        paddle2Y -= 10;
    }
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }

    computerMovement();
    // atualiza a posicao da bola em relacao a velocidade dela
    ballX = ballX + ballXSpeed;
    ballY = ballY + ballYSpeed;
    // faz a bola nao sair do canvas no eixo X
    if (ballX >= canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGT) {
            ballXSpeed = - ballXSpeed;

            var deltaY = ballY - (paddle2Y + PADDLE_HEIGT / 2);
            ballYSpeed = deltaY * 0.35;
        } else {
            playerScore++;
            ballReset();
        }
    }
    if (ballX <= 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGT) {
            ballXSpeed = - ballXSpeed;

            var deltaY = ballY - (paddle1Y + PADDLE_HEIGT / 2);
            ballYSpeed = deltaY * 0.35;
        } else {
            pcScore++;
            ballReset();
        }

    }

    // faz a bola nao sair do canvas no eixo Y
    if (ballY >= canvas.height - 10) {
        ballYSpeed = -ballYSpeed;
    }
    if (ballY <= 10) {
        ballYSpeed = -ballYSpeed;
    }

}
// funcao para pintar o canvas e seus elementos
function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}
