//*************** DEFINE GLOBALS ****************** 
var width = 1400;
var height = 580;
var animateSpeed = 1500;
var enemySize = 20;
var playerSize = 20;
var highestScore = 0;
var curScore = 0;
var frameSoFar = 0;
var numCollisons = 0;
var collisionDistance = 30;
var enemyFaces = ["001.png", "buster.png", "kenny.png", "kyle.png"];
var enemyClasses = ['enemy', 'enemy spin'];
var board = d3.select('.board').append('svg').attr({width : width, height : height});
var player1 = board.append('image');
var enemyArray = [], enemies;
var curAnimation = moveRandom;

//*************** END GLOBALS ****************** 

/**************** DEFINE FUNCTIONS ****************** \\
- selectRandomEnemy
- selectRandomClass
- generateEnemies
- repeatAnimation
- moveRandom
- playExplosion
- updateScore
- collisionCheck
- movePlayer
***************** FUNCTION DEFS *****************/ 

function selectRandomEnemy () {
  return enemyFaces[Math.floor( Math.random() * enemyFaces.length )];
}

function selectRandomClass () {
  return enemyClasses[Math.floor( Math.random() * enemyClasses.length )]; 
}

function generateEnemies (n){
  for (var i = 0; i<n; ++i){
    enemyArray.push([i, true]);
  }
  enemies = board.selectAll('.enemy').data(enemyArray);

  enemies.enter()
         .append('image')
         .attr('class', selectRandomClass)
         .attr('xlink:href', function () {
           return 'assets/' + selectRandomEnemy();
         })
         .attr({
          'height':playerSize*4+'px', 
          'width':playerSize*4+'px'
        })
         .attr( "x", function(){return Math.random()* width;}) 
         .attr( "y", function(){return Math.random()* height;});
}

function repeatAnimation(animationStyle){  
  curAnimation();
  setTimeout(repeatAnimation, animateSpeed);
}

function moveRandom (){
  var enemies = d3.selectAll('.enemy')
            .transition()
            .ease('cubic-bezier')
            .duration(animateSpeed)
            .attr( "x", function(){return Math.random()* width;}) 
            .attr("y", function(){return Math.random()* height;});
}

function pause () {}

var playExplosion = (function(){     // IIFE to throttle, closure with readyToExplode bool
  var readyToExplode = true;
  return function explode(xPos, yPos){
    if (readyToExplode){
    var explosion = board.append('image')
            .attr('xlink:href', 'assets/explosion.gif')
            .attr({
              'x': xPos-playerSize*2.3, 
              'y':yPos-playerSize*2.3, 
              'height':playerSize*10+'px', 
              'width':playerSize*10+'px'
            });
      readyToExplode = false;
      setTimeout(function(){explosion.remove();}, 750);
      setTimeout(function(){readyToExplode = true;}, 500); 
    }
  };
}());

function updateScore (){
  frameSoFar++;
  if (frameSoFar >= 120){
    curScore++; 
    frameSoFar = 0;
    d3.select(".curScore").text(curScore);
  }
}

function collisionCheck () {
  d3.selectAll('.enemy').each(function(data){
    var enemyX = +(d3.select(this).attr('x').slice(0, -2));
    var enemyY = +(d3.select(this).attr('y').slice(0, -2));
    var player1 = d3.select('.player');
    var player1x = parseInt(player1.attr('x'));
    var player1y = parseInt(player1.attr('y'));

    var readyToExplode = data[1];

    if (readyToExplode && Math.abs(player1x - enemyX) < collisionDistance && Math.abs(player1y - enemyY) < collisionDistance){    // collision happened
      playExplosion(player1x, player1y);
      data[1] = false;
      highestScore = Math.max(curScore, highestScore);
      curScore = 0;
      d3.select('.highscore').text(highestScore);
      d3.select('.numCollisons').text(++numCollisons);
    }
    
    if ( Math.abs(player1x - enemyX) > collisionDistance && Math.abs(player1y - enemyY) > collisionDistance) {
      data[1] = true;
    }

  });

  updateScore();
  requestAnimationFrame(collisionCheck); // update collision info continuously
}

function movePlayer (event){
  var coords = d3.mouse(this);
  if (coords[0] > 110 && coords[0]<  1460) { // mouse is in bounds horizontally
      player1.attr('x', coords[0]-(playerSize*5.9));
  } else if (coords[0] < 110){
    player1.attr('x', 0);
  } else if (coords[0] > 1481){

    player1.attr('x', 1340)
  }
  if (playerSize <= coords[1] && coords[1]+playerSize*2 <=height){ // mouse is in bounds vertically
    player1.attr('y', coords[1]-(playerSize*3.5));
  } else if (coords[1] < 0){
    player1.attr('y', playerSize*3.5);
  } else if (coords[1] > height-(playerSize*3.5)){
    player1.attr('y', height-(playerSize*3.5))
  }
}


