var PLAY = 1;
var END = 0;
var gameState = PLAY;
var man, man_running, man_collided;
var ground, groundImg;
var gameOver, gameOverImg;
var restart, restartImg;
var coinsGroup, coinsImg;

var obstaclesGroup, obstacle1, obstacle2, obstacle3;

var score = 0;
var lives = 3;

function preload(){
  groundImg = loadImage("ground.png");
  
  gameOverImg = loadImage("gameOver.png");
  
  restartImg = loadImage("restart.png");
  
  man_running = loadAnimation("man1.png", "man2.png", "man3.png", "man4.png", "man5.png", "man6.png");
  
  man_collided = loadImage("man1.png");
  
  coinImage = loadImage("coin.png");
  
  obstacle2 = loadImage("obstacle2.png");
  
  obstacle1 = loadImage("obstacle1.png");
  
  obstacle3 = loadImage("obstacle3.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  man = createSprite(80, height-70, 50, 50);
  man.addAnimation("running", man_running);
  
  ground = createSprite(width/2, height, width, 50);
  ground.addImage(groundImg);
  ground.x = ground.width/2;
  ground.velocityX = -(6 + 3*score/100);
  
  restart = createSprite(300, 250, 10, 10);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  gameOver = createSprite(300, 200, 10, 10);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  gameOver.visible = false;
  restart.visible = false;
  
  coinsGroup = new Group();
  obstaclesGroup = new Group();
  
  man.debug = false;
  man.setCollider("rectangle", 0, 0, 20, 150);
}

function draw() {
  background("#87ceeb");
  
  textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
  text("lives: "+ lives , 500,60);
  
  if(gameState === PLAY){
    //if(score >= 0){
    //  ground.velocityX = -6;
   // }
      ground.velocityX = -(6 + 3*score/100);
  
  //console.log(man.y);
  
  if((keyDown("space") || touches.length>0) && man.y >= height-120) {
      man.velocityY = -18;
    touches = [];
    }
  
    man.velocityY = man.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    man.collide(ground);
  
  if(coinsGroup.isTouching(man)){
      coinsGroup.destroyEach();
      score=score+1;
    }
  
  if(obstaclesGroup.isTouching(man)){
        lives=lives-1;
       man.x = man.x + 80;
     } 
    if(lives === 0){
          gameState = END;
        }
    spawnCoin();
    spawnObstacles();
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    man.addAnimation("collided", man_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    man.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    
    //change the trex animation
    man.changeAnimation("collided",man_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || touches.length>0) {
      reset();
      touches = [];
    }
  }
  
  
  drawSprites();
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 140 === 0) {
    var coin = createSprite(width+20,height-300,40,10);
    coin.y = Math.round(random(height/2, height/3));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = man.depth;
    man.depth = man.depth + 1;
    
    //add each cloud to the group
    coinsGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-55,10,40);
    obstacle.debug= true;
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  
  man.changeAnimation("running",man_running);
  man.x = 80;
  lives = 3;
  score = 0;
  
}