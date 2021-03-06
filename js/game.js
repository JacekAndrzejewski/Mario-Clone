/*jshint esversion:6*/
let debug=false;


class Boot extends Phaser.State
{
	preload()
	{
		if(debug)
			console.log("Boot preload");
	}

	create()
	{
		if(debug)
			console.log("Boot create");
	}

	update()
	{
		if(debug)
			console.log("Boot update");
		this.game.state.start("Preload");
	}
}

class Preload extends Phaser.State
{
	preload()
	{
		if(debug)
			console.log("Preload preload");
	}

	create()
	{
		if(debug)
			console.log("Preload create");
		this.game.highScore=0;
		this.game.score=0;
		this.game.sumScore=0;
		this.game.currentLevel=1;
	}

	update()
	{
		if(debug)
			console.log("Preload update");
		this.game.state.start("Title");
	}
}

class Title extends Phaser.State
{
	preload()
	{
		if(debug)
			console.log("Title preload");
		this.game.load.image('background', 'assets/images/background608.png');
		this.game.load.image('score-board', 'assets/images/window2.png');
		this.game.load.spritesheet('buttonstart', 'assets/images/button-start.png', 401, 143);
		this.game.load.spritesheet('buttonachievements', 'assets/images/button-achievements.png', 363, 135);
	}

	create()
	{
		if(debug)
			console.log("Title create");
		this.start=false;
		this.achievements=false;
		this.bg=this.game.add.tileSprite(0, 0, 800, 608, 'background');
		this.scoreBoard=this.game.add.tileSprite(85, 81,250,74, 'score-board');
		this.scoreTotalBoard=this.game.add.tileSprite(85, 161,250,74, 'score-board');

		this.totalScore=this.game.add.text(100,100,'Total: '+this.game.sumScore,{fontSize:'26px',fill:'#000'});
		this.scoreText=this.game.add.text(100,180,'Highscore: '+this.game.highScore,{fontSize:'26px',fill:'#000'});

		this.buttonStart = this.game.add.button((game.width-401*0.7)/2,(game.width-260)/2,'buttonstart', ()=>{this.start=true;}, this, 1, 0, 2);
		this.buttonStart.scale.set(0.7,0.7);
		this.buttonAchievements = this.game.add.button((game.width-363*0.7)/2,(game.width)/2,'buttonachievements', ()=>{this.achievements=true;}, this, 1, 0, 2);
		this.buttonAchievements.scale.set(0.7,0.7);
	}

	update()
	{
		if(debug)
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
		this.game.load.image('score-board', 'assets/images/window2.png');
		this.game.load.image('background', 'assets/images/background608.png');
		this.game.load.image('button-back', 'assets/images/button-back.png');
		this.game.load.image('star', 'assets/images/star.png');
		if(debug)
			console.log("Achievements preload");
	}

	create()
	{
		if(debug)
			console.log("Achievements create");
		this.bg=this.game.add.tileSprite(0, 0, 800, 608, 'background');
		this.buttonBack=this.game.add.button((game.width+100)/2,(game.height+250)/2,"button-back",()=>{this.back=true;});
		this.buttonBack.scale.set(0.6,0.6);


		this.achievs=this.game.add.group();
		for(let i=0;i<4;i++)
			this.scoreBoard=this.achievs.create((game.width-250)/2, 81+(80*i), 'score-board');

		this.game.add.text(300,107,'Collect 20 points',{fontSize:'16px',fill:'#000'});
		this.game.add.text(300,187,'Collect 50 points',{fontSize:'16px',fill:'#000'});
		this.game.add.text(300,267,'Collect 100 points',{fontSize:'16px',fill:'#000'});
		this.game.add.text(300,347,'Collect 150 points',{fontSize:'16px',fill:'#000'});

		this.star1=this.game.add.tileSprite(450, 90,50,47, 'star');
		this.star2=this.game.add.tileSprite(450, 170,50,47, 'star');
		this.star3=this.game.add.tileSprite(450, 250,50,47, 'star');
		this.star4=this.game.add.tileSprite(450, 330,50,47, 'star');
		if(this.game.sumScore>=20)this.star1.alpha=1;else this.star1.alpha=0.3;
		if(this.game.sumScore>=50)this.star1.alpha=1;else this.star2.alpha=0.3;
		if(this.game.sumScore>=100)this.star1.alpha=1;else this.star3.alpha=0.3;
		if(this.game.sumScore>=150)this.star1.alpha=1;else this.star4.alpha=0.3;

		this.back=false;
	}

	update()
	{
		if(debug)
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
		let x=game.camera.x;
		let y=game.camera.y;
		let rect = game.add.graphics(x,y);
		rect.beginFill(0x66b266, 0.5);
		rect.drawRect(0, 0, game.width, game.height);
		let buttoncontinue = this.game.add.button(400+x,400+y,'button-continue', ()=>{pausedText.destroy();rect.destroy();buttoncontinue.destroy();buttonback.destroy();this.game.paused = false;});
		buttoncontinue.scale.set(0.6,0.6);
		let buttonback = this.game.add.button(150+x,400+y,'button-back',()=>{this.game.state.start("Title");this.game.paused = false;}, this);
		buttonback.scale.set(0.6,0.6);
		let pausedText = this.add.text(100+x, 250+y, "Game paused.\nTap button to continue\nor back to main menu.", this._fontStyle);
	}
	preload()
	{
		if(debug)
			console.log("Main preload");
		this.game.load.image('menu', 'assets/images/menu.png');
		this.game.load.image('button-continue', 'assets/images/button-continue.png');
		this.game.load.image('button-back', 'assets/images/button-back.png');
		this.game.load.spritesheet('tileset32', 'assets/maps/tileset32.png', 32, 32);
		this.game.load.tilemap('map', 'assets/maps/level'+this.game.currentLevel+'.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('background', 'assets/images/bckpix.png');
		this.game.load.spritesheet('player', 'assets/images/player.png', 64, 96);
		this.game.load.spritesheet('coin', 'assets/images/coins.png', 32, 32);
		this.game.load.spritesheet('flag', 'assets/images/flag.png', 32, 32);
		this.game.load.image('heart', 'assets/images/heart.png');
		this.game.load.image('expl', 'assets/images/expl.png');
		this.game.load.image('bullet', 'assets/images/bullet.png');
		this.game.load.image('bulletShot', 'assets/images/bulletShot.png');
	}

	create()
	{
		if(debug)
			console.log("Main create");
		//game configuration
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.time.desiredFps = 60;
		if(debug)
			console.log("Game configured");

		//background settings
		this.bg=this.game.add.tileSprite(0, 0, 800, 608, 'background');
		this.bg.fixedToCamera = true;
		if(debug)
			console.log("Background set");

		//map images loading
		this.map=this.game.add.tilemap('map');
		this.map.addTilesetImage('tiles', 'tileset32');
		this.map.setCollisionByExclusion([0,6,7]);
		if(debug)
			console.log("Map loaded");

		//creating layer of map
		this.layer=this.map.createLayer('ground');
		this.layer.resizeWorld();
		if(debug)
			console.log("Layers created");

		//setting constants
		this.gravity=400;
		this.enemySpeed=100;
		this.playerSpeed=200;
		this.maxLives=3;
		this.bulletsCount=0;
		if(debug)
			console.log("Constants set");

		//setting variables
		this.facing='turn';
		this.jumpTimer=0;
		this.game.score=0;
		this.gameOver=false;
		this.updates=0;
		this.game.bulletAlive=0;
		if(debug)
			console.log("Variables set");

		//setting hud elements
		this.scoreText=this.game.add.text(16,16,'Score: '+game.score,{fontSize:'32px',fill:'#000'});
		this.scoreText.fixedToCamera=true;
		this.lives=this.game.add.group();
		this.livesText=this.game.add.text(320,16,'Lives: ',{fontSize:'32px',fill:'#000000'});
		for(let i=0;i<this.maxLives;i++)
			this.heart=this.lives.create(412+(32*i),22,'heart');
		this.lives.setAll('fixedToCamera',true);
		this.livesText.fixedToCamera=true;
		this.bulletsCountText=this.game.add.text(530,16,'Bullets: '+ this.bulletsCount,{fontSize:'32px',fill:'#000'});
		this.bulletsCountText.fixedToCamera=true;
		this.bulletsImg=this.game.add.tileSprite(675,10,32,32,'bullet');
		this.bulletsImg.fixedToCamera=true;
		this.buttonmenu = this.game.add.button(this.game.width-56,10,'menu', ()=>{this.managePause();});
		this.buttonmenu.scale.set(0.5,0.5);
		this.buttonmenu.fixedToCamera=true;
		if(debug)
			console.log("Hud set",this.scoreText);

		//bullets Physics
		this.bullets=this.game.add.group();
		this.game.physics.enable(this.bullets,Phaser.Physics.ARCADE);
		this.bullets.enableBody=true;
		this.map.createFromTiles(14,null, 'bullet', 'elements', this.bullets);
		this.bullets.setAll('body.gravity.y',-(this.gravity));
		if(debug)
			console.log("Bullets physics set");

		//coins physics
		this.coins=this.game.add.group();
		this.game.physics.enable(this.coins,Phaser.Physics.ARCADE);
		this.coins.enableBody=true;
		this.map.createFromTiles(5,null, 'coin', 'coins', this.coins);
		this.coins.setAll('body.gravity.y',-(this.gravity));
		if(debug)
			console.log("Coin physics set");

		//set flag
		this.flag=this.game.add.group();
		this.game.physics.enable(this.flag,Phaser.Physics.ARCADE);
		this.flag.enableBody=true;
		this.map.createFromTiles(13,null, 'flag','elements',this.flag);
		if(debug)
			console.log("Flag set");

		//enemies physics
		this.enemies=this.game.add.group();
		this.game.physics.enable(this.enemies,Phaser.Physics.ARCADE);
		this.enemies.enableBody=true;
		this.map.createFromTiles(8,null, 'expl', 'enemies', this.enemies);
		this.enemies.scale.set(0.7,0.7);
		this.boss=this.enemies.getChildAt(0);
		this.boss.scale.set(1.5,1.5);
		this.enemies.setAll('body.velocity.x', this.enemySpeed);
		this.enemies.setAll('body.bounce.x', 1);
		this.enemies.setAll('body.collideWorldBounds',true);
		this.boss.body.velocity.x=this.enemySpeed*0.8;

		if(debug)
			console.log("Enemies physics set");

		//enabling animations
		this.flag.callAll('animations.add','animations','flagmove', [0, 1], 3, true);
		this.flag.callAll('animations.play','animations','flagmove');

		this.coins.callAll('animations.add','animations','spin', [0, 1, 2, 3, 4, 5], 10, true);
		this.coins.callAll('animations.play','animations','spin');
		if(debug)
			console.log("Animations set");

		//enabling controls
		this.cursors=this.game.input.keyboard.createCursorKeys();
		this.jumpButton=this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		if(debug)
			console.log("Controls set");

		//enabling physics for elements
		this.game.physics.arcade.gravity.y=this.gravity;
		if(debug)
			console.log("Physics enabled");

		//player creation
		this.makePlayer();
		if(debug)
			console.log("Player physics set");

		//follow camera
		this.game.camera.follow(this.player);

		//set map elements callbacks
		this.map.setTileIndexCallback([6], ()=>{this.buttonClicked();}, this);
		if(debug)
			console.log("Map callbacks set");
	}

	update()
	{
		if(debug)
			console.log("Main update");
		//collisions
		this.game.physics.arcade.collide(this.player,this.layer);
		this.game.physics.arcade.collide(this.enemies,this.layer);
		this.game.physics.arcade.collide(this.flag,this.layer);
		this.enemyUpdate();
		this.game.physics.arcade.collide(this.enemies,this.enemies,this.enemyEnemyCollide);
		this.game.physics.arcade.collide(this.bullet,this.layer,this.bulletLayerCollide);

		//check collisions
		this.game.physics.arcade.overlap(this.player,this.enemies,this.restart,null,this);
		this.game.physics.arcade.overlap(this.player,this.coins,this.collectCoin,null,this);
		this.game.physics.arcade.overlap(this.player,this.flag,()=>{this.game.state.start("GameWon");},null,this);
		this.game.physics.arcade.overlap(this.player,this.bullets,this.collectBullet,null,this);
		this.game.physics.arcade.overlap(this.bullet,this.enemies,this.shoot,null,this);

		//player movement
		this.player.body.velocity.x = 0;
		if (this.cursors.left.isDown)
		{
			this.player.body.velocity.x = -(this.playerSpeed);

			if (this.facing != 'left')
			{
				this.player.animations.play('left');
				this.facing = 'left';
			}
		}
		else if (this.cursors.right.isDown)
		{
			this.player.body.velocity.x = (this.playerSpeed);

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

		if (this.cursors.up.isDown && this.player.body.onFloor() && this.game.time.now > this.jumpTimer)
		{
			this.player.body.velocity.y = -350;
			this.jumpTimer = game.time.now + 500;
		}

		//shooting
		if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			if(this.facing=='right'||this.facing=='left')
			{
				if(this.bulletsCount > 0 && this.game.bulletAlive==0)
				{
					console.log("Bull:"+this.bullet);
					this.game.bulletAlive=1;
					this.bulletsCount--;
					this.bulletsCountText.text='Bullets: '+this.bulletsCount;
					this.bullet = this.game.add.sprite(this.player.body.x+8,this.player.body.y+12,'bulletShot');
					//this.bullet.anchor.setTo(0.5);
					this.game.physics.arcade.enable(this.bullet);
					this.bullet.body.gravity.y=-(this.gravity);
					if(this.facing=='right')
					{
						//bullet.body.x+=16;
						this.bullet.body.velocity.x=200;
					}
					else
					{
						this.bullet.scale.setTo(-1);
						this.bullet.body.velocity.x=-200;
					}
				}
			}
		}

		if(debug)
			console.log("Main update");

		if(this.gameOver===true)
			this.game.state.start("GameOver");
	}

	enemyUpdate()
	{
		this.boss.body.velocity.x=this.player.body.x<this.boss.body.x?-this.enemySpeed*0.5:this.enemySpeed*0.5;
		this.boss.body.velocity.y=this.player.body.y<this.boss.body.y?-this.enemySpeed*0.5:this.enemySpeed*0.5;
	}

	buttonClicked()
	{
		this.map.replace(6,7);
		this.doorOpen();
	}

	collectCoin(player,coin)
	{
		coin.kill();
		this.game.score+=10;
		this.scoreText.text='Score: '+this.game.score;
	}

	collectBullet(player,bullet)
	{
		bullet.kill();
		this.bulletsCount++;
		this.bulletsCountText.text='Bullets: '+this.bulletsCount;
	}

	shoot (bullet, enemy)
	{
		bullet.kill();
		enemy.animations.stop();
		enemy.body.enable = false;
		enemy.kill();
	}

	doorOpen()
	{
		this.map.replace(9,11);
		this.map.replace(10,12);
		this.map.setCollision(11,false,this.layer);
		this.map.setCollision(12,false,this.layer);
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
		if(this.lives.countLiving()>0)
			this.live=this.lives.getChildAt(this.lives.countLiving()-1);
		else
			this.live=this.lives.getChildAt(0);

		this.live.kill();
		this.player.kill();

		if (this.lives.countLiving() < 1)
		{
			this.game.state.start("GameOver");
			if(debug)
				console.log('lose');
		}
		else
		{
			if(debug)
				console.log('restart');
			this.makePlayer();
			this.game.camera.follow(this.player);
		}
	}

	enemyEnemyCollide(enemy, enemy2)
	{
		if(enemy.body.touching.down)
		{
			enemy.body.velocity.x *= -1;
			enemy2.body.velocity.y*=-1;
		}
	}

	bulletLayerCollide(bullet,layer)
	{
		bullet.kill();
		console.log(bullet.game);
		console.log("Al:"+bullet.game.bulletAlive);
		bullet.game.bulletAlive=0;
	}
}

class GameOver extends Phaser.State
{
	preload()
	{
		this.game.load.image('background', 'assets/images/background608.png');
		this.game.load.image('button-back', 'assets/images/button-back.png');
		this.game.load.image('button-tryagain', 'assets/images/button-tryagain.png');
		if(debug)
			console.log("GameOver preload");

	}

	create()
	{
		if(debug)
			console.log("GameOver create");
		this.bg=this.game.add.tileSprite(0, 0, 800, 608, 'background');
		this.textLose=this.add.text(260, 100, "YOU LOST!", {fontSize:'50px',fill:'#ff0000'});
		game.sumScore+=game.score;
		this.game.currentLevel=1;

		if(game.score>game.highScore)
		{
			this.scoreText=this.game.add.text(230,230,'NEW HIGH SCORE: '+this.game.score,{fontSize:'32px',fill:'#ff5000'});
			game.highScore=game.score;
		}
		else
		{
			this.scoreText=this.game.add.text(260,240,'Score: '+this.game.score,{fontSize:'32px',fill:'#000'});
		}
		this.textDiscription = this.add.text(250,300, "Tap button to try again\nor back to main menu.");
		this.buttonTryagain=this.game.add.button((game.width-600)/2,(game.height+250)/2,"button-tryagain",()=>{this.restart=true;});
		this.buttonTryagain.scale.set(0.7,0.7);
		this.buttonContinue=this.game.add.button((game.width+100)/2,(game.height+250)/2,"button-back",()=>{this.back=true;});
		this.buttonContinue.scale.set(0.7,0.7);
		this.back=false;
		this.restart=false;
	}

	update()
	{
		if(debug)
			console.log("GameOver update");
		if(this.restart===true)
			this.game.state.start("Main");
		if(this.back===true)
			this.game.state.start("Title");
	}
}

class GameWon extends Phaser.State
{
	preload()
	{
		this.game.load.image('background', 'assets/images/background608.png');
		this.game.load.image('button-back', 'assets/images/button-back.png');
		this.game.load.image('button-continue', 'assets/images/button-continue.png');
		if(debug)
			console.log("GameWon preload");
	}

	create()
	{
		if(debug)
			console.log("GameWon create");
		this.bg=this.game.add.tileSprite(0, 0, 800, 608, 'background');
		this.buttonBack=this.game.add.button((game.width-600)/2,(game.height+250)/2,"button-back",()=>{this.back=true;});
		this.buttonBack.scale.set(0.7,0.7);
		this.buttonContinue=this.game.add.button((game.width+100)/2,(game.height+250)/2,"button-continue",()=>{this.continue=true;});
		this.buttonContinue.scale.set(0.7,0.7);

		this.textLose=this.add.text(260, 100, "YOU WON!", {fontSize:'50px',fill:'#ff0000'});
		game.sumScore+=game.score;
		game.currentLevel++;

		if(game.score>game.highScore)
		{
			this.scoreText=this.game.add.text(230,230,'NEW HIGH SCORE: '+this.game.score,{fontSize:'32px',fill:'#ff5000'});
			game.highScore=game.score;
		}
		else
		{
			this.scoreText=this.game.add.text(260,240,'Score: '+this.game.score,{fontSize:'32px',fill:'#000'});
		}

		this.back=false;
		this.continue=false;
	}

	update()
	{
		if(debug)
			console.log("GameWon update");
		if(this.back===true)
			this.game.state.start("Title");
		if(this.continue===true)
		{
			if(game.currentLevel==2)
				this.game.state.start("Main");
		}
		if(game.currentLevel>2)
		{
			this.buttonContinue.visible=false;
			this.add.text(250,300, "CONGRATULATIONS!\nYOU FINISHED THE GAME.");
			game.currentLevel=1;
		}

	}
}

class Game extends Phaser.Game
{
	constructor()
	{
		super(800,608,Phaser.AUTO,'');

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
