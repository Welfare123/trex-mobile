var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;

var pulo,checkpoint,morte;

var trex, trex_correndo, trex_colidiu;
var solo, soloinvisivel, imagemdosolo;

var nuvem, grupoden, imagemdanuvem;
var grupodeo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;

var pontuacao;

var um, dois;



function preload(){
  trex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_colidiu = loadAnimation("trex_collided.png");
  
  imagemdosolo = loadImage("ground2.png");
  
  imagemdanuvem = loadImage("cloud.png");
  
  pulo = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3")
  morte = loadSound("die.mp3")
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
    
  um = loadImage("restart.png")
  dois = loadImage("gameOver.png")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-190,20,50);
  trex.addAnimation("running", trex_correndo);
  trex.addAnimation("collided" ,trex_colidiu);
  trex.scale = 0.5;
  
  solo = createSprite(width/2,height-180,400,20);
  solo.addImage("ground",imagemdosolo);
  solo.x = solo.width /2;
    
  gameover = createSprite(width/2,height/2-50);
  gameover.addImage(dois);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(um);
  
  gameover.scale = 0.5;
  restart.scale = 0.5;
    
  soloinvisivel = createSprite(width/2,height-175,width,10);
  soloinvisivel.visible = false;
   
  //criar grupos de obstáculos e de nuvens
  grupodeo = createGroup();
  grupoden = createGroup();
  
     
  trex.setCollider("circle",0,0,40);
  
  
  pontuacao = 0;
  
    
  
}

function draw() {
  
  background(180);
  //exibindo pontuação
  textSize(20);
  text("Pontuação: "+ pontuacao, 500,50);
  
    

  
  if(estadoJogo === JOGAR){
    gameover.visible = false
    restart.visible = false
    //move o solo  
    solo.velocityX = -(4+pontuacao/100);
    //marcando pontuação
    pontuacao = pontuacao + Math.round((frameRate()/60));
    
   if(pontuacao >0&&pontuacao %100===0){
  checkpoint.play();
   }
    
    if (solo.x < 0){
      solo.x = solo.width/2;
    }
    
    //saltar quando a tecla de espaço é pressionada
    if((touches.length>0||keyDown("space"))&& trex.y >= 100) {
       trex.velocityY = -12;
      
    pulo.play();
    
  }
  
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
   
    //gerar as nuvens
    gerarNuvens();
  
    //gerar obstáculos no solo
    gerarObstaculos();
    
    if(grupodeo.isTouching(trex)){
       estadoJogo = ENCERRAR;  
      morte.play();
    }
  }
     else if (estadoJogo === ENCERRAR) {
      gameover.visible = true;
      restart.visible = true;
     
      solo.velocityX = 0;
      trex.velocityY = 0
       
      //altera a animação do Trex
      trex.changeAnimation("collided", trex_colidiu);
     
      //define o tempo de vida dos objetos do jogo para que nunca sejam destruídos
    grupodeo.setLifetimeEach(-1);
    grupoden.setVelocityYEach(2);
     
     grupodeo.setVelocityXEach(0);
     grupoden.setVelocityXEach(-2);   
     }
  
  
  //evita que o Trex caia no solo
  trex.collide(soloinvisivel);

  if ((touches.length>0||mousePressedOver(restart))&&estadoJogo===ENCERRAR) {
    reset();
  }
  
  drawSprites();
}

function gerarObstaculos(){
 if (frameCount % 40 === 0){
   var obstaculo = createSprite(width+20,height-195,10,40);
  obstaculo.velocityX = -(6*2+pontuacao/100);
      
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
      default: break;
    }
   
    //atribuir escala e tempo de duração ao obstáculo         
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;
   
   obstaculo.depth = trex.depth;
    trex.depth = trex.depth + 1;
   
    //adicionar cada obstáculo ao grupo
    grupodeo.add(obstaculo);
 }
}

function gerarNuvens() {
  //escreva o código aqui para gerar as nuvens 
  if (frameCount % 60 === 0) {
    nuvem = createSprite(width+20,height+300,40,10);
    nuvem.y = Math.round(random(10,60));
    nuvem.addImage(imagemdanuvem);
    nuvem.velocityX = -4;
    
     //atribuir tempo de duração à variável
    nuvem.lifetime = 230; 
    
    //ajustando a profundidade
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    nuvem.depth = solo.depth; 
    solo.depth = solo.depth + 1;
    
    
        
    //adiciondo nuvem ao grupo
   grupoden.add(nuvem);
  }
}

function reset() {
estadoJogo=JOGAR;
grupoden.destroyEach();
grupodeo.destroyEach();
pontuacao = 0;
trex.changeAnimation("running", trex_correndo);
}
