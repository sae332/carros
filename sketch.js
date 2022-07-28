var canvas;
var backgroundImage, bgImg, car1_img, car2_img, track;
var database, gameState;
var form, player, playerCount;
var allPlayers, car1, car2;
var cars = [];
var moedas
var combustivel
var moedasImg
var combustivelImg
var lifeImg
var obst1,obst1Img,obst2,obst2Img
var explosao
function preload() {
  backgroundImage = loadImage("./assets/background.png");

  // adicione a imagem para os jogadores
car1_img= loadImage("assets/car1.png")
car2_img= loadImage("assets/car2.png")
track= loadImage("assets/track.jpg")
moedasImg= loadImage("assets/goldCoin.png")
combustivelImg= loadImage("assets/fuel.png")
lifeImg= loadImage("assets/life.png")
obst1Img= loadImage("assets/obstacle1.png")
obst2Img= loadImage("assets/obstacle2.png")
explosao= loadImage("assets/blast.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
  bgImg = backgroundImage;
}

function draw() {
  background(bgImg);

  // verifica número de jogadores conectados
  if(playerCount===2){
    game.update(1)
  }
  // verifica o estado do jogo para começar a partida
  if(gameState===1){
    game.play()
  }
  if(gameState===2){
    game.showlider()
    game.end()
  }
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
