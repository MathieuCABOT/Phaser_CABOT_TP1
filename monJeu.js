//------------------------------------------------------------------
// taille de fenetre de jeu
var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,

    //moteur physique et gravité	
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },

// prelode = chargement des assets
// creat = c'est notre niveau
// update = c'est le comportement du jeu ( réaction au imput,etc...)

scene: {
		preload: preload,
		create: create,
		update: update
	}
};

//------------------------------------------------------------------
//déclaration des variables

var game = new Phaser.Game(config);

var score = 0;
var scoreText;

var platforms;
var player;
var cursors; 
var stars;
var bomb;

var vie = 3;
var vieText;
var coeur;

var jump = 1;


//------------------------------------------------------------------
function preload(){

	// fichier incorporé dans le jeu
	this.load.image('background','assets/sky.jpg');	
	this.load.image('etoile','assets/star.png');
	this.load.image('coeur','assets/coeur.png');
	this.load.image('sol','assets/platform.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.spritesheet('perso','assets/blabla.png',{frameWidth: 23, frameHeight: 17});
}

//------------------------------------------------------------------
//le design de niveau et incorporation du joueur
function create(){
	this.add.image(400,300,'background');

	platforms = this.physics.add.staticGroup();

		platforms.create(310,490,'sol').setScale(0.15,1).refreshBody();
		platforms.create(10,460,'sol').setScale(0.15).refreshBody();


		platforms.create(480,500,'sol').setScale(0.15).refreshBody();
		platforms.create(600,500,'sol').setScale(0.15).refreshBody();
		platforms.create(400,460,'sol').setScale(0.15).refreshBody();

		platforms.create(600,590,'sol').setScale(0.15).refreshBody();
		platforms.create(670,590,'sol').setScale(0.15).refreshBody();
		platforms.create(740,590,'sol').setScale(0.15).refreshBody();
		platforms.create(810,590,'sol').setScale(0.15).refreshBody();

		platforms.create(100,368,'sol').setScale(0.15).refreshBody();
		platforms.create(170,368,'sol').setScale(0.15).refreshBody();
		platforms.create(240,368,'sol').setScale(0.15).refreshBody();
		platforms.create(310,368,'sol').setScale(0.15).refreshBody();
	
		player = this.physics.add.sprite(20,400,'perso');
		player.setCollideWorldBounds(true);
		player.setBounce(0.2);
		player.body.setGravityY(000);
		this.physics.add.collider(player,platforms);
	
	cursors = this.input.keyboard.createCursorKeys(); 

//------------------------------------------------------------------
//ajout de l'animation du perso	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:5}],
		frameRate: 10
	});

//------------------------------------------------------------------
//le spawn du coeur
	coeur = this.physics.add.group({
		key: 'coeur',
		setXY: {x:400,y:0,stepX:70}
	});
		//rebond du coeur
	    coeur.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(1, 1));
    });
	    //mise en place des colisions
		this.physics.add.collider(coeur,platforms);
		this.physics.add.overlap(player,coeur,collectCoeur,null,this);
//------------------------------------------------------------------
//le spawn des etoiles
	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});
		//rebond des étoiles
	    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.4));
    });
	    //mise en place des colisions
		this.physics.add.collider(stars,platforms);
		this.physics.add.overlap(player,stars,collectStar,null,this);

//------------------------------------------------------------------
//affichage des pvs et du score
	vieText = this.add.text(16,16, 'PV: 3', {fontSize: '32px', fill:'#000'});
	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	
	//colison des bombs
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
}

//------------------------------------------------------------------
//evenement en cours de jeu
function update(){

//------------------------------------------------------------------
//les inputs
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(true);
	}

	else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(false);
	}

	else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}


	if (cursors.down.isDown){
		player.setVelocityY(230);
	}

//-------------------------------------------------------------
// tentative(s) du double saut (ne fonctionne pas)
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-330);
		jump = 1;
	} 

if(!player.body.touching.down && cursors.up.isDown && jump === 1){
		jump = --jump;
		player.setVelocityY(-330);
	} 
/*
if(cursors.up.isDown){
		jump = --jump;
	
		if(jump === 1){
		player.setVelocityY(-330);
		jump = --jump;
		} 

		if(jump === 2){
		player.setVelocityY(-330);
		jump = --jump;
		} 
}
*/
/*
	if(!cursors.up.isDown && jump < 2){
		jump++;
		player.setVelocityY(-330);
	} 
*/



/*
if (savesaut === 0 && player.body.touching.down && cursor.up.isDown) {
	//player.anims.play('jump',true);
	player.set setVelocityY(-500);
	savesaut = 1;
	veriftouche = 0;
}


if (cursor.up.isDown) {
	player.anims.play('jump',true);
}

if (cursor.up.isUp) {
	veriftouche = 1;
}
if(savesaut === 1 && cursors.up.isDown && veriftouche ===1) {
	player.setVelocityY(-500);
	savesaut = 0;
}

else if (cursors.down.isDown && !player.body.touching.down) {
	player.setVelocityY(2000);
	//player.anims.play('stop',true);
}
*/
}

//------------------------------------------------------------------
//quand on touche la bombe
function hitBomb(player, bomb){
vie = --vie;

vieText.setText('PV: '+vie);
	
	if(vie===0){
		this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play('turn');
		gameOver=true;
	}
}

//------------------------------------------------------------------
//quand on touche une etoile
function collectStar(player, star){
	
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		//spawn des bombs
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1.001);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(200, 200), 20);
	}
}

//------------------------------------------------------------------
//quand on touche un coeur
function collectCoeur(player, coeur){
	coeur.disableBody(true,true);
	if(vie < 3){
		vie = ++vie;
		vieText.setText('PV: '+vie);
	}
}

//------------------------------------------------------------------