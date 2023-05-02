class Game {
  constructor() {}
  //BP
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  //BP
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  // AP
  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("carro1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("carro2", car2_img);
    car2.scale = 0.07;

    cars = [car1, car2];

    fuelsGroup = new Group();
    powerCoinsGroup = new Group();

    this.addSprites(fuelsGroup, 4, fuelImage, 0.02);
    this.addSprites(powerCoinsGroup, 18, powerCoinImage, 0.09);
  }

  addSprites(spriteGroup, nbSprites, spriteImg, scale){
    for(var i = 0; i < nbSprites; i++){
      var x = random(width/2 + 150, width/2 - 150);
      var y = random(- height * 4.5, height - 400);

      var sprite = createSprite(x,y);
      sprite.addImage(spriteImg);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  //BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
  }

  //SA
  play() {
    this.handleElements();

    Player.getPlayersInfo(); //added

    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      //índice da matriz
      var index = 0;
      for (var plr in allPlayers) {
        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        cars[index].x = x;
        cars[index].y = y;

        //adicione 1 ao índice de cada loop
        index = index + 1;

        if(index === player.index){
          fill("red");
          stroke(10);
          ellipse(x,y,60,60);

          this.handleFuel(index);
          this.handlePowerCoins(index);
        }
      }

      // manipule os eventos do teclado
      if (keyIsDown(UP_ARROW)) {
        player.positionY += 10;
        player.update();
      }
 
      drawSprites();
    }
  }

  handleFuel(index){
    cars[index-1].overlap(fuelsGroup, function(collector, collected){
      player.fuel = 185;
      collected.remove();
    });
  }


  handlePowerCoins(index){
    cars[index-1].overlap(powerCoinsGroup, function(collector, collected){
      player.score += 21;
      player.update();
      collected.remove();
    });
  }

}
