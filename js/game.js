
class Boot extends Phaser.State
{
	preload()
	{
		console.log("Boot preload");
	}

	create()
	{
		console.log("Boot create");
	}

	update()
	{
		console.log("Boot update");
		this.game.state.start("Preload");
	}
}

class Preload extends Phaser.State
{
	preload()
	{
		console.log("Preload preload");
	}

	create()
	{
		console.log("Preload create");
	}

	update()
	{
		console.log("Preload update");
		this.game.state.start("Title");
	}
}

class Title extends Phaser.State
{
	preload()
	{
		console.log("Title preload");
		console.log(game.width);
		console.log(game.world.width);
		this.game.load.image('background', 'assets/images/background600.png');
		game.load.spritesheet('buttonstart', 'assets/images/button-start.png', 401, 143);
		game.load.spritesheet('buttonachievements', 'assets/images/button-achievements.png', 363, 135);
	}

	create()
	{
		console.log("Title create");
		this.start=false;
		this.achievements=false;
		this.bg=this.game.add.tileSprite(0, 0, 800, 600, 'background');

		var buttonStart = this.game.add.button((game.width-401*0.7)/2,(game.width-260)/2,'buttonstart', ()=>{this.start=true;}, this, 1, 0, 2);
		buttonStart.scale.set(0.7,0.7)
		var buttonAchievements = this.game.add.button((game.width-363*0.7)/2,(game.width)/2,'buttonachievements', ()=>{this.achievements=true;}, this, 1, 0, 2);
		buttonAchievements.scale.set(0.7,0.7)
	}

	update()
	{
		console.log("Title update");
		if(this.start===true)
			this.game.state.start("Main");
		if(this.achievements===true)
			this.game.state.start("Achievements");
	}
}

class Achievements extends Phaser.State
{
	preload()
	{
		console.log("Achievements preload");
	}

	create()
	{
		console.log("Achievements create");
		this.game.add.button(0,0,"play",()=>{this.back=true;});
		this.back=false;
	}

	update()
	{
		console.log("Achievements update");
		if(this.back===true)
			this.game.state.start("Title");
	}
}

class Main extends Phaser.State
{
	managePause()
	{
		this.game.paused = true;
		var rect = game.add.graphics(0, 0);
		rect.beginFill(0x66b266, 0.5);
		rect.drawRect(0, 0, game.width, game.height);
		var buttoncontinue = this.game.add.button(400,400,'button-continue', ()=>{pausedText.destroy();rect.destroy();buttoncontinue.destroy();buttonback.destroy();this.game.paused = false;});
		buttoncontinue.scale.set(0.6,0.6);
		var buttonback = this.game.add.button(150,400,'button-back',()=>{this.game.state.start("Title");this.game.paused = false;}, this);
		buttonback.scale.set(0.6,0.6);
		var pausedText = this.add.text(100, 250, "Game paused.\nTap button to continue\nor back to main menu.", this._fontStyle);
	}
	preload()
	{
		console.log("Main preload");
		this.game.load.image('menu', 'assets/images/menu.png');
		this.game.load.image('button-continue', 'assets/images/button-continue.png');
		this.game.load.image('button-back', 'assets/images/button-back.png');
		this.game.load.image('tile', 'assets/images/tile.png');
		this.game.load.image('win', 'assets/images/win.png');
		this.game.load.image('button', 'assets/images/button.png');
		this.game.load.image('buttonclicked', 'assets/images/buttonclicked.png');
		this.game.load.image('closeddoor1', 'assets/images/closeddoor1.png');
		this.game.load.image('closeddoor2', 'assets/images/closeddoor2.png');
		this.game.load.image('openeddoor1', 'assets/images/openeddoor1.png');
		this.game.load.image('openeddoor2', 'assets/images/openeddoor2.png');
		this.game.load.tilemap('map', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('background', 'assets/images/bckpix.png');
		this.game.load.spritesheet('player', 'assets/images/player.png', 64, 96);
		this.game.load.spritesheet('coin', 'assets/images/coins.png', 32, 32);
		this.game.load.image('heart', 'assets/images/heart.png');
		this.game.load.image('expl', 'assets/images/expl.png');
	}

	create()
	{
		console.log("Main create");
		//game configuration
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.time.desiredFps = 60;
		console.log("Game configured");

		//background settings
		this.bg=this.game.add.tileSprite(0, 0, 800, 600, 'background');
		this.bg.fixedToCamera = true;
		console.log("Background set");

		//map images loading
		this.map=this.game.add.tilemap('map');
		this.map.addTilesetImage('tile');
		this.map.addTilesetImage('win');
		this.map.addTilesetImage('button');
		this.map.addTilesetImage('buttonclicked');
		this.map.addTilesetImage('closeddoor1');
		this.map.addTilesetImage('closeddoor2');
		this.map.addTilesetImage('openeddoor1');
		this.map.addTilesetImage('openeddoor2');
		this.map.setCollisionByExclusion([0,2,3,7,8]);
		console.log("Map loaded");

		//creating layer of map
		this.layer=this.map.createLayer('layer01');
		this.layer.resizeWorld();
		console.log("Layers created");

		//setting constants
		this.gravity=400;
		this.enemySpeed=100;
		this.maxLives=3;
		console.log("Constants set");

		//setting variables
		this.facing='turn';
		this.jumpTimer=0;
		this.score=0;
		this.gameOver=false;
		this.updates=0;
		console.log("Variables set");

		//setting hud elements
		this.scoreText=this.game.add.text(16,16,'Score: '+this.score,{fontSize:'32px',fill:'#000'});
		this.lives=this.game.add.group();
		this.game.add.text(320,16,'Lives: ',{fontSize:'32px',fill:'#fff'});
		for(let i=0;i<this.maxLives;i++)
			this.heart=this.lives.create(432+(32*i),22,'heart');
		var buttonmenu = this.game.add.button(this.game.width-56,10,'menu', ()=>{this.managePause();});
		buttonmenu.scale.set(0.5,0.5);
		console.log("Hud set",this.scoreText);

		//setting map elements
		this.coins=this.game.add.group();
		this.coins.create(96,96, 'coin',0);
		this.coins.create(0,352, 'coin',0);
		this.coins.create(32,448, 'coin',0);
		this.enemy=this.game.add.sprite(32, 448, 'expl');
		console.log("Map elements set");

		//enabling animations
		this.coins.callAll('animations.add','animations','spin', [0, 1, 2, 3, 4, 5], 10, true);
		this.coins.callAll('animations.play','animations','spin');
		console.log("Animations set");

		//enabling controls
		this.cursors=this.game.input.keyboard.createCursorKeys();
		this.jumpButton=this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		console.log("Controls set");

		//enabling physics for elements
		this.game.physics.arcade.gravity.y=this.gravity;
		console.log("Physics enabled");

		//enemy physics
		this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
		this.enemy.body.collideWorldBounds = true;
		this.enemy.body.velocity.x=100;
		this.enemy.scale.set(0.7,0.7);
		console.log("Enemy physics set");

		//player creation
		this.makePlayer();
		console.log("Player physics set");

		//coins physics
		this.game.physics.enable(this.coins,Phaser.Physics.ARCADE);
		this.coins.enableBody=true;
		this.coins.setAll('body.gravity.y',-(this.gravity));
		console.log("Coin physics set");

		//set map elements callbacks
		this.map.setTileIndexCallback([2], ()=>{this.game.state.start("GameWon");}, this);
		this.map.setTileIndexCallback([3], ()=>{this.buttonClicked();}, this);
		console.log("Map callbacks set");
	}

	update()
	{
		//collisions
		this.game.physics.arcade.collide(this.player,this.layer);
		this.game.physics.arcade.collide(this.enemy,this.layer);
		this.game.physics.arcade.collide(this.coins,this.layer);

		//check collisions
		this.game.physics.arcade.overlap(this.player,this.enemy,this.restart,null,this);
		this.game.physics.arcade.overlap(this.player,this.coins,this.collectCoin,null,this);

		//player movement
		this.player.body.velocity.x = 0;
		if (this.cursors.left.isDown)
		{
			this.player.body.velocity.x = -150;

			if (this.facing != 'left')
			{
				this.player.animations.play('left');
				this.facing = 'left';
			}
		}
		else if (this.cursors.right.isDown)
		{
			this.player.body.velocity.x = 150;

			if (this.facing != 'right')
			{
				this.player.animations.play('right');
				this.facing = 'right';
			}
		}
		else
		{
			if (this.facing != 'idle')
			{
				this.player.animations.stop();

				this.player.frame = 2;
				this.facing = 'idle';
			}
		}

		if (this.jumpButton.isDown && this.player.body.onFloor() && this.game.time.now > this.jumpTimer)
		{
			this.player.body.velocity.y = -350;
			this.jumpTimer = game.time.now + 500;
		}

		//enemy movement
		if(this.enemy.body.blocked.right && this.enemy.body.blocked.down)
		{
			this.enemy.body.velocity.x=-this.enemySpeed;
		}
		if(this.enemy.body.blocked.left && this.enemy.body.blocked.down)
		{
			this.enemy.body.velocity.x=this.enemySpeed;
		}

		console.log("Main update");
		if(this.gameOver===true)
			this.game.state.start("GameOver");
	}

	buttonClicked()
	{
		this.map.replace(3,4);
		this.doorOpen();
	}

	collectCoin(player, coin)
	{
		coin.kill();
		this.score+=10;
		this.scoreText.text='Score: '+this.score;
	}

	doorOpen()
	{
		this.map.replace(5,7);
		this.map.replace(6,8);
		this.map.setCollision(7,false,this.layer);
		this.map.setCollision(8,false,this.layer);
	}

	makePlayer()
	{
		this.player = this.game.add.sprite(16, 32, 'player');
		this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

		this.player.body.collideWorldBounds = true;
		this.player.body.setSize(32, 48, 16, 48);

		this.player.animations.add('left', [4, 5, 6, 7], 10, true);
		this.player.animations.add('turn', [2], 20, true);
		this.player.animations.add('right', [8, 9, 10, 11], 10, true);
	}

	restart()
	{
		this.live=this.lives.getChildAt(this.lives.countLiving()-1);
		this.live.kill();
		this.player.kill();

		if (this.lives.countLiving() < 1)
		{
			console.log('lose');
		}
		else
		{
			console.log('restart');
			this.makePlayer();
		}
	}
}

class GameOver extends Phaser.State
{
	preload()
	{
		console.log("GameOver preload");

	}

	create()
	{
		console.log("GameOver create");
		this.game.add.button(0,0,"play",()=>{this.restart=true;});
		this.restart=false;
	}

	update()
	{
		console.log("GameOver update");
		if(this.restart===true)
			this.game.state.start("Title");
	}
}

class GameWon extends Phaser.State
{
	preload()
	{
		console.log("GameWon preload");
	}

	create()
	{
		console.log("GameWon create");
		this.game.add.button(0,0,"play",()=>{this.restart=true;});
		this.restart=false;
	}

	update()
	{
		console.log("GameWon update");
		if(this.restart===true)
			this.game.state.start("Title");
	}
}

class Game extends Phaser.Game
{
	constructor()
	{
		super(800,600,Phaser.AUTO,'');

		this.state.add('Boot', Boot, false);
		this.state.add('Preload', Preload, false);
		this.state.add('Title', Title, false);
		this.state.add('Achievements', Achievements, false);
		this.state.add('Main', Main, false);
		this.state.add('GameOver', GameOver, false);
		this.state.add('GameWon', GameWon, false);

		this.state.start('Boot');
	}
}

let game=new Game();
