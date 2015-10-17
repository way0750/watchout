
generateEnemies(10);

player1.classed('player', true)
  .attr('xlink:href', 'assets/carman.png')
  .attr({
    'height':playerSize*4+'px', 
    'width':playerSize*4+'px'
  })
  .attr('x', 25)
  .attr('y', 25);


repeatAnimation(moveRandom);


collisionCheck();


d3.select('.board').on("mousemove", movePlayer);
