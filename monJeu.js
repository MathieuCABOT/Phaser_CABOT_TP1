var config = {

	type: Phaser.AUTO,
	width: 800,
	height: 600,

physics: {
        default: 'arcade',
       
        	arcade: {
            	gravity: { y: 300 },
            	debug: true
        }
},

scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var platforms;
var player;
var cursors; 
var stars;
var scoreText;
var bomb;

var jump =0;




function preload(){
	this.load.image('background','assets/sky.jpg');	
	//this.load.image('fond','assets/fond.png');
	this.load.image('etoile','assets/star2.png');
	this.load.image('sol','assets/platform.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.spritesheet('perso','assets/blabla.png',{frameWidth: 23, frameHeight: 17});


}



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
//l'animation
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});
	
//------------------------------------------------------------------
//ajout des étoiles

	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
}



function update(){
	//vitesse perso (-300)
	if(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(false);
	}

	else if(cursors.right.isDown){
		player.setVelocityX(300);
		player.anims.play('left', true);
		player.setFlipX(true);
	}

	else{
		player.anims.play('stop', true);
		player.setVelocityX(0);
	}
	
	if(cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-330);
	} 

//le double saut
	
	/!if(cursors.up.isDown && jumpCount < 2){
		jump++;
		player.setVelocityY(-330);
	} 

	if(!cursors.up.isDown && jumpCount < 2){
		jump++;
		player.setVelocityY(-330);
	} 


	if(player.body.touching.down){
		jump = 0;
	} !/

	
	
//https://www.html5gamedevs.com/topic/33881-how-to-double-jump-with-phaser/

}
function hitBomb(player, bomb){
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play('turn');
	gameOver=true;
}

function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+ score);

	if(stars.countActive(true)===0){

		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1.001);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}






