

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'My App', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('tile', 'assets/images/tile.png');
	game.load.image('win', 'assets/images/win.png');
	game.load.image('button', 'assets/images/button.png');
	game.load.image('buttonclicked', 'assets/images/buttonclicked.png');
	game.load.image('closeddoor1', 'assets/images/closeddoor1.png');
	game.load.image('closeddoor2', 'assets/images/closeddoor2.png');
	game.load.image('openeddoor1', 'assets/images/openeddoor1.png');
	game.load.image('openeddoor2', 'assets/images/openeddoor2.png');
	game.load.tilemap('map', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('background', 'assets/images/sky.png');
	game.load.spritesheet('player', 'assets/images/player.png', 64, 96);
	game.load.spritesheet('coin', 'assets/images/coins.png', 32, 32);
	game.load.image('heart', 'assets/images/heart.png');
	game.load.image('expl', 'assets/images/expl.png');
}

var bg;
var facing = 'turn';
var jumpTimer = 0;
var map;
var layer;
var player;
var cursors;
var jumpButton;
var enemy;
var enemySpeed = 100;
var score = 0;
var scoreText;
var lifes;
var coins;
var gravity = 400;

function create() {

	//conf
  game.physics.startSystem(Phaser.Physics.ARCADE);
	game.time.desiredFps = 60;

	//background
  bg = game.add.tileSprite(0, 0, 800, 600, 'background');
  bg.fixedToCamera = true;

	//map
	map = game.add.tilemap('map');
	map.addTilesetImage('tile');
	map.addTilesetImage('win');
	map.addTilesetImage('button');
	map.addTilesetImage('buttonclicked');
	map.addTilesetImage('closeddoor1');
	map.addTilesetImage('closeddoor2');
	map.addTilesetImage('openeddoor1');
	map.addTilesetImage('openeddoor2');

	map.setCollisionByExclusion([0,2,3,7,8]);
	layer = map.createLayer('layer01');

	layer.resizeWorld();
	//layer.debug=true;

	//show score
	scoreText = game.add.text(16, 16, 'Score: '+ score, { fontSize: '32px', fill: '#000' });

	//show lifes
	lives = game.add.group();
	game.add.text(320, 16, 'Lives : ', { fontSize: '32px', fill: '#fff' });
	for (var i = 0; i < 3; i++)
    {
        var heart = lives.create(432 + (32 * i), 22, 'heart');
        //heart.anchor.setTo(0.5, 0.5);
    }

	//coins
	coins = game.add.group();
	coins.create(96,96, 'coin',0);
	coins.create(0,352, 'coin',0);
	coins.create(32,448, 'coin',0);
	coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
	coins.callAll('animations.play', 'animations', 'spin');
	//coins.scale.set(0.7,0.7);
	coins.enableBody = true;
	game.physics.enable(coins, Phaser.Physics.ARCADE);
	coins.setAll('body.gravity.y',-gravity);

	//gravity
	game.physics.arcade.gravity.y = gravity;

	//player
	makePlayer();

	//movement
	cursors = game.input.keyboard.createCursorKeys();
  jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	//enemy
	enemy = game.add.sprite(32, 448, 'expl');
	game.physics.enable(enemy, Phaser.Physics.ARCADE);
	enemy.body.collideWorldBounds = true;
	enemy.body.velocity.x=100;
	enemy.scale.set(0.7,0.7);

	//set callback if
	map.setTileIndexCallback([2], function(){win();}, this);
	map.setTileIndexCallback([3], function(){buttonClicked();}, this);
}

function update() {

	//collisions
	game.physics.arcade.collide(player,layer);
	game.physics.arcade.collide(enemy,layer);
	game.physics.arcade.collide(coins,layer);

	//check collisions
	game.physics.arcade.overlap(player,enemy, restart);
	game.physics.arcade.overlap(player, coins, collectCoin);

	//player movement
	player.body.velocity.x = 0;
	if (cursors.left.isDown)
  {
    player.body.velocity.x = -150;

    if (facing != 'left')
    {
        player.animations.play('left');
        facing = 'left';
    }
  }
  else if (cursors.right.isDown)
  {
    player.body.velocity.x = 150;

    if (facing != 'right')
    {
        player.animations.play('right');
        facing = 'right';
    }
  }
  else
  {
      if (facing != 'idle')
      {
          player.animations.stop();

          player.frame = 2;
          facing = 'idle';
      }
    }

	if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
  {
		player.body.velocity.y = -350;
    jumpTimer = game.time.now + 500;
  }

	//enemy movement
	if(enemy.body.blocked.right && enemy.body.blocked.down)
	{
		enemy.body.velocity.x=-enemySpeed;
	}
	if(enemy.body.blocked.left && enemy.body.blocked.down)
	{
		enemy.body.velocity.x=enemySpeed;
	}

}

function makePlayer()
{
	player = game.add.sprite(16, 32, 'player');
	game.physics.enable(player, Phaser.Physics.ARCADE);

	player.body.collideWorldBounds = true;
	player.body.setSize(32, 48, 16, 48);

	player.animations.add('left', [4, 5, 6, 7], 10, true);
  player.animations.add('turn', [2], 20, true);
  player.animations.add('right', [8, 9, 10, 11], 10, true);
}

function restart()
{

	live = lives.getChildAt(lives.countLiving()-1);
	live.kill();
	player.kill();

	if (lives.countLiving() < 1)
  {
		console.log('lose');
	}
	else
	{
		console.log('restart');
		makePlayer();
	}
	//game.state.restart();
}

function win()
{
	console.log('win');
	game.state.restart();
}

function buttonClicked()
{
	console.log('button');
	map.replace(3,4);
	doorOpen();
}

function doorOpen()
{
	console.log('door');
	map.replace(5,7);
	map.replace(6,8);
	map.setCollision(7,false,layer);
	map.setCollision(8,false,layer);
}

function collectCoin (player, coin) {

    // Removes the star from the screen
    coin.kill();

    score += 10;
    scoreText.text = 'Score: ' + score;

}
