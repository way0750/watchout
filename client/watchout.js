
var width = 960;
var height = 580;
var animateSpeed = 1000;
var enemySize = 0.7;
var playerSize = 1;



var board = d3.select('.board').append('svg').attr({width : width, height : height});

var enemyArray = [], enemies;

function generateEnemies (n){
  for (var i = 0; i<n; ++i){
    enemyArray.push(i);
  }
  enemies = board.selectAll('circle').data(enemyArray);
  enemies.enter().append('circle').classed('enemy', true).attr('r', enemySize + "em").attr({'fill' : 'red', 'stroke':'black', 'stroke-width' : '5px'});
  enemies = board.selectAll('.enemy');
}

generateEnemies(20);

var player1 = board.append('circle');

player1.classed('player', true)
  .attr('r', playerSize + "em").attr('fill', "blue")
  .attr('cx', width/2)
  .attr('cy', height/2);


var dragBehavior = d3.behavior.drag();
dragBehavior.on('drag', function () {
  var xPos = d3.event.x, yPos = d3.event.y;
  d3.select(this).attr('cx', xPos)
      .attr('cy', yPos);
})


      // d3.select('.enemy').each(function(){
      //   var enemyX = +(d3.select(this).attr('cx').slice(0, -2));
      //   var enemyY = +(d3.select(this).attr('cy').slice(0, -2));
      //   console.log(enemyY, enemyX, xPos, yPos);
      //   if (Math.abs(xPos - enemyX) < 100 && Math.abs(yPos - enemyY) < 100){
      //     alert('TAG!');
      //   }
      // })
player1.call(dragBehavior);

// change cx and cy of each circle for each function call
// then make that function call itself every 1000 ms;

var animate = function(){
  var enemies = d3.selectAll('.enemy')
                  .transition()
                  .ease('cubic-bezier')
                  .duration(animateSpeed)
                  .attr( "cx", function(){return Math.random()* width}) 
                  .attr("cy", function(){return Math.random()* height});

  setTimeout(animate, animateSpeed);
};


animate();