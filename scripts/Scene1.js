class Scene1 extends Phaser.Scene {
    constructor() {
        super('bootGame');
    }

    preload() {
   
    }

    create() {

        this.shots = 100;
        this.soapSpawned = false;
        this.coronaMinVelocity = 80;
        this.coronaMaxVelocity = 120;
        this.level = 1;
        this.score = 0;
        this.health = 200;


        // AUDIO
        this.shootSound = this.sound.add('shootSound');
        this.emptyShotSound = this.sound.add('emptyShotSound');
        this.popSound = this.sound.add('popSound');
        this.powerUp = this.sound.add('powerUp');
        this.ouch = this.sound.add('ouch');
        this.loop = this.sound.add('loop', { loop: true });
        this.loop.play();


        // Maintain aspect ratio
        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background').setInteractive();
        this.background.setOrigin(0, 0);
        this.physics.world.setBounds(20, 20, 580, 310);



        //ScoreBox
        var scoreBox = this.add.graphics();
        scoreBox.fillStyle(0x000000, 1);
        scoreBox.beginPath();
        scoreBox.moveTo(0, 0);
        scoreBox.lineTo(config.width, 0);
        scoreBox.lineTo(config.width, 20);
        scoreBox.lineTo(0, 20);
        scoreBox.lineTo(0, 0);
        scoreBox.closePath();
        scoreBox.fillPath();

        this.scoreLabel = this.add.bitmapText(10, 5, 'pixelFont', 'SCORE', 16);
        this.scoreLabel.text = "SCORE " + zeroPad(0, 6);

        this.levelLabel = this.add.bitmapText(400, 5, 'pixelFont', 'LEVEL', 16);
        this.levelLabel.text = "LEVEL " + this.level;

        //HealthBar
        this.healthBarContainer = this.add.graphics();
        //HealthBar
        this.healthBarContainer.fillStyle(0x888888, 1);
        this.healthBarContainer.beginPath();
        this.healthBarContainer.moveTo(165, 5);
        this.healthBarContainer.lineTo(365, 5);
        this.healthBarContainer.lineTo(365, 15);
        this.healthBarContainer.lineTo(165, 15);
        this.healthBarContainer.lineTo(165, 5);
        this.healthBarContainer.closePath();
        this.healthBarContainer.fillPath();

        this.healthLabel = this.add.bitmapText(108, 5, 'pixelFont', 'STRENGTH', 16);
        this.healthBar = this.add.graphics();
        this.updateHealth(this.health);

        //AMMO Section
        this.soapIndicator = this.add.image(195, config.height - 42,'soap');
        this.soapIndicator.setScale(.42);

        //AmmoBar
        this.ammoContainer = this.add.rectangle(325,359, 200,20,0x888888); 
        this.ammoBar = this.add.graphics();
        this.updateAmmo();


        this.player = this.physics.add.sprite(100, config.height - 32, 'player');
        this.player.setGravityY(1000);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1.5)

        //Player Anim
        this.anims.create({
            key: 'player_anim',
            frames: this.anims.generateFrameNumbers('player'),
            frameRate: 10,
            repeat: 2
        });


        //Controls
        this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Touch Coontrols
        this.input.addPointer(3);
        this.flyButton = this.add.image(40, config.height - 40, 'fly', 0).setScale(1.2).setInteractive();
        this.shootButton = this.add.image(config.width - 40, config.height - 40, 'shoot', 0).setScale(1.2).setInteractive();
        this.flyButton.on('pointerdown', () => this.fly());
        this.shootButton.on('pointerdown', () => this.shootBeam());

        //Create Coronas
        this.anims.create({
            key: 'corona_anim',
            frames: this.anims.generateFrameNumbers('corona'),
            frameRate: 20,
            repeat: -1
        });
        this.coronas = this.physics.add.group();

        this.maxObjects = 6;
        this.time.addEvent({
            delay: 3000,
            callback: function () {
                for (var i = 0; i <= this.maxObjects; i++) {
                    var corona = this.physics.add.sprite(32, 32, 'corona');
                    this.coronas.add(corona);
                    this.spawnCorona(corona);
                }
            },
            callbackScope: this,
            loop: false,

        })


        //Beams
        this.anims.create({
            key: 'beam_anim',
            frames: this.anims.generateFrameNumbers('beam'),
            frameRate: 20,
            repeat: -1,
        });


        this.projectiles = this.add.group();

        //Enemy Beam Collisions
        this.physics.add.overlap(this.projectiles, this.coronas, (projectile, corona) => {
            this.killCorona(projectile, corona);
        })


        //Enemy Player Collisions
        this.physics.add.overlap(this.player, this.coronas, (player, corona) => {
            this.hurtPlayer(player, corona);
        })

        //Explosion
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion'),
            frameRate: 40,
            repeat: 0,
            hideOnComplete: true
        });

        //Collider for beams and soap
        this.physics.add.collider(this.projectiles, this.soap, function (projectile, soap) {
            projectile.destroy();
        });



    }


    update(time, delta) {
        //console.log(time,delta);
        //Move Background at speed 1
        this.background.tilePositionX += 1;

        //Monitor Fly Key
        this.flyManager();

        //If bird gets too close to top push down to below scorebar
        if (this.player.y < 40) { this.player.y = 40 };
        //console.log(this.player.y);


        //Once corona leaves canvas re-spawn random position
        for (var i = 0; i < this.coronas.getChildren().length; i++) {
            if (this.coronas.getChildren()[i].x < 0) {
                this.resetCoronaPos(this.coronas.getChildren()[i], 'pass');
            }
        }

        //
        if (Phaser.Input.Keyboard.JustDown(this.rightKey)) {
            this.shootBeam();
        }


        //Make sure projectiles are destroyed when the leave
        for (var i = 0; i < this.projectiles.getChildren().length; i++) {
            var beam = this.projectiles.getChildren()[i];
            beam.update();
        }

        //Update Health Bar
        this.updateHealth(this.health);

        //Update Ammo Bar
        this.updateAmmo();

    }



    flyManager() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            this.fly();
        }
    }

    fly() {
        this.player.play('player_anim');
        this.player.setVelocityY(-300)
    }


    moveCorona(corona, speed) {
        corona.x -= speed;
        if (corona.x < 0) {
            this.resetCoronaPos(corona);
        }
    }

    resetCoronaPos(corona, type) {
        this.spawnCorona(corona);
    }

    shootBeam() {
        if(this.shots < 50 && !this.soapSpawned){
            this.spawnSoap();
        }
        if (this.shots > 0) {
            this.shots--;
            this.shootSound.play();
            new Beam(this);
        } else {   
            this.emptyShotSound.play();
        }
    }

    killCorona(projectile, corona) {
        this.popSound.play();
        var explosion = new Explosion(this, corona.x, corona.y);
        this.score += 15;
        this.scoreLabel.text = "SCORE " + zeroPad(this.score, 6);
        projectile.destroy();
        this.resetCoronaPos(corona);
    }

    killCoronaBySoap(soap, corona) {
        this.popSound.play();
        var explosion = new Explosion(this, corona.x, corona.y);
        this.resetCoronaPos(corona);
    }


    hurtPlayer(player, corona) {
        this.ouch.play();
        this.health -= 20;
        this.player.alpha = .6;
        this.player.x = 60;
        var explosion = new Explosion(this, corona.x, corona.y);
        this.resetCoronaPos(corona, 'crash');
        var tween = this.tweens.add({
            targets: this.player,
            x: 80,
            ease: 'Power1',
            duration: 1000,
            repeat: 0,
            onComplete: function () {
                this.player.alpha = 1;
            },
            callbackScope: this
        })
    }

    

    updateHealth(value) {
        var healthColor = 0x009900;
        if (value < 100) { healthColor = 0xeb9e34 };
        if (value < 50) { healthColor = 0xeb3434 };

        if (value < 1) {
            //Game Over
            this.loop.stop();
            this.scene.start('GameOver',{score:this.score});
            return;
        }
        var newValue = 165 + value;

        this.healthBar.clear();

        this.healthBar.fillStyle(healthColor, 1);
        this.healthBar.beginPath();
        this.healthBar.moveTo(165, 5);
        this.healthBar.lineTo(newValue, 5);
        this.healthBar.lineTo(newValue, 15);
        this.healthBar.lineTo(165, 15);
        this.healthBar.lineTo(165, 5);
        this.healthBar.closePath();
        this.healthBar.fillPath();
        this.healthBar.alpha = 1;
    }

    updateAmmo() {

        this.ammoBar.clear();
        var newValue = 225 + this.shots * 2;

        this.ammoBar.fillStyle(0xffcbcb, 1);
        this.ammoBar.beginPath();
        this.ammoBar.moveTo(225, 349);
        this.ammoBar.lineTo(newValue, 349);
        this.ammoBar.lineTo(newValue, 369);
        this.ammoBar.lineTo(225, 369);
        this.ammoBar.lineTo(225, 349);
        this.ammoBar.closePath();
        this.ammoBar.fillPath();
    }


    gofull() {
        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        }
        else {
            game.scale.startFullScreen(false);
        }
    }

    spawnSoap() {
        if (!this.soapSpawned) {
            this.soapSpawned = true;
            this.soap = this.physics.add.sprite(0,0, 'soap').setRandomPosition(game.config.width/2,0,game.config.width/2,game.config.height);
            this.physics.add.overlap(this.player, this.soap, this.collectAmmo, null, this);
            //this.physics.add.overlap(this.soap, this.coronas, this.killCoronaBySoap, null, this);
            this.soap.setScale(.3);
            this.soap.setVelocity(100,100);
            this.soap.setCollideWorldBounds(true);
            this.soap.setBounce(1);

             //Soap Hits Soap
            this.physics.add.collider(this.projectiles, this.soap, (projectile, soap) => {
            projectile.destroy();  
            this.soap.setVelocityY(100);
           });

        }
    }

    spawnCorona(corona) {
        corona.setRandomPosition(game.config.width + 100, 40, 0, game.config.height - 120);
        var velocity = Phaser.Math.Between(-this.coronaMinVelocity, -this.coronaMaxVelocity);
        corona.setVelocity(velocity, 0);
        corona.flipX = true;
        corona.play('corona_anim');
        corona.setBounce(1)
    }

    collectAmmo(player,soap){

        this.powerUp.play();
      
        this.soap.destroy();
        this.soapSpawned = false;
        this.shots = 100;

        //Each time ammo is collected game gets harder by speeding upt the coronas
        this.coronaMinVelocity += 20;
        this.coronaMaxVelocity += 20;

        //You Also get some health back
        if(this.health < 180){
            this.health += 20;
        }
        var newLevel = this.level+=1;
        this.levelLabel.text = "LEVEL " + newLevel;

    }






}