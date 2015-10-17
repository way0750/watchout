
var width = 1400;
var height = 580;
var animateSpeed = 1000;
var enemySize = 20;
var playerSize = 20;
var highestScore = 0;
var curScore = 0;
var frameSoFar = 0;
var numCollisons = 0;
var collisionDistance = 30;


var board = d3.select('.board').append('svg').attr({width : width, height : height});

var enemyArray = [], enemies;

function generateEnemies (n){
  for (var i = 0; i<n; ++i){
    enemyArray.push([i, true]);
  }
  enemies = board.selectAll('circle').data(enemyArray);
  enemies.enter()
         .append('image')
         .classed('enemy', true)
         .attr('xlink:href', 'assets/carman.png')
         .attr({
          'height':playerSize*4+'px', 
          'width':playerSize*4+'px'
        })
         .attr( "x", function(){return Math.random()* width}) 
         .attr( "y", function(){return Math.random()* height});

  enemies = board.selectAll('.enemy');
}

generateEnemies(20);

var player1 = board.append('circle');
player1.classed('player', true)
  .attr('r', playerSize + "px").attr('fill', "blue")
  .attr({'stroke': 'black', 'stroke-width':'5px'})
  .attr('cx', width/2)
  .attr('cy', height/2);


var dragBehavior = d3.behavior.drag();

dragBehavior.on('drag', function () {
  var xPos = d3.event.x, yPos = d3.event.y;
  var node = d3.select(this);
  if (playerSize<=xPos && xPos+playerSize*2 <=width) {
      d3.select(this).attr('cx', xPos);
  }
  if (playerSize <= yPos && yPos+playerSize*2 <=height){
    d3.select(this).attr('cy', yPos);
  }
});


player1.call(dragBehavior);
// change cx and cy of each circle for each function call
// then make that function call itself every 1000 ms;

var animate = function(){
  var enemies = d3.selectAll('.enemy')
                  .transition()
                  .ease('cubic-bezier')
                  .duration(animateSpeed)
                  .attr( "x", function(){return Math.random()* width}) 
                  .attr("y", function(){return Math.random()* height});

  setTimeout(animate, animateSpeed);
};


animate();
function playExplosionFactory(){
  var readyToExplode = true;
  var explode = function (xPos, yPos){
    if (readyToExplode){
    var explosion = board.append('image')
            .attr('xlink:href', 'assets/explosion.gif')
            .attr({
              'x': xPos-playerSize*5, 
              'y':yPos-playerSize*5, 
              'height':playerSize*10+'px', 
              'width':playerSize*10+'px'
            });
      readyToExplode = false;
      setTimeout(function(){explosion.remove()}, 750)
      setTimeout(function(){readyToExplode = true;}, 500); 
    }
  }
  return explode;
}
var playExplosion = playExplosionFactory();



function collisionCheck () {
  frameSoFar++;
  if (frameSoFar >= 0){
    curScore++; 
    frameSoFar%=60;
    d3.select("#curScore").text(curScore);
  }

  d3.selectAll('.enemy').each(function(data){
    // debugger;
    var enemyX = +(d3.select(this).attr('x').slice(0, -2));
    var enemyY = +(d3.select(this).attr('y').slice(0, -2));
    var player1 = d3.select('.player');
    var player1x = parseInt(player1.attr('cx'));
    var player1y = parseInt(player1.attr('cy'));
    // console.log(enemyX);

    if (data[1] && Math.abs(player1x - enemyX) < collisionDistance && Math.abs(player1y - enemyY) < collisionDistance){    // collision happened
      playExplosion(player1x, player1y);
      data[1] = false;
      highestScore = Math.max(curScore, highestScore);
      curScore = 0;
      d3.select('#highestScore').text(highestScore);
      d3.select('#numCollisons').text(++numCollisons);
    
    }
    
    if ( Math.abs(player1x - enemyX) > collisionDistance && Math.abs(player1y - enemyY) > collisionDistance) {
      data[1] = true;
    }
  
  });
  requestAnimationFrame(collisionCheck);
}

collisionCheck();
// setInterval(collisionCheck, 10)