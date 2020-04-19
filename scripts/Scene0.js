class Scene0 extends Phaser.Scene {
    constructor() {
        super('welcome');
    }

    preload(){
        this.load.image('start', 'assets/startbutton.png');
        this.load.image('welcome', 'assets/welcome.png');
        this.load.image('gameover', 'assets/gameover.png');
        this.load.image('handwash', 'assets/handwash-2x.gif');
        this.load.image('full_screen_button', 'assets/full_screen_button.png');
        this.load.image('start_button', 'assets/start_button.png');
        this.load.image('try_again_button', 'assets/try_again_button.png');
        this.load.image('welcome', 'assets/welcome.png');
        this.load.image('welcome', 'assets/welcome.png');
        this.load.image('background', 'assets/background.png');
        this.load.spritesheet('player', 'assets/bird.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('corona', 'assets/corona.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('beam', 'assets/beam.png', { frameWidth: 16, frameHeight: 16 });
        this.load.bitmapFont('pixelFont', 'assets/font/font.png', '../assets/font/font.xml');
        this.load.spritesheet('explosion', 'assets/coronaExplode.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('fly', 'assets/button_fly.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('shoot', 'assets/button_shoot.png', { frameWidth: 64, frameHeight: 64 });
        this.load.image('soap', 'assets/soap.png', { frameWidth: 106, frameHeight: 61 });

        this.load.audio('shootSound', 'assets/audio/shoot.mp3');
        this.load.audio('emptyShotSound', 'assets/audio/emptyShot.mp3');
        this.load.audio('popSound', 'assets/audio/pop.mp3');
        this.load.audio('loop', 'assets/audio/loop.mp3');
        this.load.audio('powerUp', 'assets/audio/powerUp.mp3');
        this.load.audio('ouch', 'assets/audio/ouch.mp3');
    }

    create(){

        this.welcome = this.add.tileSprite(0, 0, config.width, config.height, 'welcome');
        this.welcome.setOrigin(0, 0);

        var full_screen_button = this.add.image(config.width/2, config.height * .75,'full_screen_button').setInteractive();
        full_screen_button.setScale(1.5);
        full_screen_button.on('pointerup', ()=>{
            this.scale.startFullscreen();
        });

        var start_button = this.add.image(config.width/2, config.height * .90,'start_button').setInteractive();
        start_button.setScale(1.5);
        start_button.on('pointerup', ()=>{
            this.scene.start('bootGame');
        });

    }

    update(){

    }

}