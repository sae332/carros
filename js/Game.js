class Game {
  constructor() {
    this.resetTitle=createElement("h2")
    this.resetButton=createButton("")
    this.liderplacartitulo=createElement("h2")
    this.lider1=createElement("h2")
    this.lider2=createElement("h2")
    this.playerMoving=false
    this.leftAtive=false
    this.explosao=false
  }

  getState(){
var gameStateRef=database.ref("gameState")
gameStateRef.on("value",function(data){
  gameState=data.val()
})
    //defina as funções da classe


}

  

  update(state){
   database.ref("/").update({
     gameState:state
   })
    //defina as funções da classe

  }

  start() {
    
    // crie uma instância de novo jogador
   player=new Player()
    // inicie a variável playerCount
    playerCount=player.getCount()

    form = new Form();
    form.display();

    car1 = createSprite (width/2 - 50, height - 100);
    car1.addImage("car1",car1_img);
    car1.scale = 0.07;
   car1.addImage("blast",explosao)
    // siga o exemplo acima para criar o sprite de car2
    car2 = createSprite (width/2 + 100, height - 100);
    car2.addImage("car2",car2_img);
    car2.scale = 0.07;
car2.addImage("blast",explosao)
    // atribua os objetos ao vetor cars
    cars=[car1,car2]
    moedas=new Group()
    obst1=new Group()
    obst2=new Group()
    var posicao1=[
      {x:width/2-150,y:height-1300,image:obst1Img},
      {x:width/2+250,y:height-1800,image:obst1Img},
      {x:width/2-180,y:height-3300,image:obst1Img},
      {x:width/2-150,y:height-4300,image:obst1Img},
      {x:width/2,y:height-5300,image:obst1Img},
    ]
    var posicao2=[
      {x:width/2+250,y:height-800,image:obst2Img},
      {x:width/2-180,y:height-2300,image:obst2Img},
      {x:width/2,y:height-2800,image:obst2Img},
      {x:width/2+180,y:height-3300,image:obst2Img},
     {x:width/2+250,y:height-3800,image:obst2Img},
     {x:width/2+250,y:height-4800,image:obst2Img},
     {x:width/2-180,y:height-5500,image:obst2Img},
    ]
    combustivel=new Group()
    this.addSprites(combustivel,4,combustivelImg,0.02)
    this.addSprites(moedas,18,moedasImg,0.09)
    this.addSprites(obst1,posicao1.length,posicao1.image,0.04,posicao1)
    this.addSprites(obst2,posicao2.length,posicao2.image,0.04,posicao2)
  }
  addSprites(spriteGroup,numerodesprites,spriteImage,scale,positions=[]){
   for(var i=0;i<numerodesprites;i++){
    var x,y
    if(positions.length>0){
      x=positions[i].x
      y=positions[i].y
      spriteImage=positions[i].image
    }
    else{
   
    
    x=random(width/2+150,width/2-150)
    y=random(-height*4.5,height-400)
  }
    var sprite=createSprite(x,y)
    sprite.addImage(spriteImage)
    sprite.scale=scale
    spriteGroup.add(sprite)
   } 
  }
  handleElements(){
    // adicione os estilos à imagem do título.
    form.hide()
    form.titleImg.position(40,50)
    form.titleImg.class("gameTitleAfterEffect")
    this.resetTitle.html("reiniciar jogo")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+200,40)
    this.resetButton.class("resetButton")
    this.resetButton.position(width/2+230,100)
    this.liderplacartitulo.html("placar")
    this.liderplacartitulo.class("resetText")
    this.liderplacartitulo.position(width/3-50,40)
    this.lider1.class("lidersText")
    this.lider1.position(width/3-40,80)
    this.lider2.class("lidersText")
    this.lider2.position(width/3-40,130)
  }

  play () {

    //chame a função para esconder os elementos
    this.handleElements();
    Player.getPlayerInfo()
    player.getCarsAtEnd()
    this.handleResetButton();
    if(allPlayers !== undefined){
      image(track,0,-height*5,width,height*6)
      this.showlider()
      this.showLife()
      this.showFuel()
      var index=0
      for(var plr  in allPlayers){
        index=index+1
        var x=allPlayers[plr].positionX
        var y=height-allPlayers[plr].positionY
        var currentLife=allPlayers[plr].life
        if(currentLife<=0){
          cars[index-1].changeImage("blast")
          cars[index-1].scale=0.3
          
        }
        cars[index-1].position.x=x
        cars[index-1].position.y=y
      
    
    //chame a função para criar os sprites
    if(index===player.index){
      stroke(10)
      fill("red")
      ellipse(x,y,60,60)
      this.handleCombustivel(index)
      this.handleMoedas(index)
      this.handleColisao(index)
      this.handlecolisaocarros(index)
      if(player.life<=0){
        this.explosao=true
        this.playerMoving=false

      }
      camera.position.y=cars[index-1].position.y
    }
    }
    if(this.playerMoving){
    player.positionY+=5
    player.update()
    }
    this.handlePlayerControls()
    const finishLine=height*6-100
    if(player.positionY>finishLine){
      gameState=2;
      player.rank+=1;
      Player.updateCarsAtEnd(player.rank)
      player.update()
      this.showRank()
    }
    drawSprites()
  }
  }
  handleCombustivel(index){
    cars[index-1].overlap(combustivel,function(collector,collected){
      player.fuel=185
      collected.remove()
    })
    if(player.fuel>0 && this.playerMoving){
    player.fuel-=0.3  
    }
    if(player.fuel<=0){
    gameState=2
    this.gameOver()
    }
  }
  handleMoedas(index){
    cars[index-1].overlap(moedas,function(collector,collected){
      player.score+=21
      player.update()
      collected.remove()
    })
  }
  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        carsAtEnd:0,
        players:{}
      })
      window.location.reload()
    })
  }
  showlider(){
  var lider1,lider2
  var players=Object.values(allPlayers)
  if(players[0].rank === 0 && players[1].rank === 0 || players[0].rank === 1){
    lider1=
    players[0].rank+
    "&emsp;"+
    players[0].name+
    "&emsp;"+
    players[0].score;
    lider2=
    players[1].rank+
    "&emsp;"+
    players[1].name+
    "&emsp;"+
    players[1].score;
  }
  if(players[1].rank === 1){
    lider1=
    players[1].rank+
    "&emsp;"+
    players[1].name+
    "&emsp;"+
    players[1].score;
    lider2=
    players[0].rank+
    "&emsp;"+
    players[0].name+
    "&emsp;"+
    players[0].score;
  }
  this.lider1.html(lider1)
  this.lider2.html(lider2)  
  }
  handlePlayerControls(){
    if(!this.explosao){

    
    if(keyIsDown(UP_ARROW)){
      player.positionY += 10
      player.update()
      this.playerMoving=true
    }
    if(keyIsDown(LEFT_ARROW) && player.positionX>width/3-50){
      this.leftAtive=true
      player.positionX-=5
      player.update()
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionX<width/2+300){
      this.leftAtive=false
      player.positionX+=5
      player.update()
    }
  }
  }
  showRank(){
    swal({
      title:`Incrivel!${"\n"}Jogador${"\n"}${player.rank}`,
      text:"Voce alcancou a linha de chegada com sucesso",
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmButtonText:"Ok"
    })
  }
  gameOver(){
    swal({
      title:`Fim de jogo`,
      text:"Ops, voce perdeu a corrida",
      imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize:"100x100",
      confirmButtonText:"Obrigado por jogar"
    })
  }
  showLife(){
  push()
  image(lifeImg,width/2-130,height-player.positionY-400,20,20)
  fill("white")
  rect(width/2-100,height-player.positionY-400,185,20)
  fill("#f50057")
  rect(width/2-100,height-player.positionY-400,player.life,20)
  noStroke()
  pop()
  }
  showFuel(){
    push()
    image(combustivelImg,width/2-130,height-player.positionY-300,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-300,185,20)
    fill("#f50057")
    rect(width/2-100,height-player.positionY-300,player.fuel,20)
    noStroke()
    pop()
    }
  handleColisao(index){
if(cars[index-1].collide(obst1) || (cars[index-1].collide(obst2))){
  if(this.leftAtive){
    player.positionX+=100
  }
  else{
    player.positionX-=100
  }
  if(player.life>0){
    player.life-=185/4
  }
  player.update()
}
  }
  handlecolisaocarros(index){
    if(index===1){
      if(cars[index-1].collide(cars[1])){
      if(this.leftAtive){
        player.positionX+=100
      }
      else{player.positionX-=100}
      if(player.life>0){
        player.life-=185/4
      }
      player.update()
    }
  }
    if(index===2){
      if(cars[index-1].collide(cars[0])){
      if(this.leftAtive){
        player.positionX+=100
      }
      else{player.positionX-=100}
      
      if(player.life>0){
        player.life-=185/4
      }
      player.update()
    }
  }
  }
  end(){
  console.log("fim de jogo")
  }
}
